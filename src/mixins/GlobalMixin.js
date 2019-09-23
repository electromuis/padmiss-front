'use strict'

import _ from 'lodash'
import Vue from 'vue'
import config from 'ClientConfig'
import ApiClient from '../modules/ApiClient'
import GraphqlClient from "../modules/GraphqlClient";
import CabClient from "../modules/CabClient";

const eventBus = new Vue()

export default Vue.mixin({
  computed: {
    $bus() {
      return eventBus
    },

    $user() {
      return this.$store.state.user
    },

    $api() {
      return ApiClient
    },

    $graph() {
      return GraphqlClient.query
    },

    $cab() {
      return CabClient
    }
  },

  methods: {
    $logDebug(message, obj = null) {
      if(config.debug.vue) {
        console.log(message, obj)
      }
    },

    $logError(message, obj) {
      if(config.debug.vue) {
        console.error(message, obj)
      }
    },

    $vueSet(object, key, value) {
      Vue.set(object, key, value)
    },

    $vueDelete(object, key) {
      Vue.delete(object, key)
    },

    $findById(collection = [], idStringOrNumber) {
      return _.find(collection, ['Id', _.toNumber(idStringOrNumber)])
    },

    /**
     * Programmatically navigate to route. If object then Vue Router object
     * https://router.vuejs.org/en/essentials/navigation.html
     * @param location string|object
     */
    $redirect(location) {
      this.$router.push(location)
    },

    $routeUrl(route) {
      return `https://${location.host}` + this.$router.match(route).path
    },

    $countryCodeToName(code) {
      if(!code) {
        return ''
      }

      let country = this.$store.state.countries.filter(x => x.code === code)
      return country[0].name
    }
  }
})
