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

                me.$api.post('/api/tournaments/' + this.$route.params.tournamentId + '/add-player-join-request', {token: localStorage.token}, {expectStatus: 201}).then(() => {
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