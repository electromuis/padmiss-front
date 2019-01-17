<template>
    <div id="settings">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import "vue-form-generator/dist/vfg.css";  // optional full css additions

    export default {
        name: "Songs",

        methods: {
            handleClick(e) {
                let self = this
                this.padmiss.updateSettings(this.model, () => {
                    self.message = "Settings saved"
                }, (data) => {
                    if(data.message) {
                        self.message = data.message
                    } else {
                        self.message = "Saving failed"
                    }
                })

            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        async created() {
            let countries = await this.padmiss.getCountries()
            let self = this

            this.schema = {
                fields: [
                    {
                        type: "input",
                        inputType: "text",
                        label: "Nickname",
                        model: "nickname",
                        required: "true",
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "select",
                        label: "Country",
                        model: "country",
                        required: "true",
                        validator: VueFormGenerator.validators.string,
                        values: countries
                    },
                    {
                        type: "input",
                        inputType: "email",
                        label: "Email",
                        model: "email",
                        required: "true",
                        validator: VueFormGenerator.validators.email
                    },
                    {
                        type: "input",
                        inputType: "text",
                        label: "Short nickname (4 chars)",
                        model: "shortNickname",
                        required: "true",
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "input",
                        inputType: "text",
                        label: "Card number",
                        model: "rfidUid",
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "input",
                        inputType: "text",
                        label: "Avatar url",
                        model: "avatarIconUrl",
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "input",
                        inputType: "password",
                        label: "Password",
                        model: "password",
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "input",
                        inputType: "password",
                        label: "Repeat password",
                        model: "d",
                        validator: function(value, field, model) {
                            if(value.length === 0) {
                                return ["This field is required!"]
                            }
                            return value === model.password ? null : ["Passwords should be the same"]
                        }
                    }
                ]
            }

            this.padmiss.getUser((user) => {
                for (const [k, v] of Object.entries(user.getData())) {
                    if(k in self.model && v) {
                        self.model[k] = v
                    }
                }
            })
        },

        data () {
            return {
                valid: false,
                success: false,
                message: "",
                model: {
                    nickname: "",
                    email: "",
                    shortNickname: "",
                    rfidUid: "",
                    password: "",
                    country: "",
                    avatarIconUrl: ""
                },
                schema: {},
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                    validateAsync: true
                }
            }
        },

        components: {
            "vue-form-generator": VueFormGenerator.component
        }
    }
</script>

<style scoped>

</style>