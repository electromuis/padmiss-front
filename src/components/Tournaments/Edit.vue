<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="myTournament" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentMixin from '../../mixins/TournamentMixin'
    import moment from 'moment'

    export default {
        mixins: [TournamentMixin],
        methods: {
            updateRelations(tournamentId) {

                let me = this
                let remove = me.tournament.tournamentManagers.filter(p => me.myTournament.tournamentManagers.indexOf(p) === -1)
                let add = me.myTournament.tournamentManagers.filter(p => me.tournament.tournamentManagers.indexOf(p) === -1)

                return Promise.all(remove.map(p => {
                    return me.$api.post('/api/tournaments/' + tournamentId + '/remove-tournament-manager', {playerId: p, token: localStorage.token})
                })).then(() => {
                    return Promise.all(add.map(p => {
                        return me.$api.post('/api/tournaments/' + tournamentId + '/add-tournament-manager', {playerId: p, token: localStorage.token})
                    }))
                }).then(() => {
                    let remove = me.tournament.arcadeCabs.filter(p => me.myTournament.arcadeCabs.indexOf(p) === -1)
                    if(remove.length === 0) {
                        return;
                    }
                    return me.$api.post('/api/tournaments/' + tournamentId + '/remove-arcade-cabs', {arcadeCabs: remove, token: localStorage.token})
                }).then(() => {
                    let add = me.myTournament.arcadeCabs.filter(p => me.tournament.arcadeCabs.indexOf(p) === -1)
                    if(add.length === 0) {
                        return;
                    }
                    return me.$api.post('/api/tournaments/' + tournamentId + '/add-arcade-cabs', {arcadeCabs: add, token: localStorage.token})
                })
            },

            handleClick(e) {
                let me = this
                let data = this.myTournament
                data.token = localStorage.token

                if(me.loading === false) {
                    if(this.$route.params.tournamentId.length > 1) {
                        me.$api.put('/api/tournaments/' + this.$route.params.tournamentId + '/edit', data, {expectStatus: 201}).then(() => {
                            me.updateRelations(this.$route.params.tournamentId).then(() => {
                                me.$router.push('/tournaments')
                            })
                        })
                    } else {
                        me.$api.post('/api/tournaments/create', data, {expectStatus: 201}).then((response) => {
                            me.updateRelations(response.tournament._id).then(() => {
                                me.$router.push('/tournaments')
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
            this.$getPlayers().then(players => {
                me.schema.fields.filter(x => x.model === 'tournamentManagers')[0].items.values = players

                return this.$getCabValues()
            }).then(cabs => {
                me.schema.fields.filter(x => x.model === 'arcadeCabs')[0].items.values = cabs

                if(this.$route.params.tournamentId.length > 1) {
                    return me.$loadTournament()
                }

                return false
            }).then(tournament => {
                if(tournament) {
                    Object.entries(me.myTournament).forEach(([k, v]) => {
                        if(tournament[k]) {
                            if(Array.isArray(tournament[k])) {
                                me.myTournament[k] = [...tournament[k]]
                            } else {
                                me.myTournament[k] = tournament[k]
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
                tournament: {tournamentManagers: [], arcadeCabs: []},
                myTournament: {
                    id: 0,
                    name: "",
                    description: "",
                    tournamentManagers: [],
                    arcadeCabs: [],
                    startDate: "",
                    endDate: ""
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
                            type: "textArea",
                            label: "Description",
                            model: "description",
                            required: "true",
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Start date",
                            model: "startDate",
                            required: "true",
                            validator: VueFormGenerator.validators.date,
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "End date",
                            model: "endDate",
                            required: "true",
                            validator: VueFormGenerator.validators.date,
                        },
                        {
                            type: "array",
                            label: "Tournament managers",
                            model: "tournamentManagers",
                            newElementButtonLabelClasses: "btn btn-secondary new",
                            removeElementButtonClasses: "btn btn-secondary remove",
                            itemContainerClasses: "array-item",
                            showRemoveButton: true,
                            items: {
                                type: "select",
                                values: []
                            }
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