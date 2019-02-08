<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="details">

        <h1>Players</h1>
        <table class="table table-striped">
            <thead>
            <tr>
                <td>Name</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="p in players">
                <td>{{ p.nickname }}</td>
            </tr>
            </tbody>
        </table>

        <h1>Join requests</h1>
        <table class="table table-striped">
            <thead>
            <tr>
                <td>Name</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="p in requests">
                <td>{{ p.nickname }}</td>
            </tr>
            </tbody>
        </table>

        <h1>Disqualified players</h1>
        <table class="table table-striped">
            <thead>
            <tr>
                <td>Name</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="p in disqualified">
                <td>{{ p.nickname }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';

    export default {
        created() {
            let me = this

            this.$api.get('/api/tournaments/' + this.$route.params.id + '&populate=playerJoinRequests').then((tournament) => {
                me.tournament = tournament
            }).except((err) => {
                me.$router.push('/tournaments')
            })
        },

        data () {
            return {
                loading: true,
                tournament: {}
            }
        },

        components: {
            "loading": Loading
        }
    }
</script>

<style scoped>

</style>