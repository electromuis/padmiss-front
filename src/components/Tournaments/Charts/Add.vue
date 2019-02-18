<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="edit">
        <input type="file" :name="`chart`" @change="handleChart"/>

        <b-button v-if="valid" v-on:click="handleClick">Save</b-button>
        <b-button v-else v-on:click="handleClick" disabled>Save</b-button>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import TournamentsMixin from '../../../mixins/TournamentMixin'
    import NotesWriter from '../../../modules/NotesWriter'

    export default {
        mixins: [TournamentsMixin],

        methods: {
            handleClick(e) {
                let me = this
                if(me.loading === false) {

                }
            },

            handleChart(event) {
                let files = event.target.files
                for(let i = 0; i < files.length; i ++) {
                    let f = files.item(i)
                    var reader = new FileReader();

                    reader.addEventListener('loadend', (e) => {
                        const text = e.srcElement.result;

                        NotesWriter.setData(text)
                        NotesWriter.read()
                        let sm = NotesWriter.write()
                        //console.log("." + sm + ".")
                        console.log(NotesWriter)

                        NotesWriter.charts.forEach(c => {
                            let l = NotesWriter.calcLength(c)
                            console.log("Length: " + Math.floor(l/60)+":"+(l % 60))
                        })

                        if(sm !== text) {
                            console.log("nop")
                        }
                    });

                    reader.readAsText(f);
                }

            }
        },

        created() {
            let me = this
            this.$loadTournament().then((r) => {
                me.loading = false
            })
        },

        data () {
            return {
                valid: false,
                success: false,
                loading: true,
                message: "",
                tournament: {},

            }
        },

        components: {
            "vue-form-generator": VueFormGenerator.component,
            "loading": Loading
        }
    }
</script>

<style scoped>

</style>