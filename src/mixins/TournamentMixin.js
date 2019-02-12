import Query from 'graphql-query-builder'

export default {
    'STATUS_OPTIONS': [
        "New",
        "Ongoing",
        "Finished"
    ],

    'ROUND_TYPES': [
        "KotH",
        "SingleElimination",
        "DoubleElimination",
        "RoundRobin"
    ],

    'PLAY_STYLES': [
        "Single",
        "Double"
    ],

    methods: {
        $loadTournament(full) {
            let me = this

            return new Promise(((resolve, reject) => {
               if(full === true) {
                   this.$graph.query(
                       'Tournament',
                       [
                           'name',
                           'description',
                           'startDate',
                           'endDate',
                           {'tournamentAdmin': ['_id']},
                           {'tournamentManagers': ['_id']},
                           {'arcadeCabs': ['_id']}
                       ],
                       {'id': me.$route.params.tournamentId}
                   ).then((tournament) => {
                       tournament.tournamentAdmin = tournament.tournamentAdmin._id
                       tournament.tournamentManagers = tournament.tournamentManagers.map(u => u._id)
                       tournament.arcadeCabs = tournament.arcadeCabs.map(u => u._id)

                       me.tournament = tournament
                       resolve(tournament)
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

        $getCabValues(forTournament) {
            let me = this

            return new Promise(((resolve, reject) => {
                if(forTournament === true) {
                    this.$graph.query(
                        'Tournament',
                        [
                            {'arcadeCabs': ['_id', 'name', 'cabLocation']}
                        ],
                        {'id': me.$route.params.tournamentId}
                    ).then((tournament) => {
                        let mapped = tournament.arcadeCabs.map((c) => {
                            return {
                                id: c._id,
                                name: c.cabLocation + ' - ' + c.name
                            }
                        })
                        resolve(mapped)
                    }).catch(reject)
                } else {
                    me.$graph.query(
                        "ArcadeCabs",
                        {docs: ['_id', 'name', 'cabLocation']}
                    ).then((cabs) => {
                        let mapped = cabs.docs.map((c) => {
                            return {
                                id: c._id,
                                name: c.cabLocation + ' - ' + c.name
                            }
                        })
                        resolve(mapped)
                    }).catch(reject)
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

        $loadPart() {
            let me = this

            return new Promise(((resolve, reject) => {
                this.$graph.query(
                    'TournamentEventPart',
                    [
                        "_id",
                        "name",
                        "roundType",
                        "status",
                        {'arcadeCabs': ['_id']}
                    ],
                    {'id': me.$route.params.partId}
                ).then((part) => {
                    part.arcadeCabs = part.arcadeCabs.map(u => u._id)

                    me.part = part
                    resolve(part)
                }).catch((e) => {
                    reject(e)
                    me.$router.push('/tournaments')
                })
            }))
        },

        $loadRound() {
            let me = this

            return new Promise(((resolve, reject) => {
                this.$graph.query(
                    'Round',
                    [
                        "_id",
                        "name",
                        "roundType",
                        "playMode",
                        "bestOfCount",
                        "status",
                        {'arcadeCabs': ['_id']}
                    ],
                    {'id': me.$route.params.roundId}
                ).then((round) => {
                    round.arcadeCabs = round.arcadeCabs.map(u => u._id)

                    me.round = round
                    resolve(round)
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
        },

        $eventPath() {
            return '/tournaments/' + this.$route.params.tournamentId + '/events/' + this.$route.params.eventId
        },

        $partPath() {
            return '/tournaments/' + this.$route.params.tournamentId + '/events/' + this.$route.params.eventId + '/parts/' + this.$route.params.partId
        }
    }
}