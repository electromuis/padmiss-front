<template>
    <div id="tournaments">
        Events

        <b-button @click="$router.push({path: $tournamentPath + `/events/0/edit`})" variant="info" class="m-1">
            New
        </b-button>

        <!--<vue-bootstrap-table-->
                <!--:columns="columns"-->
                <!--:values="values"-->
                <!--:sortable="true"-->
                <!--:paginated="true"-->
        <!--&gt;-->
        <!--</vue-bootstrap-table>-->
        <table class="table table-striped">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in values">
                    <td>{{ row.name }}</td>
                    <td>
                        <b-button v-on:click="$router.push({path: $tournamentPath + `/events/${row._id}/edit`})">Edit</b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'

    export default {
        name: "Events",

        mixins: [TournamentMixin],

        data() {
            return {
                path: "",
                tournament: {},
                values: []
            }
        },

        created() {
            let me = this

            // this.$api.get('/api/tournaments').then((response) => {
            //     me.values = response
            // })

            me.$loadTournament().then((tournament) => {
                me.$api.get('/api/tournament-events?tournamentId=' + tournament.id).then((events) => {
                    me.values = events
                })
            })

            // me.$api.get('/api/tournaments/' + this.$route.params.id).then((tournament) => {
            //     me.tournament = tournament
            //
            //     me.$api.get('/api/tournament-events?tournamentId=' + tournament.id).then((events) => {
            //
            //
            // }).except((err) => {
            //     me.$router.push('/tournaments')
            // })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>