<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <h1>Post score</h1>
        <br/>

        <div v-if="success">
            Score saved successfully! <b-button @click="score = defaultScore(); success = false; message = '';">Submit another</b-button>
        </div>
        <div v-else>
            <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
            <form>
                <vue-form-generator :schema="schema" :model="score" :options="formOptions" @validated="handleValidation" />
                <b-button v-if="valid" v-on:click="handleClick" variant="primary" type="submit">Save</b-button>
                <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
            </form>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';

    let validateNum = function(val) {
        let parsed = parseInt(val)
        if(isNaN(parsed)) {
            return 'Not a number'
        }
        if(parsed < 0) {
            return 'Should be bigger than 0'
        }
        return true
    }

    let fields = [
        'fantastics',
        'excellents',
        'greats',
        'decents',
        'wayoffs',
        'misses',
        'holds',
        'holdsTotal',
        'rolls',
        'rollsTotal',
        'minesHit',
        'minesAvoided',
        'minesTotal',
        'jumps',
        'jumpsTotal',
        'hands',
        'handsTotal',
    ]

    export default {
        methods: {
            defaultScore() {
                return {
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
                }
            },

            unCamelCase (str){
                str = str
                // insert a space between lower & upper
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    // space before last upper in a sequence followed by lower
                    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
                    // uppercase the first character
                    .replace(/^./, function(str){ return str.toUpperCase(); })

                str = str.charAt(0).toUpperCase() + str.slice(1)

                return str
            },

            handleClick(e) {
                let me = this
                let data = Object.assign({}, this.score)
                data.scoreValue = data.scoreValue / 100



                fields.forEach(f => {
                    if(typeof data[f] !== 'undefined') {
                        data[f] = parseInt(data[f])
                    }
                })

                me.$api.post('/post-score', data).then(response => {
                    if(!response.success) {
                        throw response.message
                    }
                    else {
                        me.message = 'Submitted successfull'
                        me.success = true
                    }
                }).catch(e => {
                    me.message = e
                    me.success = false
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

                fields.forEach(f => {
                    me.schema.fields.push({
                            type: "input",
                            inputType: "num",
                            label: me.unCamelCase(f),
                            model: f,
                            validator: validateNum,

                            fieldClasses: "col-md-6"
                    })
                })

                return me.$graph(
                    'Players',
                    [{docs: [
                        '_id',
                        'nickname'
                    ]}],
                    {sort: 'nickname', limit: 100000}
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
                            values: [],

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "select",
                            label: "Player",
                            model: "playerId",
                            required: "true",
                            validator: VueFormGenerator.validators.string,
                            values: [],

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "select",
                            label: "Passed",
                            model: "passed",
                            required: "true",
                            values: [true, false],

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "songSelect",
                            label: "Song",
                            model: "chart",

                            fieldClasses: "col-md-6"
                        },
                        {
                            type: "input",
                            inputType: "text",
                            label: "Percentage",
                            model: "scoreValue",
                            placeholder: '50.01',

                            fieldClasses: "col-md-6"
                        },
                        // {
                        //     type: "input",
                        //     inputType: "num",
                        //     label: "Fantastics",
                        //     model: "fantastics",
                        //     validator: validateNum,
                        //
                        //     fieldClasses: "col-md-6"
                        // },
                        // {
                        //     type: "input",
                        //     inputType: "num",
                        //     label: "Excelents",
                        //     model: "excellents",
                        //     validator: validateNum,
                        //
                        //     fieldClasses: "col-md-6"
                        // },
                        // {
                        //     type: "input",
                        //     inputType: "num",
                        //     label: "Wayoffs",
                        //     model: "wayoffs",
                        //     validator: validateNum,
                        //
                        //     fieldClasses: "col-md-6"
                        // },
                        // {
                        //     type: "input",
                        //     inputType: "num",
                        //     label: "Misses",
                        //     model: "misses",
                        //     validator: validateNum,
                        //
                        //     fieldClasses: "col-md-6"
                        // },
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