'use strict'

import jwt_decode from "jwt-decode";

class User {
    constructor(data) {
        this.id = data.userId

        this.fields = ['nickname', 'country', 'email', 'password', 'rfidUid', 'avatarIconUrl', 'playerId', 'userId']
        this.metaFields = ['songs', 'favoriteScores', 'shortNickname']

        this.data = {}
        this.metaData = {}
        this.setData(data)
    }

    setData(data) {
        if (data.metaData) {
            let result = JSON.parse(data.metaData)
            if (result) {
                this.metaData = result
            }
        }

        for (const [key, value] of Object.entries(data)) {
            if (this.fields.includes(key)) {
                this.data[key] = value
            } else if (this.metaFields.includes(key)) {
                this.metaData[key] = value
            }
        }
    }

    getData() {
        let result = this.data
        if (this.metaData !== undefined) {
            result.metaData = JSON.stringify(this.metaData)
        }
        return result
    }

    isAdmin() {
        return typeof this.data.isAdmin !== 'undefined' && this.data.isAdmin
    }

    save($api) {
        let data = this.getData()
        data.token = localStorage.token

        if (!data.password || data.password.length === 0) {
            delete data.password
        }

        return $api.put('/api/users/' + this.id + '/edit', data)
    }
}

export default {
    computed: {
        // If the user exists in our state we are logged in
        $isLoggedIn() {
            return !!this.$store.state.user
        }
    },

    methods: {
        queryPlayer(playerId) {
            return this.$graph(
                'Player',
                [
                    'id',
                    'nickname',
                    {country: ['id']},
                    'avatarIconUrl',
                    'playerLevel',
                    'accuracy',
                    'stamina',
                    'totalSteps',
                    'totalPlayTimeSeconds',
                    'totalSongsPlayed',
                    'metaData'
                ],
                {id: playerId}
            )
        },

        $autoLogin() {
            let me = this

            return new Promise((resolve, reject) => {

                if(localStorage.decodedToken) {
                    this
                        .queryPlayer(localStorage.decodedToken.playerId)
                        .then(playerResult => {
                            if (playerResult.country) {
                                playerResult.country = playerResult.country.id
                            }

                            let user = new User(Object.assign({}, localStorage.decodedToken, playerResult))

                            // Validation succeeded
                            me.$store.commit('SET', {
                                key: 'user',
                                value: user
                            })

                            resolve(user)
                        }).catch((err) => {
                            delete localStorage.token
                            delete localStorage.decodedToken

                            reject()
                        })
                }
                else {
                    resolve(null)
                }

            })
        },

        $signIn(email, password) {
            let me = this

            return new Promise((resolve, reject) => {
                me.$logDebug('$signIn', email)

                me.$api.post('/v1/authenticate', {
                    email: email,
                    password: password,
                })
                    .then(result => {
                        me.$logDebug('$signIn result', result)


                        // Login successful -> set user to state and save token to local storage
                        let decodedToken = jwt_decode(result.token)
                        localStorage.token = result.token
                        localStorage.decodedToken = decodedToken

                        console.log([result, decodedToken])

                        me.queryPlayer(decodedToken.playerId)
                        .then(playerResult => {
                            if (playerResult.country) {
                                playerResult.country = playerResult.country.id
                            }
                            let user = new User(Object.assign({}, decodedToken, playerResult))

                            // Validation succeeded
                            me.$store.commit('SET', {
                                key: 'user',
                                value: user
                            })

                            resolve(user)
                        }).catch(reject)

                    })
                    .catch((err) => {

                        // Login failed -> delete possible token from local storage and show login failed message
                        if (localStorage.token) {
                            delete localStorage.token
                        }

                        reject(err)
                    })
            })
        },

        $signOut() {
            let me = this

            me.$logDebug('$signOut')

            // Delete user from state, remove token from local storage
            me.$store.commit('NULL', {key: 'user'})

            if (localStorage.token) {
                delete localStorage.token
            }
        },

        $can(action, what) {
            let userId = ''
            let playerId = ''

            if (this.$isLoggedIn === true) {
                userId = this.$store.state.user.data.userId
                playerId = this.$store.state.user.data.playerId
            }


            switch (action) {
                case 'join-tournament':
                    if (this.$isLoggedIn === false) {
                        return false
                    }

                    if (what.players.indexOf(this.$store.state.user.data.playerId) > -1) {
                        return false
                    }

                    if (!what) {
                        return false
                    }
                    if (what.playerJoinRequests.indexOf(this.$store.state.user.data.playerId) > -1) {
                        return false
                    }

                    return true

                case 'create-cab':
                    return true

                case 'own-cab':
                case 'edit-cab':
                    if (!what) {
                        return false
                    }
                    return what.cabOwner == userId || what.coOwners.indexOf(userId) > -1

                case 'edit-tournament':
                    if (!what) {
                        return false
                    }
                    return (what.tournamentAdmin == userId || what.tournamentManagers.indexOf(userId) > -1) ||
                        (what.tournamentAdmin == playerId || what.tournamentManagers.indexOf(playerId) > -1)
            }

            return false
        }
    }
}
