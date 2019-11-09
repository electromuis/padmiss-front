'use strict'

import _ from 'lodash'
import axios from 'axios'
import config from 'ClientConfig'

let client = null


export default class ApiClientInstance {
  constructor(myConfig) {
    let me = this

    if(myConfig == undefined) {
      myConfig = {
        baseURL: config.apiBaseUrl,
        // withCredentials: true,
        timeout: 60000,
      }
    }

    me.client = axios.create(myConfig)
  }

  apiResponseHandler({ method, route, resolve, reject, response, options = null }) {
    let me = this
    
    if (config.debug.vue)
      console.log(method, route, 'RESULT', response)

    if (options && options.expectStatus && response.status && response.status === options.expectStatus) {
      resolve(response.data)
    }
    else if (response.status && response.status === 200) {
      resolve(response.data)
    }
    else if (options && options.resolveAlways) {
      resolve(null)
    }
    else {
      me.apiErrorHandler({
        err: new Error('Invalid response'),
        resolve,
        reject,
        options,
      })
    }
  }

  apiErrorHandler({ method, route, err, resolve, reject, options = null }) {
    let me = this
    
    if (options && options.resolveAlways) {
      return resolve(null)
    }

    if (config.debug.vue)
      console.log(method, route, 'ERROR', err.message, err.response)

    console.error(err)

    let responseData = _.get(err, 'response.data')

    if (responseData && _.isString(responseData)) {
      return reject(new Error(responseData))
    }

    reject(err)
  }

  get(route, options = {}) {
    let me = this
    
    if (config.debug.vue)
      console.log('GET', route)

    return new Promise((resolve, reject) => {
      me.client.get(route)
        .then(response => {
          me.apiResponseHandler({
            method: 'GET',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          me.apiErrorHandler({
            method: 'GET',
            route,
            err,
            resolve,
            reject,
            options,
          })
        })
    })
  }

  post(route, payload, options = {}) {
    let me = this
    
    if (config.debug.vue)
      console.log('POST', route, payload)

    return new Promise((resolve, reject) => {
      me.client.post(route, payload)
        .then(response => {
          me.apiResponseHandler({
            method: 'POST',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          me.apiErrorHandler({
            method: 'POST',
            route,
            err,
            resolve,
            reject,
            options,
          })
        })
    })
  }

  patch(route, payload, options = {}) {
    let me = this
    
    if (config.debug.vue)
      console.log('PATCH', route, payload)

    return new Promise((resolve, reject) => {
      me.client.patch(route, payload)
        .then(response => {
          me.apiResponseHandler({
            method: 'PATCH',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          me.apiErrorHandler({
            method: 'PATCH',
            route,
            err,
            resolve,
            reject,
            options,
          })
        })
    })
  }

  put(route, payload, options = {}) {
    let me = this
    
    if (config.debug.vue)
      console.log('PUT', route, payload)

    return new Promise((resolve, reject) => {
      me.client.put(route, payload)
        .then(response => {
          me.apiResponseHandler({
            method: 'PUT',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          me.apiErrorHandler({
            method: 'PUT',
            route,
            err,
            resolve,
            reject,
            options,
          })
        })
    })
  }

  delete(route, options = {}) {
    let me = this
    
    if (config.debug.vue)
      console.log('DELETE', route)

    return new Promise((resolve, reject) => {
      me.client.delete(route)
        .then(response => {
          me.apiResponseHandler({
            method: 'DELETE',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          me.apiErrorHandler({
            method: 'DELETE',
            route,
            err,
            resolve,
            reject,
            options,
          })
        })
    })
  }
}
