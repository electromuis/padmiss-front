<template>
    <div id="tournaments">
        Charts

        <form v-bind:class="[hovering ? 'drop hover' : 'drop']" ref="drop">

            Drop here to add

        </form>

        <div class="warnings" v-if="warnings.length > 0">
            <p class="message" v-for="w in warnings">{{w}}</p>
        </div>

        <!--<vue-bootstrap-table-->
                <!--:columns="columns"-->
                <!--:values="values"-->
                <!--:sortable="true"-->
                <!--:paginated="true"-->
        <!--&gt;-->
        <!--</vue-bootstrap-table>-->
        <table class="table table-striped">
            <thead>
                <tr>
                    <td>Hash</td>
                    <td>Artist</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in values">
                    <td>{{ row.stepChartHash }}</td>
                    <td>{{ row.stepArtist }}</td>
                    <td>
                        Nothing
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../mixins/TournamentMixin'
    import NotesWriter from '../../../../modules/NotesWriter'

    export default {
        name: "Charts",

        mixins: [TournamentMixin],

        data() {
            return {
                path: "",
                tournament: {},
                values: [],
                warnings: [],
                hovering: false
            }
        },

        created() {
            let me = this

            me.$loadPart().then((part) => {
                part.stepCharts.forEach(c => {
                    me.$graph.query(
                        'Stepchart',
                        ['stepArtist', 'stepChartHash'],
                        {id: c}
                    ).then(c => {
                        me.values.push(c)
                    })
                })
            })
        },

        mounted() {
            let me = this

            let e = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
            e.forEach( function( evt ) {
                this.$refs.drop.addEventListener(evt, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
            }.bind(this));

            me.$refs.drop.addEventListener('drop', e => {
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    me.handleUpload(e.dataTransfer.files[i])
                }
                me.hovering = false
            })

            me.$refs.drop.addEventListener('dragenter', e => {
                me.hovering = true
            })

            me.$refs.drop.addEventListener('dragleave', e => {
                me.hovering = false
            })
        },

        methods: {
            addChart(chart) {
                let me = this
                let id = chart._id

                return new Promise(((resolve, reject) => {
                    me.$loadPart().then(part => {
                        if(part.stepCharts.indexOf(id) === -1) {
                            part.stepCharts.push(id)
                            part.token = localStorage.token

                            me.$api.put('/api/tournament-event-parts/' + part._id, part, {expectStatus: 201}).then(() => {
                                me.$router.push(me.$eventPath + "/parts")
                            })
                                .then(() => {
                                    me.values.push(chart)
                                    resolve()
                                })
                                .catch(reject)

                        } else {
                            resolve()
                        }
                    }).catch(reject)
                }))
            },

            handleChart(writer) {
                let me = this

                return new Promise(((resolve, reject) => {
                    let chart = writer.charts[0]
                    let hash = writer.calcHash(chart)
                    let sm = writer.writeCharts()
                    let last = new Promise((resolve1, reject1) => {resolve1()})

                    me.$graph.query(
                        'Stepcharts',
                        {docs: ['stepArtist', 'stepChartHash', '_id']},
                        {stepChartHash: hash},
                        true
                    ).then(result => {
                        result = result.docs
                        if(result.length === 1) {
                            console.log('FOUND!')

                            last.then(() => {
                                me.addChart(result[0])
                            })


                        } else {
                            let type = chart.type.replace('dance-', '')
                            type = type.charAt(0).toUpperCase() + type.slice(1)

                            me.$api.post('/api/stepcharts', {
                                token: localStorage.token,
                                stepChartHash: hash,
                                song: {
                                    title: writer.info.TITLE,
                                    artist: writer.info.ARTIST
                                },
                                stepArtist: chart.credit,
                                stepData: writer.write(),
                                difficultyLevel: chart.level,
                                durationSeconds: Math.round(writer.calcLength(chart)),
                                playMode: type
                            }, {expectStatus: 201}).then(response => {
                                response._id = response.id

                                last.then(() => {
                                    last = me.addChart(response).then(resolve)
                                })


                            }).catch(reject)
                        }
                    })
                }))
            },

            handleUpload(u) {
                let me = this
                console.log(u)

                let ext = u.name.split('.').pop()
                if(ext !== 'sm') {
                    this.warnings.push(u.name + ' is not a valid simfile')
                }

                let reader = new FileReader();

                reader.addEventListener('loadend', (e) => {
                    const text = e.srcElement.result;
                    let writer = new NotesWriter()
                    writer.setData(text)
                    writer.read()

                    let charts = writer.charts

                    charts.forEach(c => {
                        writer.charts = [c]
                        me.handleChart(writer)
                    })
                });

                reader.readAsText(u);
            }
        },

        components: {
        }
    }
</script>

<style>
    .drop {
        background: white;
        border: 1px grey solid;
        border-radius: 8px;

        height: 150px;
        line-height: 150px;
        vertical-align: middle;
        text-align: center;

        margin-bottom: 20px;
    }

    .drop.hover {
        background: blue;
    }

    .warnings .message {
        padding: 5px;
        background-color: #fcf8e3;
        margin-bottom: 4px;
    }
</style>