<template>
    <div id="tournaments">
        Rounds

        <b-button @click="$router.push({path: $partPath + `/rounds/0/edit`})" variant="info" class="m-1">
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
                        <b-button v-on:click="$router.push({path: $partPath + `/rounds/${row._id}/edit`})">Edit</b-button>
                        <b-button v-on:click="$router.push({path: $partPath + `/rounds/${row._id}/delete`})">Delete</b-button>
                        <b-button v-if="row.startable" v-on:click="$router.push({path: $partPath + `/rounds/${row._id}/start`})">Start</b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],

        data() {
            return {
                path: "",
                tournament: {},
                event: {},
                part: {},
                values: []
            }
        },

        created() {
            let me = this

            me.$loadTournament().then((tournament) => {
                me.$loadEvent().then((event) => {
                    me.$loadPart().then((part) => {
                        me.$graph.query(
                            "Rounds",
                            {docs: ["_id", "name","status"]},
                            {tournamentEventPartId: part._id},
                            true
                        ).then((parts) => {
                            let running = parts.docs.filter(p => p.status === 'Ongoing')
                            if(running.length === 0) {
                                parts.docs.forEach(p => {
                                    p.startable = p.status === 'New'
                                })
                            }
                            me.values = parts.docs
                        })
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