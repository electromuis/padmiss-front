<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="myMatch" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            closeForm() {

            },

            updateRelations(matchId) {
                let me = this

                return new Promise(() => {
                    let remove = me.match.players.filter(p => me.myMatch.players.indexOf(p) === -1)
                    if(remove.length === 0) {
                        return new Promise((r) => {r()})
                    }
                    return me.$api.post('/api/matches/' + matchId + '/remove-players', {players: remove, token: localStorage.token})
                }).then(() => {
                    let add = me.myMatch.arcadeCabs.filter(p => me.match.players.indexOf(p) === -1)
                    if(add.length === 0) {
                        return new Promise((r) => {r()})
                    }
                    return me.$api.post('/api/matches/' + matchId + '/add-arcade-cabs', {players: add, token: localStorage.token})
                })
            },

            handleClick(e) {
                let me = this
                if(me.loading === false) {
                    let data = this.myMatch
                    data.token = localStorage.token

                    if(this.$props.matchId.length > 1) {
                        me.$api.put('/api/matches/' + this.$props.matchId + '/edit', data, {expectStatus: 201}).then((match) => {
                            me.updateRelations(match.id).then(() => {
                                me.closeForm()
                            })
                        })
                    } else {
                        me.$api.post('/api/rounds/' + this.$props.roundId + '/create-match', data, {expectStatus: 201}).then((match) => {
                            me.updateRelations(match.id).then(() => {
                                me.closeForm()
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

            this.$graph(
                'Match',
                [
                    {players: 'id'},
                    {games: [

                    ]}
                ]
            )

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
                            me.myPart[k] = part[k]
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
                myMatch: {
                    players: [],
                    games: [],
                    arcadeCab: "",
                    status: ""
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
                            type: "select",
                            label: "Cab",
                            model: "arcadeCab",
                            values: []
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
        },

        props: {
            roundId: String,
            matchId: String
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