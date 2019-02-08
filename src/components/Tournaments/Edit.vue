<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="tournament" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentMixin from '../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],
        methods: {
            handleClick(e) {
                let me = this
                let data = this.tournament
                data.token = localStorage.token

                if(me.loading === false) {
                    if(this.$route.params.id !== 0) {
                        me.$api.put('/api/tournaments/' + this.$route.params.id, data, {expectStatus: 201}).then(() => {
                            me.$router.push('/tournaments')
                        })
                    } else {
                        me.$api.post('/api/tournaments', data, {expectStatus: 201}).then(() => {
                            me.$router.push('/tournaments')
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
            this.$api.get('/api/users?sort=email&token=' + localStorage.token)
            .then((users) => {
                let mappedUsers = users.map(u => {
                    return {
                        name: u.email,
                        id: u.id
                    }
                })

                me.schema.fields.filter(x => x.model === 'tournamentAdmin')[0].values = mappedUsers
                me.schema.fields.filter(x => x.model === 'tournamentManagers')[0].items.values = mappedUsers
            })

            if(this.$route.params.tournamentId !== 0) {
                me.$loadTournament().then((r) => {
                    me.loading = false
                })
            }
            else {
                me.loading = false
            }
        },

        data () {
            return {
                valid: false,
                success: false,
                loading: true,
                message: "",
                tournament: {
                    id: 0,
                    name: "",
                    description: "",
                    tournamentAdmin: "",
                    tournamentManagers: [],
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
                            type: "select",
                            label: "Tournament admin",
                            model: "tournamentAdmin",
                            require: "true",
                            values: [],
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "input",
                            inputType: "date",
                            label: "Start date",
                            model: "startDate",
                            required: "true",
                            validator: VueFormGenerator.validators.date,
                        },
                        {
                            type: "input",
                            inputType: "date",
                            label: "End date",
                            model: "endDate",
                            required: "true",
                            validator: VueFormGenerator.validators.date,
                        },
                        {
                            type: "array",
                            label: "Tournament managers",
                            model: "tournamentManagers",
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

<style scoped>

</style>