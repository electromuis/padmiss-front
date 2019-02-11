<template>
    <div class="delete">
        Are you sure you want to delete this tournament?

        <b-button v-on:click="$router.push(`/tournaments`)">No</b-button>
        <b-button v-on:click="handleClick">Delete</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.$api.delete('/api/tournaments/' + me.$route.params.tournamentId + '?token=' + localStorage.token, {expectStatus: 204}).then(() => {
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