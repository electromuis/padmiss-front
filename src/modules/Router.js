'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

import store from './Store'

Vue.use(VueRouter)

import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Login/Settings.vue'
import Home from '../components/Home.vue'
import Tournaments from '../components/Tournaments.vue'
import Events from '../components/Tournaments/Events.vue'

const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
    meta: {
      title: 'Home',
      public: true,
    },
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: {
      title: 'Register',
      public: true,
    },
  },
  {
    path: '/settings',
    component: Settings,
    name: 'settings',
    meta: {
      title: 'Settings',
      public: true,
    },
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      title: 'Login',
      public: true,
    },
  },
  {
    path: '/tournaments',
    component: Tournaments,
    name: 'tournaments',
    meta: {
      title: 'Tournaments',
      public: true,
    },
  },
  {
    path: '/tournaments/:id/events',
    component: Events,
    name: 'tournament-events',
    meta: {
      title: 'Tournament Events',
      public: true,
    },
  },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' - EC2019'
  }
  next()
})
sync(store, router)

export default router
