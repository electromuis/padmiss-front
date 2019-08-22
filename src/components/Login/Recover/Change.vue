<template>
    <div class="recover">
        <h1>Recover account</h1>
        <br/>
        <b-alert v-if="message" show variant="secondary">{{message}}</b-alert>
        <form>
            <div class="form-group">
                Email:
                <input class="form-control" v-model="email" type="email"/>
            </div>

            <b-button v-if="email" v-on:click="handleClick" type="submit" variant="primary">Recover</b-button>
            <b-button v-else type="submit">Recover</b-button>
        </form>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import axios from 'axios'

    let chartApi = 'https://electromuis1.openode.io/'

    export default {
        name: "Songs",

        methods: {
            handleClick(e) {
                let me = this
                let email = encodeURIComponent(me.email)
                me.message = 'Loading ...'

                let frontUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/#';

                me.$api.post(
                    '/forgot-password/user/' + email,
                    {
                        'frontUrl': frontUrl
                    }
                ).then(response => {
                    me.message = response.message
                }).catch(e => {
                    me.message = 'Unknown error'
                })
            }
        },

        created() {
            console.log(me.$route.params.scoreId)
            // this.$graph(
            //     'Player',
            //     ['']
            // )

        },

        data () {
            return {
                loading: true,
                user: {}
            }
        }
    }
</script>

<style scoped>
    .drop {
        background: white;
        border: 1px grey solid;
        border-radius: 8px;

        height: 150px;
        line-height: 150px;
        vertical-align: middle;
        text-align: center;

        margin-bottom: 20px;
    }

    .drop.hover {
        background: blue;
    }

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