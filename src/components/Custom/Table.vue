<template>
    <div>
        <div class="form-group">
            <div class="form-label">
                Result amount:
            </div>
            <select v-model="query.limit" @change="() => loadPage(1)" class="form-control col-md-3">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="all">All</option>
            </select>
        </div>
        <div class="table-wrapper">
            <table class="table table-striped table-bordered">
                <thead>
                <tr>
                    <th v-for="c in $props.cols" class="th-sm header-col" @click="setSort(c)">
                        {{c.name}}

                        <template v-if="c.sort">
                            <i class="fas fa-sort-amount-up" v-if="$props.query.sort === (+c.sort)"></i>
                            <i class="fas fa-sort-amount-down" v-else-if="$props.query.sort === ('-'+c.sort)"></i>
                        </template>
                    </th>
                </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td :colspan="$props.cols.length">
                            Loading ...
                        </td>
                    </tr>
                    <tr v-else-if="rows.length > 0" v-for="r in rows">
                        <td v-for="c in $props.cols">
                            <template v-if="c.type === 'actions'">
                                <a v-for="a in c.actions" href="javascript:void(0)" @click="() => {a.action(r)}">{{a.text}}</a>
                            </template>
                            <template v-else>
                                {{readField(r, c)}}
                            </template>
                        </td>
                    </tr>
                    <tr v-else>
                        <td :colspan="$props.cols.length">
                            Nothing found ...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ul class="pagination table-pagination" v-if="!loading">
            <li class="page-item" v-if="page > 1"><a class="page-link" @click="() => loadPage(page - 1)">Previous</a></li>
            <li v-for="i in pageRange()" :class="page === i ? 'page-item active' : 'page-item'"><a class="page-link" @click="() => loadPage(i)">{{i}}</a></li>
            <li class="page-item" v-if="page < pages"><a class="page-link" @click="() => loadPage(page + 1)">Next</a></li>
        </ul>

        <div class="form-group" v-if="pages > 10">
            <input :placeholder="'Page 1-' + pages" v-model="pageFilter" @change="() => loadPage(pageFilter)" class="form-control col-md-3">
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            setSort(col) {
                if(!col.sort) {
                    return
                }
                let set = col.sort

                if(this.$props.query.sort === ( col.sort)) {
                    set = '-' + col.sort
                }

                this.query.sort = set
                this.loadPage(1)
            },

            readField(row, colConfig) {
                if(!colConfig.field) {
                    return ''
                }
                try {
                    let pts = colConfig.field.split('.')

                    let v = row
                    let done = false
                    pts.forEach(p => {
                        v = v[p]
                    })

                    if (colConfig.morph) {
                        v = colConfig.morph(v)
                    }

                    return v
                }
                catch (e) {
                    return ''
                }
            },

            pageRange() {
                let start = this.page
                start -=5
                if(start < 1) {
                    start = 1
                }

                let range = []

                for(let i=0; i<10; i++) {
                    let p = start + i
                    if(p > this.pages) {
                        break
                    }

                    range.push(p)
                }

                return range
            },

            loadPage(page) {
                let me = this
                page = parseInt(page)
                if (isNaN(page) || page > Math.max(me.pages, 1) || page < 1) {
                    return
                }

                me.page = page
                let query = me.$props.query
                let filter = {sort: query.sort}
                me.loading = true

                if (query.limit !== 'all') {
                    filter.limit = parseInt(query.limit)
                    filter.offset = (me.page - 1) * parseInt(query.limit)
                } else {
                    filter.limit = 9999999
                }

                if (me.query.filter) {
                    Object.assign(filter, query.filter)
                }

                this.$graph(
                    me.query.table,
                    [
                        'totalDocs',
                        {
                            'docs': query.fields
                        }
                    ],
                    filter,
                    true
                ).then(response => {
                    me.rows = response.docs
                    if (query.limit === 'all') {
                        me.pages = 1
                    } else {
                        me.pages = Math.ceil(response.totalDocs / query.limit)
                    }
                    me.loading = false
                })
            }
        },

        created() {
            let me = this
            me.loadPage(1)
        },

        data() {
            return {
                rows: [],
                pages: 1,
                page: 1,
                pageFilter: '',
                loading: true
            }
        },

        props: {
            cols: Array,
            query: Object
        },

        components: {
        }
    }
</script>

<style>
    .table-pagination {
        max-width: 100%;
        flex-wrap: wrap;
    }

    .header-col:hover,
    .header-col:hover i{
        text-decoration: underline;
        color: darkgrey;
    }

    .table-wrapper {
        max-width: 100%;
        overflow-x: scroll;
    }
</style>