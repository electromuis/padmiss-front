<template>
    <div id="settings">
        <h1>Settings</h1>
        <br/>

        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick" variant="primary">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import "vue-form-generator/dist/vfg.css";  // optional full css additions
    import AuthMixin from "../../mixins/AuthMixin"
    import CountriesMixin from '../../mixins/CountriesMixin'

    export default {
        name: "Settings",

        mixins: [AuthMixin, CountriesMixin],

        methods: {
            handleClick(e) {
                let me = this

                this.$user.setData(me.model)
                this.$user.save(me.$api).then(() => {
                    me.message = "Settings saved"
                }).catch((e) => {
                    if(e) {
                        me.message = e
                    } else {
                        me.message = "Saving failed"
                    }
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

            Object.entries(me.$user.data).forEach(([k, v]) => {
                if(v && me.model.hasOwnProperty(k)) {
                    me.model[k] = v
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
                schema: {
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
                            values: []
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