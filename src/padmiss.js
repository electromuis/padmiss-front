import axios from 'axios'

class User {
    constructor(data) {
        this.fields = ['nickname','country','email','shortNickname', 'password', 'rfidUid', 'avatarIconUrl']
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

        if(result.password && result.password.length === 0) {
            delete result.password
        }

        return result
    }
}

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
            let me = this
            this.countries = []

            response.data.forEach((c) => {
                me.countries.push({name: c.name, id: c._id})
            })

            return this.countries
        } else {
            return []
        }
    },

    getUser(callback) {
        if(this.loggedIn() === false) {
            return;
        }

        // callback(this.user)

        axios.get(this.url + "/api/players/" + this.user.playerId).then((response) => {
            let user = Object.assign({}, this.user, response.data);
            user = new User(user)
            callback(user)
        })
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

    updateSettings(data, success, error) {
        this.getUser((user) => {
            user.setData(data)
            let sendData = user.getData();
            sendData.token = localStorage.token

            if(sendData.password == '') {
                delete sendData.password
            }

            axios.put(this.url + '/api/users/' + this.user.userId + '/edit', sendData).then(success).catch(error);
        })
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

        let me = this

        axios.post(this.url + "/validate-token", {"token": localStorage.token}).then((response) => {
            if(response.data.success === true) {
                this.user = response.data
                me.update()
            }
        })
    }

}