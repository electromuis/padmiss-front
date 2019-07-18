<template>
    <div>
        <h1>Scores</h1>

        <b-button v-if="canPost" variant="info" class="m-1" @click="$router.push({path: `/scores/post`})">
            Post score
        </b-button>
        <br/>&nbsp;

        <Table :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './Custom/Table.vue'
    import TournamentMixin from './../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],

        created() {
            let me = this

            me.$api.get(
                '/api/arcade-cabs/get-my-cabs?token=' + localStorage.token
            ).then(response => {
                if(response.cabs.length > 0) {
                    me.canPost = true
                }
            })
        },

        data() {
            return {
                canPost: false,
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