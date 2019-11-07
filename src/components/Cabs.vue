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
                            <b-button v-on:click="$router.push({path: `/cabs/${row._id}/edit`})">Edit</b-button>
                            <b-button v-on:click="$router.push({path: `/cabs/${row._id}/delete`})">Delete</b-button>

                            <b-button v-if="row.status == 'Online+'" @click="checkIn(row, '1')">Check in P1</b-button>
                            <b-button v-if="row.status == 'Online+'" @click="checkIn(row, '2')">Check in P2</b-button>
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

            async checkIn(c, player) {
                let me = this

                me.$cab
                    .client(c._id)
                    .then(client => {
                        client.post('/check_in', {
                            side: player,
                            player: me.$user.data.playerId
                        }).then(r => {
                            console.log(r)
                        })
                    })
            },

            checkCab(c) {
                let me = this

                c.status = "Offline"

                me.$cab.ping(c._id).then(r => {
                    if(r) {
                        c.status = "Online+"
                        return;
                    }

                    return me.$cab.isOnline(c._id)
                }).then(r => {
                    if(r) {
                        c.status = "Online"
                    }
                }).then(r => me.$cab.client(c.id)
                ).then(client => {
                    return client.get('/players')
                }).then(r => {
                    console.log(r)
                })

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