<template>
    <div id="tournaments">
        Parts

        <b-button @click="$router.push({path: $eventPath + `/parts/0/edit`})" variant="info" class="m-1">
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
                        <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row._id}/edit`})">Edit</b-button>
                        <b-button v-on:click="$router.push({path: $eventPath + `/parts/${row._id}/delete`})">Delete</b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],

        data() {
            return {
                path: "",
                tournament: {},
                event: {},
                values: []
            }
        },

        created() {
            let me = this

            me.$loadTournament().then((tournament) => {
                me.$loadEvent().then((event) => {
                    me.$graph.query(
                        "TournamentEventParts",
                        {docs: ["_id", "name","status"]}
                    ).then((parts) => {
                        me.values = parts.docs
                    })
                })
            })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>