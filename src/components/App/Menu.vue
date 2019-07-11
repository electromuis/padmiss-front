<template>
    <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="home">Home</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item v-if="!$isLoggedIn" to="/register">Register</b-nav-item>
                <b-nav-item v-if="!$isLoggedIn" to="/login">Login</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/settings">Settings</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/songs">Songs</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/tournaments">Tournaments</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/cabs">Cabs</b-nav-item>
                <b-nav-item to="/scores">Scores</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/scores/my">My scores</b-nav-item>
                <b-nav-item v-if="$isLoggedIn" to="/profile">Profile</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item v-if="$isLoggedIn" v-on:click="$signOut(); $router.push('/')" right>Logout</b-nav-item>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
    import AuthMixin from './../../mixins/AuthMixin'

    export default {
        name: "Menu",

        mixins: [
            AuthMixin,
        ],

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>