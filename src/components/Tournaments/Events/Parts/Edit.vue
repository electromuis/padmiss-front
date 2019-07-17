<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="myPart" :options="formOptions" @validated="handleValidation" />
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
            updateRelations(partId) {
                let me = this

                return new Promise((r) => {r()}).then(() => {
                    console.log(me.part)

                    let remove = me.part.arcadeCabs.filter(p => me.myPart.arcadeCabs.indexOf(p) === -1)
                    if(remove.length === 0) {
                        return
                    }
                    return me.$api.post('/api/tournament-event-parts/' + partId + '/remove-arcade-cabs', {arcadeCabs: remove, token: localStorage.token})
                }).then(() => {
                    let add = me.myPart.arcadeCabs.filter(p => me.part.arcadeCabs.indexOf(p) === -1)
                    if(add.length === 0) {
                        return
                    }
                    return me.$api.post('/api/tournament-event-parts/' + partId + '/add-arcade-cabs', {arcadeCabs: add, token: localStorage.token})
                })
            },

            handleClick(e) {
                let me = this
                if(me.loading === false) {
                    let data = this.myPart
                    data.token = localStorage.token

                    if(this.$route.params.partId.length > 1) {
                        me.$api.put('/api/tournament-event-parts/' + this.$route.params.partId + '/edit', data, {expectStatus: 201}).then((part) => {
                            me.updateRelations(part.tournamentEventPart._id).then(() => {
                                me.$router.push(me.$eventPath + "/parts")
                            })
                        })
                    } else {
                        me.$api.post('/api/tournament-events/' + this.event._id + '/create-event-part', data, {expectStatus: 201}).then((part) => {
                            me.part = part

                            me.updateRelations(part.tournamentEventPart._id).then(() => {
                                me.$router.push(me.$eventPath + "/parts")
                            })

                            // me.genElimination().then((r) => {
                            //     console.log("Generation result: " + r)
                            //     me.$router.push(me.$eventPath + "/parts")
                            // })
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
                return this.$getCabValues()
            }).then(cabs => {
                me.schema.fields.filter(x => x.model === 'arcadeCabs')[0].items.values = cabs
                return me.$loadEvent()
            }).then(event => {
                if(me.$route.params.partId.length > 1) {
                    return me.$loadPart()
                }
            }).then(part => {
                if(part) {
                    Object.entries(me.myPart).forEach(([k, v]) => {
                        if(part[k]) {
                            if(Array.isArray(part[k])) {
                                me.myPart[k] = [...part[k]]
                            } else {
                                me.myPart[k] = part[k]
                            }
                        }
                    })
                }

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
                part: {arcadeCabs: []},
                myPart: {
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