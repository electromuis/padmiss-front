<template>
    <div>
        <div class="form-group">
            Pack: <input v-model="packSearch" placeholder="Search ..." class="form-control"/>

            <select v-model="pack" class="form-control">
                <option v-for="p in packs" :value="p">{{p}}</option>
            </select>
        </div>

        <div v-if="songs != null" class="form-group">
            Song: <input v-model="songSearch" placeholder="Search ..." class="form-control"/>

            <select v-model="song" class="form-control">
                <option v-for="s in songs" :value="s">{{s}}</option>
            </select>
        </div>

        <div v-if="song != null" class="form-group">
            Level:
            <select v-model="level" class="form-control">
                <option v-for="l in levels" :value="l">{{l}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator"

    let me = null

    export default  {
        mixins: [VueFormGenerator.abstractField],

        methods: {
            searchSongs() {
                me.levels = null

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
            // this.$graph.query(
            //     'Stepcharts',
            //     {docs: [
            //         'groups'
            //     ]},
            //     {limit: 1000000000}
            // ).then(response => {
            //     let groups = []
            //     response.docs.forEach(s => {
            //         s.groups.forEach(g => {
            //             groups.push(g)
            //         })
            //     })
            //     me.packs = groups
            //     console.log(groups)
            // })

            me.searchSongs()
        },

        data() {
            return {
                packs: ['All'],
                songs: [],
                levels: [],

                pack: 'All',
                song: null,
                level: null,

                packSearch: null,
                songSearch: null,
            }
        },

        watch: {
            packSearch() {

            },

            songSearch: _.debounce(() => {
                me.searchSongs()
            }, 200),

            song() {
                me.$graph.query(
                    'Stepcharts',
                    {docs: ['difficultyLevel']},
                    {
                        limit: 20,
                        "song.title": me.song
                    },
                    true
                ).then(r => {
                    let levels = []

                    r.docs.forEach(c => {
                        levels.push(c.difficultyLevel)
                    })

                    me.levels = levels
                    if(levels.length == 1) {
                        me.level = levels[0]
                    }
                })
            }
        }
    }
</script>

<style>

</style>