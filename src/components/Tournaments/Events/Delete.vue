<template>
    <div class="delete">
        Are you sure you want to delete this event?

        <b-button v-on:click="$router.push($tournamentPath + `/events`)">No</b-button>
        <b-button v-on:click="handleClick">Delete</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.$api.delete('/api/tournament-events/' + me.$route.params.eventId + '?token=' + localStorage.token, {expectStatus: 204}).then(() => {
                    me.$router.push(me.$tournamentPath + '/events')
                })
            }
        },

        created() {
            let me = this

            this.$loadTournament().then((r) => {
                me.$loadEvent().then((r) => {

                })
            })
        },

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>