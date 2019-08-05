<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="tournaments">
        Players

        <Players :groups="groups" :players="players" :dragged="handleMove" :allowed-moves="moves"/>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'
    import AuthMixin from '../../mixins/AuthMixin'
    import Players from '../Custom/Players.vue'
    import Loading from 'vue-loading-overlay';

    export default {
        name: "Events",

        mixins: [TournamentMixin, AuthMixin],

        methods: {
            handleMove(player, from, to) {
                let me = this
                this.loading = true


                if(from === 'join' && to === 'current') {
                    let data = {
                        token: localStorage.token,
                        playerId: player.id
                    }

                    me.$api.post('/api/tournaments/' + me.$route.params.tournamentId + '/approve-player-join-request', data, {expectStatus: 204}).then(() => {
                        me.loading = false
                    })
                } else if (from === 'join' && to === 'all') {
                    let data = {
                        token: localStorage.token,
                        playerId: player.id
                    }

                    me.$api.post('/api/tournaments/' + me.$route.params.tournamentId + '/decline-player-join-request', data, {expectStatus: 204}).then(() => {
                        me.loading = false
                    })
                } else if (from === 'current' && to === 'disqualified') {
                    let data = {
                        token: localStorage.token,
                        playerId: player.id
                    }

                    me.$api.post('/api/tournaments/' + me.$route.params.tournamentId + '/disqualify-player', data, {expectStatus: 204}).then(() => {
                        me.loading = false
                    })
                } else {
                    this.loading = false
                }
            },

            updateTournament() {
                let me = this

                return new Promise(((resolve, reject) => {
                    let data = me.tournament

                    data.token = localStorage.token,
                    data.playerJoinRequests = me.players.join.map(p => p.id)
                    data.players = this.players.current.map(p => p.id)
                    data.disqualifiedPlayers = this.players.disqualified.map(p => p.id)

                    me.$api.put('/api/tournaments/' + this.$route.params.tournamentId, data, {expectStatus: 201}).then(() => {
                        me.loading = false
                    })
                }))
            }
        },

        data() {
            return {
                path: "",
                tournament: {},
                loading: true,
                groups: [],
                players: {
                    all: [],
                    join: [],
                    current: [],
                    disqualified: []
                },
                //if admin
                moves: [
                    ['join', 'current'],
                    ['join', 'all'],
                    ['current', 'disqualified']
                ]
            }
        },

        created() {
            let me = this

            Promise.all([
                me.$graph(
                    'Players',
                    {docs: ['_id', 'nickname']},
                    {limit: 100000},
                    true
                ),
                me.$loadTournament(true)
            ])
           .then(response => {
               let players = response[0].docs
               let playerMap = {}

               let join = response[1].playerJoinRequests
               let current = response[1].players
               let disqualified = response[1].disqualifiedPlayers

               let all = players.filter(p => {
                   playerMap[p._id] = {
                       id: p._id,
                       name: p.nickname
                   }

                   let ret =
                        join.indexOf(p._id) < 0 &&
                        current.indexOf(p._id) < 0 &&
                        disqualified.indexOf(p._id) < 0

                   return ret
               })

               me.players.all = all.map(p => playerMap[p._id])
               me.players.join = join.map(p => playerMap[p])
               me.players.current = current.map(p => playerMap[p])
               me.players.disqualified = disqualified.map(p => playerMap[p])

               me.groups = ['all', 'join', 'current', 'disqualified']

               me.loading = false
           })
        },

        components: {
            Players,
            "loading": Loading
        }
    }
</script>

<style scoped>

</style>