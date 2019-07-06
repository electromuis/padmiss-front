<template>
    <Table :cols="cols" :query="query"></Table>
</template>

<script>
    import Table from './Custom/Table.vue'

    export default {
        data() {
            return {
                cols: [
                    {
                        field: 'playedAt',
                        name: 'Date'
                    },
                    {
                        field: 'player.nickname',
                        name: 'Player'
                    },
                    {
                        field: 'stepChart.difficultyLevel',
                        name: 'Difficulty'
                    },
                    {
                        field: 'scoreValue',
                        name: 'Score',
                        morph: (v) =>  v*100 + ' %'
                    },
                    {
                        field: 'stepChart.song.title',
                        name: 'Song'
                    },
                    {
                        field: 'stepChart.song.artist',
                        name: 'Artist'
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
                        {'player': ['nickname']},
                        {'stepChart': [
                                {'song': ['title', 'artist']},
                                'difficultyLevel'
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