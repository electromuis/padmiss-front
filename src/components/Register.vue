<template>
    <div id="register">
        <h1>Register</h1>
        <br/>

        <div v-if="success">
            Registration sucessfull, You can now login here:
            <b-button @click="$router.push(`/login`)" variant="primary">Login</b-button>
            <br/>&nbsp;
        </div>
        <div>
            <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
            <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
            <b-button v-if="valid" v-on:click="handleClick" type="submit" variant="primary">Register</b-button>
            <b-button v-else v-on:click="handleClick" disabled>Register</b-button>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import CountriesMixin from '../mixins/CountriesMixin'

    export default {
        name: "Register",

        mixins: [CountriesMixin],

        methods: {
            handleClick(e) {
                let me = this

                this.$api.post(
                    '/register',
                    me.model
                ).then(r => {
                    if(!r.success) {
                        throw r.message
                    }

                    me.success = true
                    me.message = "Registration sucessfull"
                }).catch(e => {
                    me.success = false
                    me.message = e
                })
            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        created() {
            let me = this
            this.$getCountries().then((countries) => {
                me.schema.fields.filter(x => x.model === 'country')[0].values = countries
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
                schema: {
                    fields: [
                        {
                            type: "input",
                            inputType: "text",
                            label: "Nickname",
                            model: "nickname",
                            required: "true",
                            validator: VueFormGenerator.validators.string,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "select",
                            label: "Country",
                            model: "country",
                            // required: "true",
                            validator: VueFormGenerator.validators.string,
                            values: [],

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "email",
                            label: "Email",
                            model: "email",
                            required: "true",
                            validator: VueFormGenerator.validators.email,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Short nickname (4 chars)",
                            model: "shortNickname",
                            required: "true",
                            validator: VueFormGenerator.validators.string,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Card number",
                            model: "rfidUid",
                            validator: VueFormGenerator.validators.string,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Avatar url",
                            model: "avatarIconUrl",
                            validator: VueFormGenerator.validators.string,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "password",
                            label: "Password",
                            model: "password",
                            validator: VueFormGenerator.validators.string,

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "password",
                            label: "Repeat password",
                            model: "d",
                            validator: function(value, field, model) {
                                if(value && value.length === 0) {
                                    return ["This field is required!"]
                                }
                                return value === model.password ? null : ["Passwords should be the same"]
                            },

                            fieldClasses: "col-md-6"
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
            "vue-form-generator": VueFormGenerator.component
        }
    }
</script>

<style scoped>

</style>