<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">NavBar</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item v-if="padmiss.loggedIn() == false" to="register">Register</b-nav-item>
          <b-nav-item v-if="padmiss.loggedIn() == false" to="login">Login</b-nav-item>
          <b-nav-item v-if="padmiss.loggedIn()" to="settings">Settings</b-nav-item>
          <b-nav-item v-if="padmiss.loggedIn()" to="songs">Songs</b-nav-item>
          <b-nav-item v-if="padmiss.loggedIn()" v-on:click="padmiss.logout(); $router.push('/')">Logout</b-nav-item>
          <b-nav-item to="tournaments">Tournaments</b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  <div class="container">
    <router-view></router-view>
  </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
