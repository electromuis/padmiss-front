export default {
    'STATUS_OPTIONS': [
        "New"
    ],

    methods: {
        $loadTournament() {
            let me = this

            return new Promise(((resolve, reject) => {
                this.$api.get('/api/tournaments/' + me.$route.params.tournamentId).then((tournament) => {
                    me.tournament = tournament
                    resolve(tournament)
                }).catch((e) => {
                    reject(e)
                    me.$router.push('/tournaments')
                })
            }))
        },

        $loadEvent() {
            let me = this

            return new Promise(((resolve, reject) => {
                this.$api.get('/api/tournament-events/' + me.$route.params.eventId).then((event) => {
                    me.event = event
                    resolve(event)
                }).catch((e) => {
                    reject(e)
                    me.$router.push('/tournaments')
                })
            }))
        },
    },

    computed: {
        $tournamentPath() {
            return '/tournaments/' + this.$route.params.tournamentId
        }
    }
}