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
                        <b-button v-on:click="$router.push({path: $partPath + `/rounds/${row.id}/edit`})">Edit</b-button>
                        <b-button v-on:click="$router.push({path: $partPath + `/rounds/${row.id}/delete`})">Delete</b-button>
                        <b-button v-if="row.startable" v-on:click="$router.push({path: $partPath + `/rounds/${row.id}/start`})">Start</b-button>
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
                        me.$graph(
                            "Rounds",
                            {nodes: ["id", "name","status"]},
                            {tournamentEventPartId: part.id},
                            true
                        ).then((parts) => {
                            let running = parts.nodes.filter(p => p.status === 'Ongoing')
                            if(running.length === 0) {
                                parts.nodes.forEach(p => {
                                    p.startable = p.status === 'New'
                                })
                            }
                            me.values = parts.nodes
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