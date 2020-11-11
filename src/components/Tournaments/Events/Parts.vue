<template>
    <div id="tournaments">
        Parts

        <b-button v-if="$can('edit-tournament', tournament)" @click="$router.push({path: $eventPath + `/parts/0/edit`})" variant="info" class="m-1">
            New
        </b-button>

        <table class="table table-striped">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Status</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in values">
                    <td>{{ row.name }}</td>
                    <td>{{ row.status }}</td>
                    <td>
                        <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/rounds`})">Rounds</b-button>

                        <template v-if="$can('edit-tournament', tournament)">
                            <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/delete`})">Delete</b-button>
                            <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/structure`})">Structure</b-button>
                            <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/charts`})">Charts</b-button>
                            <b-button v-if="row.status === 'New'" v-on:click="$router.push({path: $eventPath + `/parts/${row.id}/start`})">Start</b-button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../../mixins/TournamentMixin'
    import AuthMixin from '../../../mixins/AuthMixin'

    export default {
        mixins: [TournamentMixin, AuthMixin],

        data() {
            return {
                path: "",
                tournament: null,
                event: {},
                values: []
            }
        },

        created() {
            let me = this

            me.$loadTournament().then((tournament) => {
                return me.$loadEvent()
            }).then(event => {
                return me.$graph(
                    "TournamentEventParts",
                    {nodes: ["id", "name","status"]},
                    {tournamentEventId: event.id},
                    true
                )
            }).then(parts => {
                me.values = parts.nodes
            })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>