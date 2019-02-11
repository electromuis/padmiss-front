import Query from 'graphql-query-builder'

export default {
    'STATUS_OPTIONS': [
        "New"
    ],

    methods: {
        $loadTournament(full) {
            let me = this

            return new Promise(((resolve, reject) => {
               if(full === true) {
                   this.$graph.query(
                       new Query('Tournament', {id: me.$route.params.tournamentId})
                       .find([
                           'name',
                           'description',
                           'startDate',
                           'endDate',
                           {'tournamentAdmin': ['_id']},
                           {'tournamentManagers': ['_id']}
                       ])
                   ).then((tournament) => {
                       tournament.Tournament.tournamentAdmin = tournament.Tournament.tournamentAdmin._id
                       tournament.Tournament.tournamentManagers = tournament.Tournament.tournamentManagers.map(u => u._id)

                       me.tournament = tournament.Tournament
                       resolve(tournament.Tournament)
                   }).catch((e) => {
                       reject(e)
                       me.$router.push('/tournaments')
                   })
               } else {
                   this.$api.get('/api/tournaments/' + me.$route.params.tournamentId).then((tournament) => {
                       me.tournament = tournament
                       resolve(tournament)
                   }).catch((e) => {
                       reject(e)
                       me.$router.push('/tournaments')
                   })
               }
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