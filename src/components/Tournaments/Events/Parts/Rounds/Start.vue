<template>
    <div class="delete">
        Are you sure you want to start this round?

        <b-button v-on:click="$router.push($partPath + `/rounds`)">No</b-button>
        <b-button v-on:click="handleClick">Start</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.round.status = 'Ongoing'
                me.round.token = localStorage.token

                me.$api.put('/api/rounds/' + me.$route.params.roundId, me.round, {expectStatus: 204}).then(() => {
                    me.$router.push(me.$partPath + '/rounds')
                })
            }
        },

        created() {
            let me = this

            Promise.all([
                me.$loadTournament(),
                me.$loadEvent(),
                me.$loadPart(),
                me.$loadRound()
            ])
        },

        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>