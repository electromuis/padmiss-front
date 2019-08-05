<template>
    <div id="tournaments">
        Tournaments

        <b-button @click="$router.push({path: `/tournaments/0/edit`})" variant="info" class="m-1">
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
                        <b-button v-if="$can('join-tournament', row)" v-on:click="$router.push({path: `/tournaments/${row._id}/join`})">Join</b-button>
                        <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/events`})">Events</b-button>
                        <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/details`})">Details</b-button>

                        <template v-if="$can('edit-tournament', row)">
                            <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/players`})">Players</b-button>
                            <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/delete`})">Delete</b-button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import AuthMixin from '../mixins/AuthMixin'

    export default {
        mixins: [AuthMixin],

        data() {
            return {
                values: []
            }
        },

        created() {
            let me = this

            this.$graph(
                'Tournaments',
                {docs: [
                    '_id',
                    'name',
                    'status',
                    {tournamentAdmin: ['_id']},
                    {tournamentManagers: ['_id']},
                    {players: ["_id"]},
                    {playerJoinRequests: ["_id"]}
                ]}
            ).then(tournaments => {
                me.values = tournaments.docs.map(t => {
                    t.tournamentAdmin = t.tournamentAdmin._id
                    t.tournamentManagers = t.tournamentManagers.map(p => p._id)
                    t.players = t.players.map(p => p._id)
                    t.playerJoinRequests = t.playerJoinRequests.map(p => p._id)
                    return t
                })
            })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>