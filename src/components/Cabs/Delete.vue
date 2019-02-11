<template>
    <div class="delete">
        Are you sure you want to delete this cab?

        <b-button v-on:click="$router.push(`/cabs`)">No</b-button>
        <b-button v-on:click="handleClick">Delete</b-button>
    </div>
</template>

<script>

    export default {
        methods: {
            handleClick(e) {
                let me = this

                me.$api.delete('/api/arcade-cabs/' + me.$route.params.cabId + '?token=' + localStorage.token, {expectStatus: 204}).then(() => {
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