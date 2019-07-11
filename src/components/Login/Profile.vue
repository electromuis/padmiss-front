<template>
    <div id="profile">
        Your padmiss GUID: {{id}}
    </div>
</template>

<script>
    export default {
        created() {
            this.id = this.$user.data.playerId
        },

        data () {
            return {
                id: 'loading...'
            }
        }
    }
</script>

<style scoped>

</style>