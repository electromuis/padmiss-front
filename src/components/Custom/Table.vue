<template>
    <div>
        <div class="form-group">
            <div class="form-label">
                Result ammount:
            </div>
            <select v-model="query.limit" @change="() => loadPage(1)" class="form-control">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="all">All</option>
            </select>
        </div>
        <table class="table table-striped table-bordered">
            <thead>
            <tr>
                <th v-for="c in $props.cols" class="th-sm">{{c.name}}</th>
            </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td :colspan="$props.cols.length">
                        Loading ...
                    </td>
                </tr>
                <tr v-else v-for="r in rows">
                    <td v-for="c in $props.cols">{{readField(r, c)}}</td>
                </tr>
            </tbody>
        </table>

        <ul class="pagination table-pagination" v-if="!loading">
            <li class="page-item"><a class="page-link" @click="() => loadPage(page - 1)">Previous</a></li>
            <li v-for="i in pages" :class="page === i ? 'page-item active' : 'page-item'"><a class="page-link" @click="() => loadPage(i)">{{i}}</a></li>
            <li class="page-item"><a class="page-link" @click="() => loadPage(page + 1)">Next</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        methods: {
            readField(row, colConfig) {
                if(!colConfig.field) {
                    return ''
                }

                let pts = colConfig.field.split('.')

                let v = row
                pts.forEach(p => {
                    if(typeof v[p] !== 'undefined') {
                        v = v[p]
                    }
                })

                if(colConfig.morph) {
                    v = colConfig.morph(v)
                }

                return v
            },

            pageRange() {
                return [1,2,3]
            },

            loadPage(page) {
                let me = this
                if(page > me.pages || page < 1) {
                    return
                }

                me.page = page
                let query = me.$props.query
                let filter = {sort: query.sort}
                me.loading = true

                if(query.limit !== 'all') {
                    filter.limit = parseInt(query.limit)
                    filter.offset = (me.page - 1) * parseInt(query.limit)
                }
                else {
                    filter.limit = 9999999
                }

                if(me.query.filter) {
                    Object.assign(filter, query.filter)
                }

                this.$graph.query(
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
                    if(query.limit === 'all') {
                        me.pages = 1
                    }
                    else {
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
</style>