<template>
    <div id="tournaments">
        Cabs

        <b-button @click="$router.push({path: `/cabs/0/edit`})" variant="info" class="m-1">
            New
        </b-button>

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
                        <b-button v-on:click="$router.push({path: `/cabs/${row.id}/edit`})">Edit</b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Query from 'graphql-query-builder'

    export default {
        name: "Event",

        data() {
            return {
                values: []
            }
        },

        created() {
            let me = this

            this.$graph.query(
                new Query('ArcadeCabs')
                .find({docs: ['name', {'cabOwner': '_id'}]})
            ).then((response) => {
                me.values = response.ArcadeCabs.docs
            })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>