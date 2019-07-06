<template>
    <div class="songs">
        <div v-for="warning in warnings" class="alert-warning">
            {{warning}}
        </div>

        <form v-bind:class="[hovering ? 'drop hover' : 'drop']" ref="drop">

            Drop here to add

        </form>

        <table class="table table-striped">
            <tr v-for="song in songs">
                <td>
                    {{song}}
                </td>
                <td>
                    <b-button v-on:click="() => {delChart(song)}">Remove</b-button>
                </td>
            </tr>
        </table>
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

            },
            handleValidation(valid, errors) {
                this.valid = valid
            },
            delChart(c) {
                let me = this
                let filename = c.replace(/^.*[\\\/]/, '')

                axios.post(chartApi + 'delete-chart', {token: localStorage.token, name: filename}).then(r => {
                    me.songs = me.songs.filter(s => s !== c)

                    me.$user.metaData.songs = me.songs
                    me.$user.save(me.$api).then(r => {
                        me.message = "Settings saved"
                    }).catch(e => {
                        me.message = "Saving failed"
                    })
                })
            },
            handleUpload(f) {
                let me = this
                console.log(f)
                let reader = new FileReader();

                let name = f.name
                let ext = name.split('.').pop()
                if(ext !== 'zip') {
                    this.warnings.push(f.name + ' is not a valid stepfile')
                }

                reader.onload = function () {
                    let data = reader.result;
                    let checks = ['data:application/zip;base64,', 'data:application/x-zip-compressed;base64,'];

                    let check = false
                    checks.forEach(c => {
                        if(check === false && data.substr(0, c.length) === c) {
                            check = c
                        }
                    })

                    if(f === false) {
                        me.warnings.push('Err reading: ' + f.name)
                        return
                    }

                    data = data.substr(check.length)

                    axios.post(chartApi + 'add-chart', {token: localStorage.token, name: name, file: data}).then(r => {
                        axios.get(chartApi + 'get-charts?token=' + localStorage.token).then(r => {
                            if(r.data.files && Array.isArray(r.data.files)) {
                                me.songs = r.data.files.map(s => s.url)

                                me.$user.metaData.songs = me.songs
                                me.$user.save(me.$api).then(r => {
                                    me.message = "Settings saved"
                                }).catch(e => {
                                    me.message = "Saving failed"
                                })
                            }
                        })

                    })
                };

                reader.readAsDataURL(f);
            }
        },

        created() {
            let me = this


            // if(typeof this.$user.metaData.songs !== 'undefined') {
            //     this.songs = this.$user.metaData.songs
            // }

            axios.get(chartApi + 'get-charts?token=' + localStorage.token).then(r => {
                if(r.data.files && Array.isArray(r.data.files)) {
                    me.songs = r.data.files.map(s => s.url)
                }
            })
        },

        mounted() {
            let me = this

            let e = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
            e.forEach( function( evt ) {
                this.$refs.drop.addEventListener(evt, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
            }.bind(this));

            me.$refs.drop.addEventListener('drop', e => {
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    me.handleUpload(e.dataTransfer.files[i])
                }
                me.hovering = false
            })

            me.$refs.drop.addEventListener('dragenter', e => {
                me.hovering = true
            })

            me.$refs.drop.addEventListener('dragleave', e => {
                me.hovering = false
            })
        },

        data () {
            return {
                valid: false,
                success: false,
                message: "",
                hovering: false,
                songs: [],
                warnings: []
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