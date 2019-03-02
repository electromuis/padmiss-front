<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="bracket">
        <svg class="lines-overlay" id="lines-overlay">
            <line v-for="line in lines" :x1="line.x1" :x2="line.x2" :y1="line.y1" :y2="line.y2" v-bind:style="line.style"></line>
        </svg>

            <div class="round" v-for="round in rounds.Winners">
                <div class="match" v-for="match in round.matches" :id="match._id" :ref="'match-' + match._id"
                     v-on:mouseover="() => mouseOver(match._id)" v-on:mouseleave="() => mouseLeave(match._id)">

                    Winner {{match.dependantMatches.length}}
                    <div class="player" v-for="player in match.players">

                        {{player.nickname}}

                    </div>

                </div>

                <template v-if="rounds.Losers && typeof rounds.Losers[round.number] !== 'undefined'">
                    <div class="match loserMatch" v-for="match in rounds.Losers[round.number].matches" :id="match._id" :ref="'match-' + match._id"
                         v-on:mouseover="() => mouseOver(match._id)" v-on:mouseleave="() => mouseLeave(match._id)">

                        Loser {{match.dependantMatches.length}}
                        <div class="player" v-for="player in match.players">

                            {{player.nickname}}

                        </div>

                    </div>
                </template>

            </div>
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
            me.hover = false

            Object.entries (data).forEach(([k, v]) => {
                me[k] = v
            })
        }

        elm() {
            if(typeof this.parent.$refs['match-' + this._id] === 'undefined') {
                return null
            }

            return this.parent.$refs['match-' + this._id][0]
        }

        drawDependantLines(toId, deeper) {
            let me = this

            if (this.elm() === null) {
                return
            }

            if (me.hover === true && deeper !== false) {
                Object.entries(me.parent.matches).forEach(([id, m2]) => {
                    if (m2.dependantMatches.indexOf(me._id) > -1) {
                        m2.hover = true
                        m2.drawDependantLines(me._id, false)
                        m2.hover = false
                    }
                })
            }

            if (this.dependantMatches.length === 0) {
                return
            }

            let widthSplit = 0.5

            this.dependantMatches.forEach(m => {
                if(toId && m !== toId) {
                    console.log('ret')
                    return
                }

                if(typeof me.parent.matches[m] === 'undefined') {
                    return
                }

                let from = me.parent.matches[m].elm()
                let to = me.elm()

                let fromY = from.offsetTop + from.offsetHeight / 2
                let toY = to.offsetTop + to.offsetHeight / 2


                let fromX = from.offsetLeft + from.offsetWidth
                let toX = to.offsetLeft

                if(fromX > toX) {
                    fromX = from.offsetLeft
                    toX = to.offsetLeft + to.offsetWidth
                }

                let width = Math.abs(fromX - toX)
                let splitPos = fromX + width * widthSplit

                let style = {
                    stroke: 'rgb(255, 0, 0)',
                    'stroke-width': 1,
                    'z-index': 10
                }
                if(me.hover === true) {
                    style = {
                        stroke: 'rgb(0, 0, 255)',
                        'stroke-width': 3,
                        'z-index': 20
                    }
                }

                // console.log(style)

                me.parent.lines.push({
                    x1: fromX,
                    x2: splitPos,
                    y1: fromY,
                    y2: fromY,
                    style: style
                })

                me.parent.lines.push({
                    x1: splitPos,
                    x2: splitPos,
                    y1: fromY,
                    y2: toY,
                    style: style
                })

                me.parent.lines.push({
                    x1: splitPos,
                    x2: toX,
                    y1: toY,
                    y2: toY,
                    style: style
                })
            })
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

            mouseOver(id) {
                this.matches[id].hover = true
                console.log(this.matches[id].hover)
                let me = this
                this.$nextTick(() => {
                    console.log(this.matches[id].hover)
                    me.update()
                    console.log(this.matches[id].hover)
                })
            },

            mouseLeave(id) {
                this.matches[id].hover = false
                let me = this
                this.$nextTick(() => {
                    me.update()
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
                    r.number = nr
                    r.type = type

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
        height: 100%;
        position: relative;
        overflow-x: scroll;
        max-width: 100%;

        display: flex;
        align-content: stretch;
    }

    .round {
        padding: 20px;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: stretch;
        align-items: flex-start;

        flex: 0 1 auto;
    }

    .match {
        height: auto;
        width: 130px;
        border: 1px solid black;

        order: 0;
        flex: 0 1 auto;
        align-self: auto;

        margin: 5px;
        margin-bottom: 10px;

        position: relative;
    }

    .match.loserMatch {
        margin-left: 170px;
    }

    .match:nth-child(even) {
        margin-left: 30px;
    }

    .match.loserMatch:nth-child(even) {
        margin-left: 180px;
    }

    .match.spacer {
        border: none;
    }

    .player {
        border: 1px solid black;

        padding: 5px 12px 5px 12px;

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