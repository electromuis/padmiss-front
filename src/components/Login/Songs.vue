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
                let me = this
                this.padmiss.updateSettings(this.model, () => {
                    me.message = "Settings saved"
                }, (data) => {
                    if(data.message) {
                        me.message = data.message
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

            for (const [k, v] of Object.entries(me.$user.metaData)) {
                if(k in me.model && v) {
                    me.model[k] = v
                }
            }

        },

        data () {
            return {
                valid: false,
                success: false,
                message: "",
                model: {
                    songs: []
                },
                schema: {
                    fields: [
                        {
                            type: "array",
                            inputType: "text",
                            label: "Songs",
                            model: "songs",
                            newElementButtonLabelClasses: "btn btn-secondary new",
                            removeElementButtonClasses: "btn btn-secondary remove",
                            itemContainerClasses: "array-item",
                            showRemoveButton: true,
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