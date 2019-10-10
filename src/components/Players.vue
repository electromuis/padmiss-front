<template>
    <div>
        <h1>Players</h1>

        <div class="form-group">
            <div class="form-label">
                Filter:
            </div>
            <input v-model="filter" @change="updateFilter()" class="form-control col-md-12" />
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
                        name: 'Nickname'
                    },
                    {
                        field: 'shortNickname',
                        name: 'Short'
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
                                    me.$router.push('/players/' + r._id + '/details')
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Players',
                    sort: '+nickname',
                    limit: 10,
                    fields: [
                        '_id',
                        'nickname',
                        'shortNickname',
                        {'country': [
                            'name'
                        ]}
                    ]
                }
            }
        },

        components: {
            Table
        }
    }
</script>

<style scoped>

</style>