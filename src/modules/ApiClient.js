'use strict'

import _ from 'lodash'
import axios from 'axios'
import config from 'ClientConfig'

const client = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  timeout: 60000,
})

export default class ApiClient {
  static apiResponseHandler({ method, route, resolve, reject, response, options = null }) {
    if (config.debug.vue)
      console.log(method, route, 'RESULT', response)

    if (response.status && response.status === 200) {
      resolve(response.data)
    }
    else if (options && options.resolveAlways) {
      resolve(null)
    }
    else {
      ApiClient.apiErrorHandler({
        err: new Error('Invalid response'),
        resolve,
        reject,
        options,
      })
    }
  }

  static apiErrorHandler({ method, route, err, resolve, reject, options = null }) {
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

  static get(route, options = {}) {
    if (config.debug.vue)
      console.log('GET', route)

    return new Promise((resolve, reject) => {
      client.get(route)
        .then(response => {
          ApiClient.apiResponseHandler({
            method: 'GET',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          ApiClient.apiErrorHandler({
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

  static post(route, payload, options = {}) {
    if (config.debug.vue)
      console.log('POST', route, payload)

    return new Promise((resolve, reject) => {
      client.post(route, payload)
        .then(response => {
          ApiClient.apiResponseHandler({
            method: 'POST',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          ApiClient.apiErrorHandler({
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

  static patch(route, payload, options = {}) {
    if (config.debug.vue)
      console.log('PATCH', route, payload)

    return new Promise((resolve, reject) => {
      client.patch(route, payload)
        .then(response => {
          ApiClient.apiResponseHandler({
            method: 'PATCH',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          ApiClient.apiErrorHandler({
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

  static put(route, payload, options = {}) {
    if (config.debug.vue)
      console.log('PUT', route, payload)

    return new Promise((resolve, reject) => {
      client.put(route, payload)
        .then(response => {
          ApiClient.apiResponseHandler({
            method: 'PUT',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          ApiClient.apiErrorHandler({
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

  static delete(route, options = {}) {
    if (config.debug.vue)
      console.log('DELETE', route)

    return new Promise((resolve, reject) => {
      client.delete(route)
        .then(response => {
          ApiClient.apiResponseHandler({
            method: 'DELETE',
            route,
            resolve,
            reject,
            response,
            options,
          })
        })
        .catch(err => {
          ApiClient.apiErrorHandler({
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
