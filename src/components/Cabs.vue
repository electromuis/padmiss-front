<template>
    <div id="tournaments">
        <h1>Cabs</h1>

        <b-button v-if="$can('create-cab')" @click="$router.push({path: `/cabs/0/edit`})" variant="info" class="m-1">
            New
        </b-button>
        <br/>
        <br/>

        <table class="table table-striped">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Actions</td>
                    <td>API Key</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in values">
                    <td>{{ row.name }}</td>
                    <td>
                        <template v-if="$can('edit-cab', row)">
                            <b-button v-on:click="$router.push({path: `/cabs/${row._id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: `/cabs/${row._id}/delete`})">Delete</b-button>
                        </template>
                    </td>
                    <td>
                        <template v-if="$can('own-cab', row)">
                            {{row.apiKey}}
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
        name: "Event",

        mixins: [AuthMixin],

        data() {
            return {
                values: []
            }
        },

        created() {
            let me = this

            if(me.$user.isAdmin()) {
                this.$graph(
                    'ArcadeCabs',
                    {docs: ['_id', 'name', {'cabOwner': ['_id']}, {'coOwners': ['_id']}]}
                ).then((response) => {
                    me.values = response.docs.map(c => {
                        c.cabOwner = c.cabOwner._id
                        c.coOwners = c.coOwners.map(o => o._id)
                        return c
                    })
                })
            } else {
                me.$api.get(
                    '/api/arcade-cabs/get-my-cabs?token=' + localStorage.token
                ).then(response => {
                    me.values = response.cabs
                })
            }
        },

        components: {
        }
    }
</script>

<style scoped>

</style>