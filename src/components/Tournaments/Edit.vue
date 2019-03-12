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
                    if(this.$route.params.tournamentId.length > 1) {
                        me.$api.put('/api/tournaments/' + this.$route.params.tournamentId, data, {expectStatus: 201}).then(() => {
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

            this.$getCabValues().then((cabs) => {
                me.schema.fields.filter(x => x.model === 'arcadeCabs')[0].items.values = cabs
            })

            if(this.$route.params.tournamentId.length > 1) {
                me.$loadTournament(true).then((r) => {
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

<style scoped>
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