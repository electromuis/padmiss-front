'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

import store from './Store'

Vue.use(VueRouter)

import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Login/Settings.vue'
import Profile from '../components/Login/Profile.vue'
import Recover from '../components/Login/Recover.vue'
import Home from '../components/Home.vue'
import Scores from '../components/Scores.vue'
import ScoreDetails from '../components/Scores/Details.vue'
import MyScores from '../components/Scores/My.vue'
import PostScores from '../components/Scores/Post.vue'
import Tournaments from '../components/Tournaments.vue'
import EditTournaments from '../components/Tournaments/Edit.vue'
import DetailsTournaments from '../components/Tournaments/Details.vue'
import DeleteTournaments from '../components/Tournaments/Delete.vue'
import PlayersTournaments from '../components/Tournaments/Players.vue'
import JoinTournaments from '../components/Tournaments/Join.vue'
import Events from '../components/Tournaments/Events.vue'
import PlayersEvents from '../components/Tournaments/Events/Players.vue'
import EditEvents from '../components/Tournaments/Events/Edit.vue'
import DeleteEvents from '../components/Tournaments/Events/Delete.vue'
import Charts from "../components/Tournaments/Events/Parts/Charts.vue"
import Songs from "../components/Login/Songs.vue"
import Cabs from "../components/Cabs.vue"
import EditCabs from "../components/Cabs/Edit.vue"
import DeleteCabs from "../components/Cabs/Delete.vue"
import Parts from "../components/Tournaments/Events/Parts.vue"
import EditParts from "../components/Tournaments/Events/Parts/Edit.vue"
import DeleteParts from "../components/Tournaments/Events/Parts/Delete.vue"
import StartParts from "../components/Tournaments/Events/Parts/Start.vue"
import StructurePart from "../components/Tournaments/Events/Parts/Structure.vue"
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
    path: '/profile',
    component: Profile,
    name: 'profile',
    meta: {
      title: 'Profile',
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
  },,
  {
    path: '/login/recover',
    component: Recover,
    name: 'login-recover',
    meta: {
      paren: 'login',
      title: 'Recover',
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
    path: '/scores',
    component: Scores,
    name: 'scores',
    meta: {
      title: 'Scores',
      public: true,
    },
  },
  {
    path: '/scores/details/:scoreId',
    component: ScoreDetails,
    name: 'scores-details',
    meta: {
      title: 'Score details',
      public: true,
      parent: 'scores'
    },
  },
  {
    path: '/scores/my',
    component: MyScores,
    name: 'scores-my',
    meta: {
      title: 'My scores',
      public: true,
      parent: 'scores'
    },
  },
  {
    path: '/scores/my/details/:scoreId',
    component: ScoreDetails,
    name: 'scores-my-details',
    meta: {
      title: 'My score details',
      public: true,
      parent: 'scores-my'
    },
  },
  {
    path: '/scores/post',
    component: PostScores,
    name: 'scores-post',
    meta: {
      title: 'Post score',
      public: true,
      parent: 'scores'
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
    path: '/tournaments/:tournamentId/players',
    component: PlayersTournaments,
    name: 'tournament-players',
    meta: {
      title: 'Tournament players',
      public: true,
      parent: 'tournaments'
    },
  },
  {
    path: '/tournaments/:tournamentId/join',
    component: JoinTournaments,
    name: 'tournament-events-join',
    meta: {
      title: 'Tournament join',
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
    path: '/tournaments/:tournamentId/events/:eventId/players',
    component: PlayersEvents,
    name: 'tournament-events-players',
    meta: {
      title: 'Tournament events players',
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
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/charts',
    component: Charts,
    name: 'tournament-events-parts-charts',
    meta: {
      title: 'Tournament events parts charts',
      public: true,
      parent: 'tournament-events-parts'
    },
  },
  {
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/structure',
    component: StructurePart,
    name: 'tournament-events-parts-structure',
    meta: {
      title: 'Tournament events parts structure',
      public: true,
      parent: 'tournament-events-parts'
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
    path: '/tournaments/:tournamentId/events/:eventId/parts/:partId/start',
    component: StartParts,
    name: 'tournament-events-parts-start',
    meta: {
      title: 'Tournament events parts start',
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
