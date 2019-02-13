<template>
    <div id="tournaments">
        Charts

        <b-button @click="$router.push({path: $tournamentPath + `/charts/add`})" variant="info" class="m-1">
            Add
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
                        Nothing
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

            me.$loadTournament().then((tournament) => {
                //load selected charts
            })

        },

        components: {
        }
    }
</script>

<style scoped>

</style>