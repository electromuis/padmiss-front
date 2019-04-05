'use strict'

class User {
  constructor(data) {
    this.fields = ['nickname','country','email','shortNickname', 'password', 'rfidUid', 'avatarIconUrl', 'playerId', 'userId']
    this.metaFields = ['songs']

    this.data = {}
    this.metaData = {}
    this.setData(data)
  }

  setData(data) {
    if(data.metaData) {
      let result = JSON.parse(data.metaData)
      if(result) {
        this.metaData = result
      }
    }

    for (const [key, value] of Object.entries(data)) {
      if(this.fields.includes(key)) {
        this.data[key] = value
      } else if(this.metaFields.includes(key)) {
        this.metaData[key] = value
      }
    }
  }

  getData() {
    let result = this.data
    if(this.metaData !== undefined) {
      result.metaData = JSON.stringify(this.metaData)
    }
    return result
  }

  isAdmin() {
    return typeof this.data.isAdmin !== 'undefined' && this.data.isAdmin
  }
}

export default {
  computed: {
    // If the user exists in our state we are logged in
    $isLoggedIn() {
      return !!this.$store.state.user
    },

    $isAdmin() {
      return true
      return this.$isLoggedIn && this.$store.state.user.isAdmin()
    }
  },

  methods: {
    // Function to auto-login if we have a token stored in our local storage, will set user to state
    $autoLogin() {
      let me = this

      me.$logDebug('$autoLogin')

      return new Promise((resolve, reject) => {
        // No token in local storage, cannot auto-login
        if (!localStorage.token) {
          return resolve(null)
        }

        // Otherwise validate our token from local storage
        me.$api.post('/validate-token', { 'token': localStorage.token }, {
          resolveAlways: true
        })
          .then(result => {
            // Validation failed
            if (!result || result.success === false) {
              if (localStorage.token) {
                delete localStorage.token
              }

              return reject(null)
            }

            me.$api.get('/api/players/' + result.playerId).then(playerResult => {
                let user = new User(Object.assign({}, result, playerResult))

                // Validation succeeded
                me.$store.commit('SET', {
                    key: 'user',
                    value: user
                })

                resolve()
            })
            .catch(reject)


          })
          // In case of errors, get rid of our token from local storage
          .catch(err => {
            if (localStorage.token) {
              delete localStorage.token
            }

            me.$logError('auto sign-in error', err.message)

            reject(null)
          })
      })
    },

    $signIn(email, password) {
      let me = this

      return new Promise((resolve, reject) => {
        me.$logDebug('$signIn', email)

        me.$api.post('/authenticate', {
          email: email,
          password: password,
        })
          .then(result => {
            me.$logDebug('$signIn result', result)

            if (result.success === true) {
              // Login successful -> set user to state and save token to local storage

              me.$store.commit('SET', {
                key: 'user',
                value: new User(result),
              })
              localStorage.token = result.token

              // TODO: Also get player data, or make the backend return also that data with the result

              resolve()
            }
            else {
              // Login failed -> delete possible token from local storage and show login failed message
              if (localStorage.token) {
                delete localStorage.token
              }

              // TODO: Show login error message
              me.$logError('Login failed!', result)

              reject(result)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    $saveUser() {
        return new Promise((resolve, reject) => {
            let me = this
            let userData = me.$user.getData()
            userData.token = localStorage.token

            me.$api.post('/api/users/' + userData.userId + '/edit', userData).then(resolve, reject)
        })
    },

    $signOut() {
      let me = this

      me.$logDebug('$signOut')

      // Delete user from state, remove token from local storage
      me.$store.commit('NULL', { key: 'user' })

      if (localStorage.token) {
        delete localStorage.token
      }
    },

    $can(action, what) {
      let userId = ''

      if(this.$isLoggedIn === true) {
        userId = this.$store.state.user.data.userId
      }


      switch (action) {
        case 'join-tournament':
          if(this.$isLoggedIn === false) {
            return false
          }

          if(what.players.indexOf(this.$store.state.user.data.playerId) > -1) {
            return false
          }

          if(what.playerJoinRequests.indexOf(this.$store.state.user.data.playerId) > -1) {
            return false
          }

          return true

        case 'create-cab':
          return true

        case 'own-cab':
        case 'edit-cab':
          return what.cabOwner == userId || what.coOwners.indexOf(userId) > -1

        case 'edit-tournament':
          return what.tournamentAdmin == userId || what.tournamentManagers.indexOf(userId) > -1

        case 'admin-users-tournament':
          return this.$isAdmin

        case 'edit-users-tournament':
          //todo if is a tournament manager
          return this.$isAdmin
      }

      return false
    }
  }
}
