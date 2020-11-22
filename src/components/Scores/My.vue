<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else>
        <h1>My scores</h1>
        <br/>&nbsp;
        <Table :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './../Custom/Table.vue'
    import Loading from 'vue-loading-overlay';
    import moment from 'moment'

    let me = null

    export default {
        created() {
            me = this

            this.query.filter = {
                player: this.$user.data.playerId
            }
            this.loading = false
        },

        data() {
            return {
                loading: true,

                cols: [
                    {
                        field: 'playedAt',
                        sort: 'playedAt',
                        name: 'Date',
                        morph: (v) => moment(v).format('DD-MM-Y HH:MM')
                    },
                    {
                        field: 'stepChart.difficultyLevel',
                        name: 'Difficulty'
                    },
                    {
                        field: 'scoreValue',
                        sort: 'scoreValue',
                        name: 'Score',
                        morph: (v) =>  (Math.round(v*10000) / 100).toFixed(2) + ' %'
                    },
                    {
                        field: 'stepChart.songs.title',
                        name: 'Song'
                    },
                    {
                        field: 'stepChart.songs.artist.name',
                        name: 'Artist'
                    },
                    {
                        type: 'actions',
                        actions: [
                            {
                                text: 'Details',
                                action(r) {
                                    me.$router.push('/scores/my/details/' + r.id)
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Scores',
                    sort: '-playedAt',
                    limit: 25,
                    fields: [
                        'id',
                        'playedAt',
                        'scoreValue',
                        {'stepChart': [
                            {'songs': [
                                'title',
                                {'artist': [
                                    'name'
                                ]}
                            ]},
                            'difficultyLevel'
                        ]}
                    ]
                }
            }
        },

        components: {
            Table,
            Loading
        }
    }
</script>

<style scoped>

</style>