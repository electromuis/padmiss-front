<template>
    <div id="login">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Login</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Login</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import "vue-form-generator/dist/vfg.css";
    import AuthMixin from "../mixins/AuthMixin"

    export default {
        name: "Login",

        mixins: [AuthMixin],

        mounted() {
            if (this.$isLoggedIn === true) {
                self.$router.push('/')
            }
        },

        methods: {
            handleClick(e) {
                let self = this

                this
                    .$signIn(this.model.email, this.model.password)
                    .then(() => {
                        self.message = "Login successfull"
                        self.$router.push('/')
                    })
                    .catch(data => {
                        if(data.message) {
                            self.message = data.message
                        } else {
                            self.message = "Login failed"
                        }
                    })

                // padmiss.login(this.model.email, this.model.password, () => {
                //     self.message = "Login successfull"
                //     self.$router.push('/')
                // }, (data) => {
                //     if(data.message) {
                //         self.message = data.message
                //     } else {
                //         self.message = "Login failed"
                //     }
                // })


            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        data () {

            return {
                valid: false,
                message: "",
                model: {
                    username: "",
                    password: ""
                },
                schema: {
                    fields: [
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
                            inputType: "password",
                            label: "Password",
                            model: "password",
                            required: true,
                            validator: VueFormGenerator.validators.string
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