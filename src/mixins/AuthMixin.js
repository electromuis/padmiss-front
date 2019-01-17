'use strict'

export default {
  computed: {
    // If the user exists in our state we are logged in
    $isLoggedIn() {
      return !!this.$store.state.user
    },
  },

  methods: {
    // Function to auto-login if we have a token stored in our local storage, will set user to state
    $autoLogin() {
      let me = this

      me.$logDebug('$autoLogin')

      return new Promise(resolve => {
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

              return resolve(null)
            }

            // Validation succeeded
            me.$store.commit('SET', {
              key: 'user',
              value: result
            })

            // TODO: Also get player data, or make the backend return also that data with the result

            resolve(result)
          })
          // In case of errors, get rid of our token from local storage
          .catch(err => {
            if (localStorage.token) {
              delete localStorage.token
            }

            me.$logError('auto sign-in error', err.message)

            resolve(null)
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
                value: result,
              })
              localStorage.token = response.data.token

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

              resolve()
            }
          })
          .catch((err) => {
            reject(err)
          })
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
    }
  }
}
