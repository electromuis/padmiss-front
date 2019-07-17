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
                let data = Object.assign({}, this.score)
                data.scoreValue = data.scoreValue / 100

                me.$api.post('/post-score', data).then(response => {
                    if(!response.success) {
                        throw response.message
                    }
                    else {
                        message = 'Submitted successfull'
                    }
                }).catch(e => {
                    message = e
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

                if(cabs.length === 1) {
                    me.score.apiKey = cabs[0].apiKey
                }

                return me.$graph.query(
                    'Players',
                    [{docs: [
                        '_id',
                        'nickname'
                    ]}],
                    {sort: 'nickname'}
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
                    chart: "",
                    apiKey: "",
                    playerId: "",
                    passed: true,
                    cabSide: 'Left',
                    scoreValue: "",
                    fantastics: 0,
                    excellents: 0,
                    greats: 0,
                    decents: 0,
                    wayoffs: 0,
                    misses: 0,

                    holds: 0,
                    holdsTotal: 0,
                    rolls: 0,
                    rollsTotal: 0,
                    minesHit: 0,
                    minesAvoided: 0,
                    minesTotal: 0,
                    jumps: 0,
                    jumpsTotal: 0,
                    hands: 0,
                    handsTotal: 0,

                    musicRate: 1,
                    timingWindows: {
                        "rollTimingWindow" : 0.3515,
                        "holdTimingWindow" : 0.3215,
                        "mineTimingWindow" : 0.0715,
                        "wayoffTimingWindow" : 0.1365,
                        "decentTimingWindow" : 0.1365,
                        "greatTimingWindow" : 0.1035,
                        "excellentTimingWindow" : 0.0445,
                        "fantasticTimingWindow" : 0.023
                    }
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
                            label: "Song",
                            model: "chart"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Percentage",
                            model: "scoreValue",
                            placeholder: '50.01'
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
                            model: "excellents"
                        },
                        {
                            type: "input",
                            inputType: "num",
                            label: "Wayoffs",
                            model: "wayoffs"
                        },
                        {
                            type: "input",
                            inputType: "num",
                            label: "Misses",
                            model: "misses"
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