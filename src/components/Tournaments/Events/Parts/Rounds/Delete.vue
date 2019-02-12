<template>
    <div class="delete">
        Are you sure you want to delete this round?

        <b-button v-on:click="$router.push($partPath + `/rounds`)">No</b-button>
        <b-button v-on:click="handleClick">Delete</b-button>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this

                me.$api.delete('/api/rounds/' + me.$route.params.roundId + '?token=' + localStorage.token, {expectStatus: 204}).then(() => {
                    me.$router.push(me.$partPath + '/rounds')
                })
            }
        },

        created() {
            let me = this

            this.$loadTournament().then((r) => {
                me.$loadEvent().then((r) => {
                    me.$loadPart().then(r => {
                        me.$loadRound()
                    })
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