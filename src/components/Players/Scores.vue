<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else>
        <h1>Scores</h1>
        <br/>&nbsp;
        <Table :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './../Custom/Table.vue'
    import Loading from 'vue-loading-overlay';

    let me = null

    export default {
        created() {
            me = this

            this.query.filter = {
                player: this.$props.player
            }
            console.log(this.query)
            this.loading = false
        },

        data() {
            let me = this

            return {
                loading: true,
                
                cols: [
                    {
                        field: 'playedAt',
                        name: 'Date'
                    },
                    {
                        field: 'stepChart.difficultyLevel',
                        name: 'Difficulty'
                    },
                    {
                        field: 'scoreValue',
                        name: 'Score',
                        morph: (v) =>  (Math.round(v*10000) / 100) + ' %'
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
                        type: 'actions',
                        actions: [
                            {
                                text: 'Details',
                                action(r) {
                                    me.$router.push('/players/' + me.$props.player + '/score/' + r._id)
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Scores',
                    sort: '-playedAt',
                    limit: 10,
                    fields: [
                        '_id',
                        'playedAt',
                        'scoreValue',
                        {'stepChart': [
                            {'song': ['title', 'artist']},
                            'difficultyLevel'
                        ]}
                    ]
                }
            }
        },

        components: {
            Table,
            Loading
        },

        props: {
            player: String
        }
    }
</script>

<style scoped>

</style>