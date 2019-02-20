<template>
    <div id="tournaments">
        Players

        <Players :groups="groups" :players="players" :dragged="handleMove"/>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'
    import Players from '../Custom/Players.vue'

    export default {
        name: "Events",

        mixins: [TournamentMixin],

        methods: {
            handleMove(player, from, to) {
                console.log(player, from, to)
            }
        },

        data() {
            return {
                path: "",
                tournament: {},
                groups: ['all', 'join', 'current', 'disqualified'],
                players: {
                    all: [
                        {
                            name: 'player 1'
                        },
                        {
                            name: 'player 2'
                        }
                    ],
                    join: [
                        {
                            name: 'player 3'
                        }
                    ],
                    current: [],
                    disqualified: []
                }
            }
        },

        created() {
            let me = this

            // this.$api.get('/api/tournaments').then((response) => {
            //     me.values = response
            // })

            me.$loadTournament().then((tournament) => {
                me.$api.get('/api/tournament-events?tournamentId=' + tournament.id).then((events) => {
                    me.values = events
                })
            })

            // me.$api.get('/api/tournaments/' + this.$route.params.id).then((tournament) => {
            //     me.tournament = tournament
            //
            //     me.$api.get('/api/tournament-events?tournamentId=' + tournament.id).then((events) => {
            //
            //
            // }).except((err) => {
            //     me.$router.push('/tournaments')
            // })
        },

        components: {
            Players
        }
    }
</script>

<style scoped>

</style>