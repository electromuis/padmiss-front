<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="bracket">
        <svg class="lines-overlay" id="lines-overlay">
            <line v-for="line in lines" :x1="line.x1" :x2="line.x2" :y1="line.y1" :y2="line.y2" style="stroke:rgb(255,0,0);stroke-width:2"></line>
        </svg>

        <div class="round" v-for="(round, i) in rounds" v-bind:style="roundStyle">
            <div class="match" v-for="match in round.matches" :ref="'match-' + match._id">

                <div class="player" v-for="player in match.players">

                    {{player.nickname}}

                </div>

            </div>
            <div class="match spacer"></div>

        </div>
    </div>
</template>


<script>
    import TournamentMixin from "../../../../../mixins/TournamentMixin";
    import Loading from 'vue-loading-overlay';

    export default {
        name: "SingleElimination",

        mixins: [TournamentMixin],

        methods: {
            update() {
                console.log("update")

                let me = this
                this.lines = []

                let roundWidth = this.roundStyle.widthInt

                Object.entries(me.rounds).forEach(([r, round]) => {
                    r = parseInt(r)

                    Object.entries(round.matches).forEach(([m, match]) => {
                        m = parseInt(m)

                        if(typeof me.$refs['match-' + match._id] === 'undefined') {
                            console.log(['match-' + match._id, me.$refs])
                            return
                        }

                        let melm = me.$refs['match-' + match._id][0]
                        let width = roundWidth - melm.offsetWidth

                        if(typeof me.rounds[r-1] !== 'undefined') {
                            let lastRound = me.rounds[r-1]

                            let match1 = lastRound.matches[m*2]
                            let match2 = lastRound.matches[m*2+1]

                            if(me.$refs['match-' + match1._id] && me.$refs['match-' + match2._id]) {

                                let elm1 = me.$refs['match-' + match1._id][0]
                                let elm2 = me.$refs['match-' + match2._id][0]

                                let elmh = elm1.offsetTop + (elm2.offsetTop - elm1.offsetTop) / 2 + elm1.offsetHeight / 2

                                me.lines.push({
                                    x1: melm.offsetLeft,
                                    x2: melm.offsetLeft - width / 4,

                                    y1: melm.offsetTop + melm.offsetHeight / 2,
                                    y2: melm.offsetTop + melm.offsetHeight / 2
                                })

                                me.lines.push({
                                    x1: melm.offsetLeft - width / 4,
                                    x2: melm.offsetLeft - width / 4,

                                    y1: melm.offsetTop + melm.offsetHeight / 2,
                                    y2: elmh
                                })

                                me.lines.push({
                                    x1: melm.offsetLeft - width / 2,
                                    x2: melm.offsetLeft - width / 4,

                                    y1: elmh,
                                    y2: elmh
                                })

                                me.lines.push({
                                    x1: elm1.offsetLeft + elm1.offsetWidth + width / 2,
                                    x2: elm1.offsetLeft + elm2.offsetWidth + width / 2,

                                    y1: elm1.offsetTop + elm1.offsetHeight / 2,
                                    y2: elm2.offsetTop + elm2.offsetHeight / 2
                                })
                            }
                        }

                        if(typeof me.rounds[r+1] !== 'undefined') {
                            let nextRound = me.rounds[r+1]
                            let nextMatch = nextRound.matches[Math.floor(m / 2)]
                            let nmeml = me.$refs['match-' + nextMatch._id][0]

                            me.lines.push({
                                x1: melm.offsetLeft + melm.offsetWidth,
                                x2: melm.offsetLeft + melm.offsetWidth + width / 2,

                                y1: melm.offsetTop + melm.offsetHeight / 2,
                                y2: melm.offsetTop + melm.offsetHeight / 2
                            })
                        }

                    })
                })
            },

            async loadData() {
                let me = this

                let tournament = await this.$loadTournament()
                let part = await this.$loadPart()
                let rounds = await this.$graph.query(
                    'Rounds',
                    {docs: [
                            '_id',
                            'name',
                            'status'
                        ]},
                    {tournamentEventPartId: me.part._id},
                    true
                )
                rounds = rounds.docs

                for(let i = 0; i < rounds.length; i ++) {
                    let r = rounds[i]

                    let matches = await me.$graph.query(
                        'Matches',
                        {docs: [
                                '_id',
                                'status',
                                {players: ['_id']}
                            ]},
                        {roundId: r._id},
                        true
                    )
                    matches = matches.docs

                    for(let x = 0; x < matches.length; x ++) {
                        let m = matches[x]

                        m.name = 'Match ' + m._id
                        let ids = m.players
                        m.players = []

                        for(let y = 0; y < ids.length; y++) {
                            let player = await me.$graph.query(
                                'Player',
                                [
                                    '_id',
                                    'nickname',
                                    'shortNickname',
                                    {country: ['_id']},
                                    //And the other fields
                                ],
                                {id: ids[y]._id}
                            )

                            m.players.push(player)
                        }
                    }

                    r.matches = matches
                }

                return rounds
            }
        },

        mounted() {
            let me = this

            this.loadData().then((rounds) => {
                me.rounds = rounds
                me.loading = false
                console.log(rounds)
                me.update()

                me.$nextTick(() => {
                    me.update()
                })

            })
        },

        created() {
            let me = this
        },

        data() {
            return {
                loading: true,
                lines: [],
                roundStyle: {
                    widthInt: 300,
                    width: '300px'
                },
                rounds: [
                    // {
                    //     name: 'round 1',
                    //     id: 1,
                    //     matches: [
                    //         {
                    //             name: 'match 1',
                    //             id: 1,
                    //             players: [
                    //                 {
                    //                     id: 1,
                    //                     name: 'player 1'
                    //                 },
                    //                 {
                    //                     id: 2,
                    //                     name: 'player 2'
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             name: 'match 2',
                    //             id: 2,
                    //             players: [
                    //                 {
                    //                     id: 3,
                    //                     name: 'player 3'
                    //                 },
                    //                 {
                    //                     id: 4,
                    //                     name: 'player 4'
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             name: 'match 1',
                    //             id: 3,
                    //             players: [
                    //                 {
                    //                     id: 1,
                    //                     name: 'player 1'
                    //                 },
                    //                 {
                    //                     id: 2,
                    //                     name: 'player 2'
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             name: 'match 2',
                    //             id: 4,
                    //             players: [
                    //                 {
                    //                     id: 3,
                    //                     name: 'player 3'
                    //                 },
                    //                 {
                    //                     id: 4,
                    //                     name: 'player 4'
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // },
                    // {
                    //     name: 'round 2',
                    //     id: 2,
                    //     matches: [
                    //         {
                    //             name: 'match 1',
                    //             id: 5,
                    //             players: [
                    //                 {
                    //                     id: 2,
                    //                     name: 'player 2'
                    //                 },
                    //                 {
                    //                     id: 4,
                    //                     name: 'player 4'
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             name: 'match 1',
                    //             id: 6,
                    //             players: [
                    //                 {
                    //                     id: 2,
                    //                     name: 'player 2'
                    //                 },
                    //                 {
                    //                     id: 4,
                    //                     name: 'player 4'
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // }
                ]
            }
        },

        components: {
            "loading": Loading
        },

        watch: {
            rounds: {
                handler() {
                    this.update()
                },
                deep: true
            }
        },
    }
</script>

<style>
    .bracket {
        height: 600px;
        position: relative;
    }

    .round {
        height: 100%;
        width: 300px;
        border: 1px solid black;
        float: left;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: stretch;
        align-items: flex-start;
    }

    .match {
        height: 70px;
        width: 100px;
        border: 1px solid black;

        order: 0;
        flex: 0 1 auto;
        align-self: auto;

        margin: 5px;

        position: relative;
    }

    .match.spacer {
        border: none;
    }

    .player {
        border: 1px solid black;

        height: 50%;
        width: 100%;

        line-height: 200%;
        vertical-align: middle;
        text-align: center;

        position: relative;
    }

    .lines-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
</style>