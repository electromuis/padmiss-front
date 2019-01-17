import 'babel-polyfill'
import padmiss from './padmiss.js'
padmiss.initialize()

import Vue from 'vue'

import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import VueRouter from 'vue-router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue)
Vue.use(VueRouter)


Vue.mixin({
    data: function() {
        return {
            padmiss: padmiss
        }
    }
})

import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Settings from './components/Login/Settings.vue'
import Songs from './components/Login/Songs.vue'
import Home from './components/Home.vue'
import Tournaments from './components/Tournaments.vue'
import Events from './components/Tournaments/Events.vue'

const router = new VueRouter({routes: [
        {path: '/', component: Home},
        {path: '/register', component: Register},
        {path: '/settings', component: Settings},
        {path: '/songs', component: Songs},
        {path: '/login', component: Login},
        {path: '/tournaments', component: Tournaments},
        {path: '/tournaments/:id/events', component: Events}
]})

import fieldArray from "vfg-field-array/src/components/field-array.vue";
Vue.component("fieldArray", fieldArray);

new Vue({
  router: router,
  el: '#app',
  render: h => h(App)
})
