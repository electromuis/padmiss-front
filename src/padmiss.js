import axios from 'axios'

export default {
    url: "https://api.padmiss.com/",
    user: null,
    updateListeners: [],
    countries: null,

    async getCountries() {
        if(this.countries !== null) {
            return this.countries
        }

        let response = await axios.get(this.url + '/api/countries')
        if(Array.isArray(response.data)) {
            let self = this
            this.countries = []

            response.data.forEach((c) => {
                self.countries.push({name: c.name, id: c._id})
            })

            return this.countries
        } else {
            return []
        }
    },

    get(url) {
        return axios.get(this.url + "/api/" + url)
    },

    update() {
        this.updateListeners.forEach((l) => {
            l();
        })
    },

    initialize() {
        this.checkToken()
    },

    register(data, success, error) {
        axios.post(this.url + '/register', data).then(success).catch(error);
    },

    login(email, password, callback, callbackErr) {
        axios.post(this.url + '/authenticate', {
            "email": email,
            "password": password
        }).then((response) => {
            if(response.data.success === true) {
                callback()
                this.user = response.data
                localStorage.token = response.data.token
            } else {
                callbackErr(response.data)
            }
        }).catch(callbackErr);
    },

    logout() {
        this.user = null
        if(localStorage.token) {
            delete localStorage.token
        }
    },

    loggedIn() {
        return this.user !== null
    },

    checkToken() {
        if(!localStorage.token) {
            return
        }

        let self = this

        axios.post(this.url + "/validate-token", {"token": localStorage.token}).then((response) => {
            if(response.data.success === true) {
                this.user = response.data
                self.update()
            }
        })
    }

}