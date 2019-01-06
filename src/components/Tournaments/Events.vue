<template>
    <div id="parts">
        Events
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
                    <b-button></b-button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Events",

        data() {
            return {
                rows: []
            }
        },

        mounted() {
            let self = this
            let id = this.$route.params.id

            this.padmiss.get("tournament-events?tournament=" + id).then((response) => {
                if(Array.isArray(response.data)) {
                    self.rows = response.data
                }
            })
        }
    }
</script>

<style scoped>

</style>