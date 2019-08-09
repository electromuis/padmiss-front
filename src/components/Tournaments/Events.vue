<template>
    <div id="tournaments">
        Events

        <b-button v-if="$can('edit-tournament', tournament)" @click="$router.push({path: $tournamentPath + `/events/0/edit`})" variant="info" class="m-1">
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
                        <b-button v-on:click="$router.push({path: $tournamentPath + `/events/${row._id}/players`})">Players</b-button>
                        <b-button v-on:click="$router.push({path: $tournamentPath + `/events/${row._id}/parts`})">Parts</b-button>
                        <template v-if="$can('edit-tournament', tournament)">
                            <b-button v-on:click="$router.push({path: $tournamentPath + `/events/${row._id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: $tournamentPath + `/events/${row._id}/delete`})">Delete</b-button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'
    import AuthMixin from '../../mixins/AuthMixin'

    export default {
        name: "Events",

        mixins: [TournamentMixin, AuthMixin],

        data() {
            return {
                path: "",
                tournament: {},
                values: []
            }
        },

        created() {
            let me = this

            me.$loadTournament().then((tournament) => {

                me.$graph(
                    'TournamentEvents',
                    {docs: [
                        '_id',
                        'name',
                        'status'
                    ]},
                    {tournamentId: tournament._id},
                    true
                ).then(events => {
                    me.values = events.docs
                })
            })

        },

        components: {
        }
    }
</script>

<style scoped>

</style>