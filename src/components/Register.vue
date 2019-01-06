<template>
    <div id="register">
        <div v-if="success">
            Registration sucessfull<br/>
            Login here {place button}
        </div>
        <div v-else>
            <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
            <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
            <b-button v-if="valid" v-on:click="handleClick">Register</b-button>
            <b-button v-else v-on:click="handleClick" disabled>Register</b-button>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import "vue-form-generator/dist/vfg.css";  // optional full css additions

    export default {
        name: "Register",

        methods: {
            handleClick(e) {
                let self = this

                this.padmiss.register(this.model, function(response) {
                    if(response.data.success === true) {
                        self.message = "Registration sucessfull"
                        this.success = true
                    } else {
                        self.message = response.data.message
                    }
                }, function () {
                    self.message = "Registration failed"
                })
            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        async created() {
            let countries = await this.padmiss.getCountries()

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
                        inputType: "password",
                        label: "Password",
                        model: "password",
                        required: true,
                        validator: VueFormGenerator.validators.string
                    },
                    {
                        type: "input",
                        inputType: "password",
                        label: "Repeat password",
                        model: "d",
                        required: true,
                        validator: function(value, field, model) {
                            if(value.length === 0) {
                                return ["This field is required!"]
                            }
                            return value === model.password ? null : ["Passwords should be the same"]
                        }
                    }
                ]
            }
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
                    country: ""
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