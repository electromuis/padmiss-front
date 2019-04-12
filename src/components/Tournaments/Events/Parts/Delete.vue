<template>
    <div class="delete">
        Are you sure you want to delete this part?

        <b-button v-on:click="$router.push($eventPath + `/parts`)">No</b-button>
        <b-button v-on:click="handleClick">Delete</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.$api.delete('/api/tournament-event-parts/' + me.$route.params.partId + '/delete-tournament-event-part?token=' + localStorage.token, {expectStatus: 204}).then(() => {
                    me.$router.push(me.$eventPath + '/parts')
                })
            }
        },

        created() {
            let me = this

            this.$loadTournament().then((r) => {
                me.$loadEvent().then((r) => {
                    me.$loadPart()
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