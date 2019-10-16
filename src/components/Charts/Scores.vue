<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else>
        <h1>Scores:</h1><br/>
        <table class="table table-striped">
            <tbody>
                <tr>
                    <td>Artist</td>
                    <td>{{chart.song.artist}}</td>
                </tr>
                <tr>
                    <td>Song</td>
                    <td>{{chart.song.title}}</td>
                </tr>
                <tr>
                    <td>Difficulity</td>
                    <td>{{chart.difficultyLevel}}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Density :chart="chart.stepData" />
                    </td>
                </tr>
            </tbody>
        </table>
        <br/>&nbsp;
        <Table :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './../Custom/Table.vue'
    import Loading from 'vue-loading-overlay';
    import moment from 'moment'
    import Density from "../Charts/Density.vue";

    let me = null

    export default {
        created() {
            let chartId = this.$route.params.chartId

            this.$graph(
                'Stepchart',
                [
                    '_id',
                    'stepArtist',
                    'difficultyLevel',
                    'groups',
                    'stepData',
                    {song: [
                        'title',
                        'artist'
                    ]}
                ],
                {id: chartId}
            ).then(chart => {
                if(!chart) {
                    return
                }

                me.chart = chart

                //Until we fix chart hashing ...
                return this.$graph(
                    'Stepcharts',
                    [{docs:['_id']}],
                    {
                        'song.title': chart.song.title,
                        'song.artist': chart.song.artist,
                        'difficultyLevel': chart.difficultyLevel
                    },
                    true
                )
            }).then(charts => {
                me.charts = charts.docs.map(c => c._id)
                this.query.filter = {
                    stepChart: me.charts
                }

                me.loading = false
            })

            me = this
        },

        data() {
            let me = this

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
                        field: 'player.nickname',
                        name: 'Player'
                    },
                    {
                        field: 'scoreValue',
                        sort: 'scoreValue',
                        name: 'Score',
                        morph: (v) =>  (Math.round(v*10000) / 100).toFixed(2) + ' %'
                    },
                    {
                        type: 'actions',
                        actions: [
                            {
                                text: 'Details',
                                action(r) {
                                    me.$router.push('/charts/' + me.chart._id + '/scores/' + r._id + '/details')
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Scores',
                    sort: '-scoreValue',
                    limit: 10,
                    fields: [
                        '_id',
                        'playedAt',
                        'scoreValue',
                        {'player': ['nickname']}
                    ]
                }
            }
        },

        components: {
            Table,
            Loading,
            Density
        }
    }
</script>

<style scoped>

</style>