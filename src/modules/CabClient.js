import ApiClient from './ApiClient'
import ApiClientInstance from './ApiClientInstance'
import axios from 'axios'
import config from "ClientConfig";

let cabs = null

export default class {

  static init() {
    return new Promise(resolve => {
      if(cabs !== null) {
        resolve(cabs)
        return
      }

      cabs = {}

      ApiClient.get('/api/arcade-cabs/live').then(response => {

        response.cabs.forEach(c => {
          cabs[c.id] = c
        })

        resolve(cabs)
      })
    })
  }

  static cabInfo(id) {
    return cabs[id]
  }

  static ping(id) {
    let me = this

    return me
        .init()
        .then(r => new Promise((resolve, reject) => {
          console.log(123)
          this.isOnline(id).then(r => {
            if (!r) {
              console.log(123)
              reject()
              return
            }

            let url = 'http://' + me.cabs[id].ip + '/info'

            axios.get(url).then(response => {
              if (response.data.status != 'OK') {
                reject()
                return
              }

              resolve(response.data)
            })
          })
        })
    )
  }

  static async isOnline(id) {
    await this.init()

    return typeof cabs[id] !== 'undefined'
  }

  static client(id) {
    let me = this

    return new Promise(resolve => {
      me.init().then(() => {


        if(typeof cabs[id].client !== 'undefined') {
          resolve(cabs[id].client)
        }
        else {
          me.ping(id).then(info => {
            const url = 'http://' + info.ip + '/'

            cabs[id].client = new ApiClientInstance({
              baseURL: url,
              timeout: 20000,
            })

            resolve(cabs[id].client)
          })
        }

      })
    })

  }
}