<template>
    <div class="delete">
        Are you sure you want to delete this cab?

        <b-button v-on:click="$router.push(`/cabs`)">No</b-button>
        <b-button v-on:click="handleClick" variant="danger">Delete</b-button>
    </div>
</template>

<script>

    export default {
        methods: {
            handleClick(e) {
                let me = this

                let url = '/api/arcade-cabs/' + me.$route.params.cabId
                if(me.$user.isAdmin() === false) {
                    url += '/delete-cab'
                }
                url += '?token=' + localStorage.token

                me.$api.delete(url , {expectStatus: 204}).then(() => {
                    me.$router.push('/cabs')
                })
            }
        },

        created() {
            let me = this

            me.$graph.query(
                'ArcadeCab',
                [
                    '_id',
                    'name'
                ],
                {id: me.$route.params.cabId}
            ).then((cab) => {
                me.cab = cab
            }).catch(() => {
                me.$router.push('/cabs')
            })
        },

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>