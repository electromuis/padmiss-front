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

    export default {
        created() {
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
        }
    }
</script>

<style scoped>

</style>