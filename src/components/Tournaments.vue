<template>
    <div id="tournaments">
        Tournaments
        <table class="table table-striped">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td>{{ row._id }}</td>
                    <td>{{ row.name }}</td>
                    <td>
                        <b-button v-on:click="$router.push({path: `/tournaments/${row._id}/events`})">Events</b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Event",

        data() {
            return {
                rows: []
            }
        },

        mounted() {
            let self = this

            this.padmiss.get("tournaments").then((response) => {
                if(Array.isArray(response.data)) {
                    self.rows = response.data
                }
            })
        }
    }
</script>

<style scoped>

</style>