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
import EditTournaments from '../components/Tournaments/Edit.vue'
import DetailsTournaments from '../components/Tournaments/Details.vue'
import Events from '../components/Tournaments/Events.vue'
import EditEvents from '../components/Tournaments/Events/Edit.vue'
import Songs from "../components/Login/Songs.vue";

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
    path: '/songs',
    component: Songs,
    name: 'songs',
    meta: {
      title: 'Songs',
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
    path: '/tournaments/:tournamentId/edit',
    component: EditTournaments,
    name: 'tournament-edit',
    meta: {
      title: 'Tournament edit',
      public: true,
    },
  },
  {
    path: '/tournaments/:tournamentId/details',
    component: DetailsTournaments,
    name: 'tournament-details',
    meta: {
      title: 'Tournament details',
      public: true,
    },
  },
  {
    path: '/tournaments/:tournamentId/events',
    component: Events,
    name: 'tournament-events',
    meta: {
      title: 'Tournament events',
      public: true,
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/edit',
    component: EditEvents,
    name: 'tournament-events-edit',
    meta: {
      title: 'Tournament events Edit',
      public: true,
    },
  }
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
