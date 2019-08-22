<template>
    <div id="login">
        <h1>Change password</h1>
        <br/>

        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <div v-if="success">
            <b-button @click="$router.push('/login')" variant="primary">Click here to login</b-button>
        </div>
        <div v-else>
            <form class="form-horizontal" onsubmit="return false">
                <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
                <b-button v-if="valid" v-on:click="handleClick" type="submit" variant="primary">Change password</b-button>
                <b-button v-else @click="handleClick" disabled>Change password</b-button>
            </form>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import "vue-form-generator/dist/vfg.css";
    import AuthMixin from "../../../mixins/AuthMixin"

    export default {
        name: "Login",

        mixins: [AuthMixin],

        mounted() {
            if (this.$isLoggedIn === true) {
                me.$router.push('/')
            }
        },

        methods: {
            handleClick(e) {
                let me = this

                me.$api.post(
                    '/forgot-password/receive-new-password/' + me.$route.params.userId + '/' + me.$route.params.token,
                    {password: me.model.password}
                ).then(response => {
                    me.message = response.message

                    if(response.success === true) {
                        me.success = true
                    }
                }).catch(e => {
                    me.message = 'Unknown error'
                })

            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        data () {

            return {
                valid: false,
                message: "",
                success: false,
                model: {
                    password: ""
                },
                schema: {
                    fields: [
                        {
                            type: "input",
                            inputType: "password",
                            label: "New password",
                            model: "password",
                            validator: VueFormGenerator.validators.string
                        },
                        {
                            type: "input",
                            inputType: "password",
                            label: "Repeat password",
                            model: "d",
                            validator: function(value, field, model) {
                                if(model.password.length === 0) {
                                    return null
                                }
                                return value === model.password ? null : ["Passwords should be the same"]
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
            "vue-form-generator": VueFormGenerator.component
        }
    }
</script>

<style scoped>

</style>