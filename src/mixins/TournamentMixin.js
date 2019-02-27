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

            return new Promise((resolve, reject) => {
               this.$graph.query(
                   'Tournament',
                   [
                       '_id',
                       'name',
                       'description',
                       'status',
                       'appIds',
                       'startDate',
                       'endDate',
                       {'tournamentAdmin': ['_id']},
                       {'tournamentManagers': ['_id']},
                       {'arcadeCabs': ['_id']},

                       {'playerJoinRequests': ['_id']},
                       {'players': ['_id']},
                       {'disqualifiedPlayers': ['_id']},
                   ],
                   {'id': me.$route.params.tournamentId}
               ).then((tournament) => {
                   tournament.tournamentAdmin = tournament.tournamentAdmin._id
                   tournament.tournamentManagers = tournament.tournamentManagers.map(u => u._id)

                   tournament.arcadeCabs = tournament.arcadeCabs.map(u => u._id)

                   tournament.players = tournament.players.map(p => p._id)
                   tournament.disqualifiedPlayers = tournament.disqualifiedPlayers.map(p => p._id)
                   tournament.playerJoinRequests = tournament.playerJoinRequests.map(p => p._id)

                   me.tournament = tournament
                   resolve(tournament)
               }).catch((e) => {
                   reject(e)
                   me.$router.push('/tournaments')
               })
           })
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

            return new Promise((resolve, reject) => {
                this.$graph.query(
                    'TournamentEvent',
                    [
                        '_id',
                        'name',
                        'status',
                        'isCountedToTournamentPoints',
                        {'players': ['_id']},
                        {'disqualifiedPlayers': ['_id']},
                    ],
                    {'id': me.$route.params.eventId}
                ).then(event => {
                    event.players = event.players.map(u => u._id)
                    event.disqualifiedPlayers = event.disqualifiedPlayers.map(u => u._id)

                    me.event = event
                    resolve(event)
                }).catch((e) => {
                    reject(e)
                    me.$router.push('/tournaments')
                })
            })
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

        async $generateStructure() {
            let me = this

            let cabs = await this.$getCabValues(true)

            if(this.part.roundType === 'SingleElimination' || this.part.roundType === 'DoubleElimination') {
                let bestOff = 1

                let result = await this.$graph.query(
                    'TournamentEvent',
                    [{players: ['_id']}],
                    {id: me.event._id}
                )

                let players = result.players
                let c = 0

                if(players.length === 0 || (players.length & (players.length - 1)) !== 0) {
                    return "Invalid amount of players";
                }

                let left = players.length
                let i = 0
                let roundNum = 1
                while(left > 1) {
                    let roundBase = {
                        token: localStorage.token,
                        tournamentId: me.tournament._id,
                        tournamentEventPartId: me.part._id,
                        roundType: me.part.roundType,
                        playMode: "Single",
                        name: "Round " + roundNum,
                        status: "New",
                        bestOfCount: bestOff,
                        arcadeCabs: cabs
                    }

                    if(roundNum === 1) {
                        roundBase.players = players
                    }

                    let round = await me.$api.post('/api/rounds', roundBase, {expectStatus: 201})

                    let matches = left / 2

                    while(matches > 0) {
                        let row = {
                            token: localStorage.token,
                            tournamentId: me.tournament._id,
                            roundId: round._id,
                            status: "New",
                            roundType: me.part.roundType,
                            playMode: "Single",
                            bestOfCount: bestOff,
                            arcadeCabs: [],
                        }

                        if (roundNum === 1) {
                            row.players = [players[i], players[i + 1]]
                        }

                        let match = await me.$api.post('/api/matches', row, {expectStatus: 201})

                        i += 2
                        matches --
                    }

                    if(this.part.roundType === 'DoubleElimination') {
                        let roundBase = {
                            token: localStorage.token,
                            tournamentId: me.tournament._id,
                            tournamentEventPartId: me.part._id,
                            roundType: me.part.roundType,
                            playMode: "Single",
                            name: "Losers " + roundNum,
                            status: "New",
                            bestOfCount: bestOff,
                            arcadeCabs: cabs
                        }

                        let round = await me.$api.post('/api/rounds', roundBase, {expectStatus: 201})

                        matches = left / 4

                        while(matches > 0) {
                            let row = {
                                token: localStorage.token,
                                tournamentId: me.tournament._id,
                                roundId: round._id,
                                status: "New",
                                roundType: me.part.roundType,
                                playMode: "Single",
                                bestOfCount: bestOff,
                                arcadeCabs: [],
                            }

                            let match = await me.$api.post('/api/matches', row, {expectStatus: 201})

                            matches --
                        }
                    }

                    roundNum ++
                    left = left / 2
                }
            }

            return true
        },

        async $getPlayer(id) {
            let me = this

            return new Promise((resolve, reject) => {
                me.$getPlayers().then(players => {
                    if(Array.isArray(players) === false) {
                        console.log(["No players", players])
                    }

                    console.log(players)
                    let filter = players.filter(p => p._id === id)
                    if(filter.length === 1) {
                        resolve(filter[0])
                    } else {
                        reject()
                    }
                })
            })
        },

        async $getPlayers() {
            let me = this

            return new Promise((resolve, reject) => {
                if(me.$store.state.players.length === 0) {
                    me.$graph.query(
                        'Players',
                        [
                            '_id',
                            'nickname',
                            'shortNickname',
                            {country: ['_id']},
                            //And the other fields
                        ]
                    ).then(players => {
                        let mapped = players.docs

                        me.$store.commit('SET', {
                            key: 'players',
                            value: mapped
                        })
                        resolve(mapped)
                    })
                    .catch(reject)
                } else {
                    resolve(me.$store.state.players)
                }
            })
        }
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