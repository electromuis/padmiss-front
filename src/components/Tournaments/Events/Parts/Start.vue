<template>
    <div class="delete">
        Are you sure you want to start this part?

        <b-button v-on:click="$router.push($eventPath + `/parts`)">No</b-button>
        <b-button v-on:click="handleClick">Start</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.part.status = 'Ongoing'
                me.part.token = localStorage.token

                me.$api.put('/api/tournament-event-parts/' + this.$route.params.partId, me.part, {expectStatus: 201}).then(() => {
                    me.$router.push(me.$eventPath + "/parts")
                })
            }
        },

        created() {
            let me = this

            Promise.all([
                me.$loadTournament(),
                me.$loadEvent(),
                me.$loadPart()
            ])
        },

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>