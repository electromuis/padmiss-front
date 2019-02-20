<template>
    <div class="delete">
        Are you sure you want to join this tournament?

        <b-button v-on:click="$router.push(`/tournaments`)">No</b-button>
        <b-button v-on:click="handleClick">Yes</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.tournament.token = localStorage.token
                me.tournament.playerJoinRequests.push(this.$store.state.user.data.playerId)

                me.$api.put('/api/tournaments/' + this.$route.params.tournamentId, me.tournament, {expectStatus: 201}).then(() => {
                    me.$router.push('/tournaments')
                })
            }
        },

        created() {
            let me = this

            me.$loadTournament(true)
        },

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>