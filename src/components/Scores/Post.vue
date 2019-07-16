<script src="../../main.js"></script>
<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <vue-form-generator :schema="schema" :model="score" :options="formOptions" @validated="handleValidation" />
        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';

    export default {
        methods: {

            handleClick(e) {
                let me = this
                let data = this.score

                let url =
                me.$api.post('/post-score', data).then(response => {
                    console.log(response)
                })
            },
            handleValidation(valid, errors) {
                this.valid = valid
            }
        },

        created() {
            let me = this

            me.$api.get(
                '/api/arcade-cabs/get-my-cabs?token=' + localStorage.token
            ).then(response => {
                let cabs = response.cabs

                me.schema.fields.filter(f => f.model === "apiKey")[0].values = cabs.map((c) => {
                    return {
                        id: c.apiKey,
                        name: c.name
                    }
                })

                return me.$graph.query(
                    'Players',
                    [{docs: [
                        '_id',
                        'nickname'
                    ]}]
                )
            })
            .then(response => {
                me.schema.fields.filter(f => f.model === "playerId")[0].values = response.docs.map((c) => {
                    return {
                        id: c._id,
                        name: c.nickname
                    }
                })

                me.loading = false
            })

        },

        data () {
            return {
                valid: false,
                success: false,
                loading: true,
                message: "",
                score: {
                    apiKey: "",
                    playerId: "",
                    passed: true,
                    song: "",
                    scoreValue: "",
                    fantastics: 0,
                    excelents: 0,
                    greats: 0,
                    decents: 0
                },
                schema: {
                    fields: [
                        {
                            type: "select",
                            label: "Cab",
                            model: "apiKey",
                            required: "true",
                            validator: VueFormGenerator.validators.string,
                            values: []
                        },
                        {
                            type: "select",
                            label: "Player",
                            model: "playerId",
                            required: "true",
                            validator: VueFormGenerator.validators.string,
                            values: []
                        },
                        {
                            type: "select",
                            label: "Passed",
                            model: "passed",
                            required: "true",
                            values: [true, false]
                        },
                        {
                            type: "songSelect",
                            label: "Song"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Percentage",
                            model: "scoreValue"
                        },
                        {
                            type: "input",
                            inputType: "num",
                            label: "Fantastics",
                            model: "fantastics"
                        },
                        {
                            type: "input",
                            inputType: "num",
                            label: "Excelents",
                            model: "excelents"
                        },
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