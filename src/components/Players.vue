<template>
    <div>
        <h1>Players</h1>

        <div class="form-group">
            <div class="form-label">
                Filter:
            </div>
            <input v-model="filter" class="form-control col-md-12" />
        </div>

        <Table ref="table" :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './Custom/Table.vue'
    import TournamentMixin from './../mixins/TournamentMixin'

    let me = null

    export default {
        mixins: [TournamentMixin],

        created() {
            me = this
        },

        methods: {
            updateFilter() {
                if(this.filter) {
                    this.query.filter = {
                        '$or': [
                            {
                                'nickname': {
                                    '$regex': this.filter,
                                    "$options": 'i'
                                }
                            },
                            {
                                'shortNickname': {
                                    '$regex': this.filter,
                                    "$options": 'i'
                                }
                            }
                        ]
                    }
                }
                else {
                    this.query.filter = null
                }

                this.$refs.table.loadPage(1)
            }
        },

        data() {
            return {
                filter: '',
                cols: [
                    {
                        field: 'nickname',
                        name: 'Nickname',
                        sort: 'nickname'
                    },
                    {
                        field: 'shortNickname',
                        name: 'Short',
                        sort: 'shortNickname'
                    },
                    {
                        field: 'country.name',
                        name: 'Country'
                    },
                    {
                        type: 'actions',
                        actions: [
                            {
                                text: 'Details',
                                action(r) {
                                    me.$router.push('/players/' + r.id + '/details')
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'players',
                    sort: 'nickname',
                    limit: 10,
                    fields: [
                        'id',
                        'nickname',
                        'shortNickname',
                        {'country': [
                            'name'
                        ]}
                    ]
                }
            }
        },

        watch: {
            filter: _.debounce(() => {
                me.updateFilter()
            }, 200)
        },

        components: {
            Table
        }
    }
</script>

<style scoped>

</style>