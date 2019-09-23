import ApiClient from './ApiClient'
import axios from 'axios'

export default class {

  static async init() {
    if(typeof this.cabs !== 'undefined') {
      return
    }

    let cabs = {}

    await ApiClient.get('/api/arcade-cabs/live').then(response => {

      response.cabs.forEach(c => {
        cabs[c._id] = c
      })
    })

    this.cabs = cabs
  }

  static ping(id) {
    let me = this

    return me
        .init()
        .then(r => new Promise(resolve => {

        if(!this.isOnline(id)) {
          resolve(false)
        }

        try {
          let url = 'http://' + this.cabs[id].ip + '/info'

          axios.get(url).then(response => {
            console.log(response.data)

            resolve(response.data.status == 'OK')
          })
        }
        catch (e) {
          console.log(e)

          resolve(false)
        }
      })
    )
  }

  static async isOnline(id) {
    await this.init()

    return typeof this.cabs[id] !== 'undefined'
  }
}