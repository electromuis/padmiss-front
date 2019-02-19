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
import DeleteTournaments from '../components/Tournaments/Delete.vue'
import Events from '../components/Tournaments/Events.vue'
import EditEvents from '../components/Tournaments/Events/Edit.vue'
import DeleteEvents from '../components/Tournaments/Events/Delete.vue'
import Charts from "../components/Tournaments/Events/Charts.vue"
import Songs from "../components/Login/Songs.vue"
import Cabs from "../components/Cabs.vue"
import EditCabs from "../components/Cabs/Edit.vue"
import DeleteCabs from "../components/Cabs/Delete.vue"
import Parts from "../components/Tournaments/Events/Parts.vue"
import EditParts from "../components/Tournaments/Events/Parts/Edit.vue"
import DeleteParts from "../components/Tournaments/Events/Parts/Delete.vue"
import Rounds from "../components/Tournaments/Events/Parts/Rounds.vue"
import EditRounds from "../components/Tournaments/Events/Parts/Rounds/Edit.vue"
import DeleteRounds from "../components/Tournaments/Events/Parts/Rounds/Delete.vue"
import StartRounds from "../components/Tournaments/Events/Parts/Rounds/Start.vue"


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
      parent: 'tournaments'
    },
  },
  {
    path: '/tournaments/:tournamentId/details',
    component: DetailsTournaments,
    name: 'tournament-details',
    meta: {
      title: 'Tournament details',
      public: true,
      parent: 'tournaments'
    },
  },
  {
    path: '/tournaments/:tournamentId/delete',
    component: DeleteTournaments,
    name: 'tournament-delete',
    meta: {
      title: 'Tournament delete',
      public: true,
      parent: 'tournaments'
    },
  },
  {
    path: '/tournaments/:tournamentId/events',
    component: Events,
    name: 'tournament-events',
    meta: {
      title: 'Tournament events',
      public: true,
      parent: 'tournaments'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/edit',
    component: EditEvents,
    name: 'tournament-events-edit',
    meta: {
      title: 'Tournament events Edit',
      public: true,
      parent: 'tournament-events'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/delete',
    component: DeleteEvents,
    name: 'tournament-events-delete',
    meta: {
      title: 'Tournament events Delete',
      public: true,
      parent: 'tournament-events'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/charts',
    component: Charts,
    name: 'tournament-events-charts',
    meta: {
      title: 'Tournament events charts',
      public: true,
      parent: 'tournament-events'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/parts',
    component: Parts,
    name: 'tournament-events-parts',
    meta: {
      title: 'Tournament events parts',
      public: true,
      parent: 'tournament-events'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/edit',
    component: EditParts,
    name: 'tournament-events-parts-edit',
    meta: {
      title: 'Tournament events parts edit',
      public: true,
      parent: 'tournament-events-parts'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/delete',
    component: DeleteParts,
    name: 'tournament-events-parts-delete',
    meta: {
      title: 'Tournament events parts delete',
      public: true,
      parent: 'tournament-events-parts'
    },
  },
  {
      path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/rounds',
      component: Rounds,
      name: 'tournament-events-parts-rounds',
      meta: {
          title: 'Tournament events parts rounds',
          public: true,
          parent: 'tournament-events-parts'
      },
  },
  {
      path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/rounds/:roundId/edit',
      component: EditRounds,
      name: 'tournament-events-parts-rounds-edit',
      meta: {
          title: 'Tournament events parts rounds edit',
          public: true,
          parent: 'tournament-events-parts-rounds'
      },
  },
  {
      path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/rounds/:roundId/delete',
      component: DeleteRounds,
      name: 'tournament-events-parts-rounds-delete',
      meta: {
          title: 'Tournament events parts rounds delete',
          public: true,
          parent: 'tournament-events-parts-rounds'
      },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/rounds/:roundId/start',
    component: StartRounds,
    name: 'tournament-events-parts-rounds-start',
    meta: {
      title: 'Tournament events parts rounds start',
      public: true,
      parent: 'tournament-events-parts-rounds'
    },
  },
  {
    path: '/cabs',
    component: Cabs,
    name: 'cabs',
    meta: {
      title: 'Cabs',
      public: true
    }
  },
  {
    path: '/cabs/:cabId/edit',
    component: EditCabs,
    name: 'cabs-edit',
    meta: {
      title: 'Cabs edit',
      public: true
    }
  },
  {
      path: '/cabs/:cabId/delete',
      component: DeleteCabs,
      name: 'cabs-delete',
      meta: {
          title: 'Cabs delete',
          public: true
      }
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
