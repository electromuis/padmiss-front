<template>
    <div>
        <h1>Charts</h1>

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
                                'song.title': {
                                    '$regex': this.filter,
                                    "$options": 'i'
                                }
                            },
                            {
                                'song.artist': {
                                    '$regex': this.filter,
                                    "$options": 'i'
                                }
                            },
                            {
                                'song.artist': {
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
                        field: 'created',
                        name: 'Date submitted'
                    },
                    {
                        field: 'stepChart.difficultyLevel',
                        name: 'Difficulty'
                    },
                    {
                        field: 'stepChart.song.title',
                        name: 'Song'
                    },
                    {
                        field: 'stepChart.song.artist',
                        name: 'Artist'
                    },
                    {
                        field: 'stepChart.groups',
                        name: 'In packs',
                        morph: (v) => {v.join(', ')}
                    },
                    {
                        type: 'actions',
                        actions: [
                            {
                                text: 'Scores',
                                action(r) {
                                    me.$router.push('/charts/' + r._id + '/scores')
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Stepcharts',
                    sort: '-created',
                    limit: 10,
                    fields: [
                        '_id',
                        'created',
                        'difficultyLevel',
                        'groups',
                        'durationSeconds',
                        {'song': [
                            'title',
                            'artist'
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