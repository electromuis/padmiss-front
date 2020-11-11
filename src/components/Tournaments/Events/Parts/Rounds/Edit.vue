<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="round" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            handleClick(e) {
                let me = this
                if(me.loading === false) {
                    let data = this.round
                    data.token = localStorage.token
                    data.tournamentEventPartId = this.part.id
                    data.tournamentId = this.tournament.id
                    data.roundType = this.part.roundType

                    if(this.$route.params.roundId.length > 1) {
                        me.$api.put('/api/rounds/' + this.$route.params.roundId, data, {expectStatus: 201}).then(() => {
                            me.$router.push(me.$partPath + "/rounds")
                        })
                    } else {
                        me.$api.post('/api/rounds', data, {expectStatus: 201}).then(() => {
                            me.$router.push(me.$partPath + "/rounds")
                        })
                    }
                }
            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        created() {
            let me = this
            this.$loadTournament().then((r) => {
                this.$getCabValues().then((cabs) => {
                    me.schema.fields.filter(x => x.model === 'arcadeCabs')[0].items.values = cabs
                })

                me.$loadEvent().then((r) => {
                    me.$loadPart().then((r) => {
                        if(me.$route.params.roundId.length > 1) {
                            me.$loadRound().then((r) => {
                                me.loading = false
                            })
                        } else {
                            me.loading = false
                        }
                    })
                })
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
                round: {
                    name: "",
                    status: "New",
                    playMode: "",
                    bestOfCount: 1,
                    arcadeCabs: []
                },
                schema: {
                    fields: [
                        {
                            type: "input",
                            inputType: "text",
                            label: "Name",
                            model: "name",
                            required: "true",
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "select",
                            label: "Status",
                            model: "status",
                            values: TournamentsMixin.STATUS_OPTIONS,
                            required: "true",
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "select",
                            label: "Game style",
                            model: "playMode",
                            values: TournamentsMixin.PLAY_STYLES,
                            required: "true",
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "select",
                            label: "Best off",
                            model: "bestOfCount",
                            values: [1,2,3,4,5],
                            required: "true",
                            validator: VueFormGenerator.validators.integer
                        },
                        {
                            type: "array",
                            label: "Cabs",
                            model: "arcadeCabs",
                            newElementButtonLabelClasses: "btn btn-secondary new",
                            removeElementButtonClasses: "btn btn-secondary remove",
                            itemContainerClasses: "array-item",
                            showRemoveButton: true,
                            items: {
                                type: "select",
                                values: []
                            }
                        }
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