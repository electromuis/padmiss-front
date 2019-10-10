<template>
    <Details v-if="id" :player="id" :profile="true" />
</template>

<script>
    import Details from '../Players/Details.vue'

    export default {
        created() {
            this.id = this.$user.data.playerId
        },

        data () {
            return {
                id: false
            }
        },

        components: {
            Details
        }
    }
</script>

<style scoped>

</style>