<template>
    <div class="col-md-6">
        <div class="row form-group">
            <div class="col-md-3">
                <label for="search-pack">Pack: </label>
            </div>

            <div class="col-md-4">
                <input id="search-pack" v-model="packSearch" placeholder="Search ..." class="form-control"/>
            </div>

            <div class="col-md-5">
                <select v-model="pack" class="form-control">
                    <option v-for="p in packs" :value="p">{{p}}</option>
                </select>
            </div>
        </div>

        <div v-if="songs != null" class="row form-group">
            <div class="col-md-3">
                <label for="search-song">Song: </label>
            </div>

            <div class="col-md-4">
                <input id="search-song" v-model="songSearch" placeholder="Search ..." class="form-control"/>
            </div>

            <div class="col-md-5">
                <select v-model="song" class="form-control">
                    <option v-for="s in songs" :value="s">{{s}}</option>
                </select>
            </div>
        </div>

        <div v-if="song != null" class="row form-group">
            <div class="col-md-3">
                <label for="chart">Level: </label>
            </div>
            <div class="col-md-9">
                <select id="chart" v-model="value" class="form-control">
                    <option v-for="c in charts" :value="c._id">{{c.difficultyLevel}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator"

    let me = null

    export default  {
        mixins: [VueFormGenerator.abstractField],

        methods: {
            searchPacks() {
                me.charts = []
                me.songs = []
                me.packs = ['Loading ...']

                this.$graph.query(
                    'Stepcharts',
                    {docs: [
                            'groups'
                        ]},
                    {limit: 1000000000}
                ).then(response => {
                    let groups = ['All']
                    response.docs.forEach(s => {
                        s.groups.forEach(g => {
                            if(groups.indexOf(g) < 0) {
                                groups.push(g)
                            }
                        })
                    })
                    me.packs = groups

                    me.searchSongs()
                })
            },

            searchSongs() {
                me.charts = null

                let query = {
                    limit: 1000000000,
                    sort: "song.title"
                }

                if(me.songSearch) {
                    query['song.title'] = {
                        "$regex": me.songSearch,
                        "$options": 'i'
                    }
                }

                if(me.pack && me.pack != 'All') {
                    query['groups'] = me.pack
                }
                me.$graph.query(
                    'Stepcharts',
                    {docs: [
                        {song: ['title']}
                    ]},
                    query,
                    true
                ).then(r => {
                    let songs = []

                    r.docs.forEach(c => {
                        if(songs.indexOf(c.song.title) === -1) {
                            songs.push(c.song.title)
                        }
                    })

                    me.songs = songs
                    if(songs.length == 1) {
                        me.song = songs[0]
                    }
                })
            }
        },

        created() {
            me = this

            me.searchPacks()
        },

        data() {
            return {
                packs: ['All'],
                songs: [],
                charts: [],

                pack: 'All',
                song: null,

                packSearch: null,
                songSearch: null,
            }
        },

        watch: {
            packSearch: _.debounce(() => {
                me.searchPacks()
            }, 200),

            pack() {
                me.searchSongs()
            },

            songSearch: _.debounce(() => {
                me.searchSongs()
            }, 200),

            song() {
                me.$graph.query(
                    'Stepcharts',
                    {docs: ['difficultyLevel', '_id']},
                    {
                        limit: 20,
                        "song.title": me.song
                    },
                    true
                ).then(r => {
                    me.charts = r.docs

                    if(me.charts.length === 1) {
                        me.value = me.charts[0]._id
                    }
                })
            }
        }
    }
</script>

<style>

</style>