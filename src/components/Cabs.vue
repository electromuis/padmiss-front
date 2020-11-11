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
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in values">
                    <td>{{ row.name }}</td>
                    <td>
                        <template v-if="$can('edit-cab', row)">
                            <b-button v-on:click="$router.push({path: `/cabs/${row.id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: `/cabs/${row.id}/delete`})">Delete</b-button>

                            <b-button v-if="row.status == 'Online'" @click="openTab(row)">Cab page</b-button>
                        </template>
                    </td>
                    <td>
                        <template v-if="$can('own-cab', row)">
                            {{row.apiKey}}
                        </template>
                    </td>
                    <td>
                        {{row.status}}
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

        methods: {

            openTab(c) {
                console.log(c)
                const url = 'http://' + c.data.ip + '/home'
                let win = window.open(url, '_blank');
                win.focus();
            },

            checkCab(c) {
                let me = this

                c.status = "Offline"

                me.$cab.isOnline(c.id).then(r => {
                    if(r) {
                        c.data = me.$cab.cabInfo(c.id)
                        c.status = "Online"
                    }
                })

                // me.$cab.ping(c.id).then(r => {
                //     if(r) {
                //         c.status = "Online+"
                //         return;
                //     }
                //
                //     return me.$cab.isOnline(c.id)
                // }).then(r => {
                //     if(r) {
                //         c.status = "Online"
                //     }
                // })

            }
        },

        data() {
            return {
                values: []
            }
        },

        created() {
            let me = this

            me.$api.get(
                '/api/arcade-cabs/get-my-cabs?token=' + localStorage.token
            ).then(response => {
                response.cabs.forEach(c => {
                    me.checkCab(c)
                })

                me.values = response.cabs
            })
        },

        components: {
        }
    }
</script>

<style scoped>

</style>