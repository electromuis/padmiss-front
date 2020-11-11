<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="myEvent" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            handleClick(e) {
                let me = this
                if(me.loading === false) {
                    let data = this.myEvent
                    data.token = localStorage.token
                    // data.tournamentId = this.tournament.id

                    if(this.$route.params.eventId.length > 1) {
                        me.$api.put('/api/tournament-events/' + this.$route.params.eventId + '/edit', data, {expectStatus: 201}).then(() => {
                            me.$router.push(me.$tournamentPath + "/events")
                        })
                    } else {
                        me.$api.post('/api/tournaments/' + this.tournament.id + '/create-event', data, {expectStatus: 201}).then(() => {
                            me.$router.push(me.$tournamentPath + "/events")
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
            this.$loadTournament().then(t => {
                if(me.$route.params.eventId.length > 1) {
                    return me.$loadEvent()
                }
            }).then(event => {
                if(event) {
                    Object.entries(me.myEvent).forEach(([k, v]) => {
                        if(event[k]) {
                            me.myEvent[k] = event[k]
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
                myEvent: {
                    name: "",
                    isCountedToTournamentPoints: true
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
                            label: "Counts in total score",
                            model: "isCountedToTournamentPoints",
                            require: "true",
                            values: [true, false],
                            validator: VueFormGenerator.validators.boolean
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

<style scoped>

</style>