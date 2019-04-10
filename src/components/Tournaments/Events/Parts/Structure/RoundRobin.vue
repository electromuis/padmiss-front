<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="tournament">
        <div v-if="form !== null" class="form">
            <v-component :is="form.type" v-bind="form" />
        </div>

        <v-button v-on:click="addRound">Add round</v-button>

        <div v-for="round in rounds" class="round">

            <div v-for="match in round.matches" class="match">

                <div v-for="player in players" class="player">
                    {player.nickname}
                </div>

                <v-button v-on:click="() => {editMatch(match._id, round._id)}">Edit</v-button>
            </div>

        </div>
    </div>
</template>

<script>
    import TournamentMixin from './../../../../../mixins/TournamentMixin'
    import Math from './Forms/Match.vue'

    export default {
        name: "RoundRobin",
        mixins: [TournamentMixin],

        methods: {
            addRound() {
                let me = this
                this.loading = true

                let data = {
                    token: localStorage.token,
                    name: 'Round ' + me.rounds.length + 1,
                    index: me.rounds.length + 1
                }

                me.$api.post('/api/tournament-event-parts/' + me.round._id + '/create-round', data).then(round => {
                    return me.loadData()
                }).then(() => {
                    me.loading = false
                })
            },

            editMatch(matchId, roundId) {
                this.form = {type: 'Match', matchId: matchId, roundId: roundId}
            },

            loadData() {
                return this.$graph.query(
                    'Rounds',
                    {
                        docs: [
                            'name',
                            'status',
                            {
                                matches: [
                                    'status',
                                    {
                                        players: [
                                            '_id',
                                            'nickname'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {sort: "index", partId: part._id},
                    true
                )
            }
        },

        created() {
            let me = this

            this.$loadTournament().then((r) => {
                return me.$loadEvent()
            }).then(event => {

                return me.$loadPart()
            }).then(part => {
                return me.loadData()
            }).then(() => {
                //todo Do stuff with players

                me.loading = false
            })
        },

        data() {
            return {
                loading: true,
                rounds: [],
                form: null
            }
        },
    }
</script>

<style scoped>
    .round {
        border: 1px solid black;
    }

    .match {
        border: 1px solid black;
    }

    .player {
        border: 1px solid black;
    }
</style>