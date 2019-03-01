<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="bracket">
        <svg class="lines-overlay" id="lines-overlay">
            <line v-for="line in lines" :x1="line.x1" :x2="line.x2" :y1="line.y1" :y2="line.y2" style="stroke:rgb(255,0,0);stroke-width:2"></line>
        </svg>

        <template v-for="(myRounds, type) in rounds">
            <div class="round" v-for="round in myRounds" v-bind:style="roundStyle">

                <div class="match" v-for="match in round.matches" :ref="'match-' + match._id">

                    <div class="player" v-for="player in match.players">

                        {{player.nickname}}

                    </div>

                </div>

            </div>
        </template>
    </div>
</template>


<script>
    import TournamentMixin from "../../../../../mixins/TournamentMixin";
    import Loading from 'vue-loading-overlay';

    class Match {
        constructor(parent, data, type){
            let me = this
            me.parent = parent
            me.type = type

            Object.entries(data).forEach(([k, v]) => {
                me[k] = v
            })
        }

        elm() {
            if(typeof this.parent.$refs['match-' + this._id] === 'undefined') {
                return null
            }

            return this.parent.$refs['match-' + this._id][0]
        }

        drawDependantLines() {
            let me = this

            if(this.elm() === null) {
                return
            }

            if(this.dependantMatches.length === 0) {
                return
            }

            let widthSplit = 0.5

            if(this.type === 'Round') {
                this.dependantMatches.forEach(m => {
                    if(typeof me.parent.matches[m] === 'undefined') {
                        return
                    }

                    let from = me.parent.matches[m].elm()
                    let to = me.elm()

                    let fromX = from.offsetLeft + from.offsetWidth
                    let fromY = from.offsetTop + from.offsetHeight / 2

                    let toX = to.offsetLeft
                    let toY = to.offsetTop + to.offsetHeight / 2

                    let width = Math.abs(fromX - toX)
                    let splitPos = fromX + width * widthSplit

                    console.log([
                        from,
                        to,
                        fromX,
                        toX,
                        fromY,
                        toY,
                        width,
                        splitPos
                    ])

                    me.parent.lines.push({
                        x1: fromX,
                        x2: splitPos,
                        y1: fromY,
                        y2: fromY
                    })

                    me.parent.lines.push({
                        x1: splitPos,
                        x2: splitPos,
                        y1: fromY,
                        y2: toY
                    })

                    me.parent.lines.push({
                        x1: splitPos,
                        x2: toX,
                        y1: toY,
                        y2: toY
                    })
                })
            }
        }
    }

    export default {
        name: "SingleElimination",

        mixins: [TournamentMixin],

        methods: {
            update() {
                console.log("update")

                let me = this
                this.lines = []
                Object.entries(me.rounds).forEach(([type, rounds]) => {
                    Object.entries(rounds).forEach(([nr, round]) => {
                        round.matches.forEach(m => {
                            m.drawDependantLines()
                        })
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
                    let pts = r.name.split(' ')


                    if(pts.length !== 2) {
                        continue
                    }

                    let nr = parseInt(pts[1])
                    let type = pts[0]

                    let matches = await me.$graph.query(
                        'Matches',
                        {docs: [
                                '_id',
                                'status',
                                {players: ['_id']},
                                {dependantMatches: ['_id']}
                            ]},
                        {roundId: r._id},
                        true
                    )
                    matches = matches.docs
                    let matchObjects = []

                    for(let x = 0; x < matches.length; x ++) {
                        matches[x].dependantMatches = matches[x].dependantMatches.map(d => d._id)

                        let m = new Match(me, matches[x], type)
                        matchObjects.push(m)
                        me.matches[m._id] = m

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

                    r.matches = matchObjects

                    if(typeof me.rounds[type] === 'undefined') {
                        me.rounds[type] = {}
                    }
                    me.rounds[type][nr] = r
                }
            }
        },

        mounted() {
            let me = this

            this.loadData().then(() => {
                me.loading = false
                console.log([me.rounds, me.matches])

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
                rounds: {},
                matches: {}
            }
        },

        components: {
            "loading": Loading
        },

        watch: {
            rounds: {
                handler() {
                    // this.update()
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