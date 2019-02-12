<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="generate">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="options" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Generate</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Generate</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            async handleClick(e) {
                let me = this
                if(me.loading === false) {
                    if(me.part.roundType === 'SingleElimination' || me.part.roundType === 'DoubleElimination') {
                        Promise.all([
                            //Try to find last finished round
                            me.$graph().query(
                                'Rounds',
                                {docs: ["_id", "name"]},
                                //todo dont sort by name!
                                {status: "FINISHED", limit: 1, sort: "name"},
                                true
                            ),
                            me.$graph().query(
                                'TournamentEventPart',
                                {'players': ["_id"]},
                                {'_id': me.partId}
                            )
                        ]).then(vals => {
                            let lastRound = null
                            let cabs = me.arcadeCabs
                            let cabC = 0
                            let players = []

                            if(cabs.length === 0) {
                                return false
                            }

                            if(players.length % 2 !== 0) {
                                return false
                            }

                            if(lastRound === null) {
                                players = vals[1]
                            }
                            else {
                                let matches = await me.$graph().query(
                                    'Matches',
                                    {docs:[

                                    ]},
                                    {roundId: lastRound._id},
                                    true
                                )
                            }

                            if(me.part.roundType === 'SingleElimination') {

                                for(let i = 0; i < players.length; i += 2) {
                                    let data = {
                                        token: localStorage.token,
                                        tournamentEventPartId: me.part._id,
                                        tournamentId: me.tournament.id,
                                        status: "New",
                                        roundType: me.part.roundType,
                                        bestOfCount: me.options.bestOfCount,
                                        arcadeCabs: cabs[cabC],
                                        players: [players[i], players[i+1]]
                                    }

                                    cabC++
                                    if(cabC >= cabs.length) {
                                        cabC = 0
                                    }

                                    e.$api.post('/api/tournament-event-parts', data, {expectStatus: 201}).catch(me.handleError)
                                }
                            }
                        })
                    }
                }
            },
            handleValidation(valid, errors) {
                this.valid = valid
            },
            handleError(e) {

            }
        },

        created() {
            let me = this

            Promise.all([
                this.$loadTournament(),
                me.$loadEvent(),
                me.$loadPart()
            ]).then(() => {
                me.loading = false
            })
        },

        data () {
            return {
                valid: false,
                success: false,
                loading: true,
                message: "",
                tournament: {},
                event: {},
                part: {},
                options: {

                },
                schema: {
                    fields: [
                        {
                            type: "select",
                            label: "Best off",
                            model: "bestOfCount",
                            values: [1,2,3,4,5],
                            required: "true",
                            validator: VueFormGenerator.validators.integer
                        },
                    ]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                    validateAsync: true
                }
            }
        },

        components: {
            "vue-form-generator": VueFormGenerator.component,
            "loading": Loading
        }
    }
</script>

<style>
    .array-item {
        margin-bottom: 12px;
    }
    .btn.remove {
        margin-left: 12px;
    }
    .array-item {
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }
</style>