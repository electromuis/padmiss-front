<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else>
        <h1>{{showTitle}}</h1>
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

            this.query.filter = this.$props.filter
            if(this.$props.title) {
                this.showTitle = this.$props.title
            }

            this.loading = false
        },

        data() {
            let me = this

            return {
                loading: true,
                showTitle: 'Scores',
                
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
                                    me.$router.push('/players/' + r.player.id + '/score/' + r.id)
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
                        'id',
                        'playedAt',
                        'scoreValue',
                        {'player': ['id']},
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
            filter: Object,
            title: String
        }
    }
</script>

<style scoped>

</style>