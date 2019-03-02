<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="part" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            handleClick(e) {
                let me = this
                if(me.loading === false) {
                    let data = this.part
                    data.token = localStorage.token
                    data.tournamentEventId = this.event._id
                    data.tournamentId = this.tournament._id

                    if(this.$route.params.partId.length > 1) {
                        me.$api.put('/api/tournament-event-parts/' + this.$route.params.partId, data, {expectStatus: 201}).then(() => {
                            me.$router.push(me.$eventPath + "/parts")
                        })
                    } else {
                        me.$api.post('/api/tournament-event-parts', data, {expectStatus: 201}).then((part) => {
                            me.part = part

                            me.genElimination().then((r) => {
                                console.log("Generation result: " + r)
                                me.$router.push(me.$eventPath + "/parts")
                            })
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
                    if(me.$route.params.partId.length > 1) {
                        me.$loadPart().then((r) => {
                            me.loading = false
                        })
                    } else {
                        me.loading = false
                    }
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
                part: {
                    name: "",
                    status: "New",
                    roundType: "",
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
                            label: "Round type",
                            model: "roundType",
                            values: TournamentsMixin.ROUND_TYPES,
                            required: "true",
                            validator: VueFormGenerator.validators.string
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