<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="tournaments">
        Players

        <Players :groups="groups" :players="players" :dragged="handleMove"/>
    </div>
</template>

<script>
    import TournamentMixin from '../../../mixins/TournamentMixin'
    import Players from '../../Custom/Players.vue'
    import Loading from 'vue-loading-overlay';

    export default {
        mixins: [TournamentMixin],

        methods: {
            handleMove(player, from, to) {
                // console.log(this.players)

                this.loading = true
                this.updateEvent().then(() => {

                    this.loading = false
                })
            },

            updateEvent() {
                let me = this

                return new Promise(((resolve, reject) => {
                    let data = me.tournament
                    delete data._id

                    data.token = localStorage.token,
                    data.players = this.players.current.map(p => p.id)
                    data.disqualifiedPlayers = this.players.disqualified.map(p => p.id)

                    me.$api.put('/api/tournament-events/' + this.$route.params.eventId, data, {expectStatus: 201}).then(() => {
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
                    current: [],
                    disqualified: []
                }
            }
        },

        created() {
            let me = this

            Promise.all([
                me.$graph.query(
                    'Players',
                    {docs: ['_id', 'nickname']}
                ),
                me.$loadTournament(true),
                me.$loadEvent()
            ])
           .then(response => {
               let playerMap = {}

               response[0].docs.forEach(p => {
                   playerMap[p._id] = {
                       id: p._id,
                       name: p.nickname
                   }
               })

               let current = response[2].players
               let disqualified = response[2].disqualifiedPlayers

               let all = response[1].players.filter(p => {
                   let ret =
                        current.indexOf(p) < 0 &&
                        disqualified.indexOf(p) < 0

                   return ret
               })

               me.players.all = all.map(p => playerMap[p])
               me.players.current = current.map(p => playerMap[p])
               me.players.disqualified = disqualified.map(p => playerMap[p])

               me.groups = ['all', 'current', 'disqualified']

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