'use strict'

// libs
import _ from 'lodash'
import 'babel-polyfill'

// Vue
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"

// Config
import config from 'ClientConfig'

if (_.get(config, 'debug.vue')) {
  console.log('VUE DEBUG MODE ENABLED')
  Vue.config.devtools = true
  Vue.config.debug = true
  Vue.config.silent = false
  Vue.config.performance = true
}
else {
  Vue.config.devtools = false
  Vue.config.debug = false
  Vue.config.silent = true
  Vue.config.performance = false
}

// Styles & Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue)

// Router & Store
import store from './modules/Store'
import router from './modules/Router'

// Global Mixins
import './mixins/GlobalMixin'

// Setup App
import App from './App.vue'

// Start Vue
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
