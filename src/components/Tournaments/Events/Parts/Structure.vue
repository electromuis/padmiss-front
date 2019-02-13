<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="structure">
        Event part structure<br/>

        <component :is="type"></component>
    </div>
</template>

<script>
    import TournamentMixin from '../../../../mixins/TournamentMixin'

    import DoubleElimination from './Structure/DoubleElimination.vue'
    import SingleElimination from './Structure/SingleElimination.vue'
    import RoundRobin from './Structure/RoundRobin.vue'
    import KotH from './Structure/KotH.vue'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this


            }
        },

        created() {
            let me = this

            Promise.all([
                me.$loadTournament(),
                me.$loadEvent(),
                me.$loadPart(),
                me.$loadRound()
            ]).then((r) => {
                me.loading = false
            })
        },

        data () {
            return {
                loading: true,
                type: ""
            }
        },

        comments: {
            DoubleElimination,
            SingleElimination,
            RoundRobin,
            KotH
        }
    }
</script>

<style scoped>

</style>