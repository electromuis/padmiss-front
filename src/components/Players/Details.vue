<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="details">
        <h1>Player details</h1>
        <br/>

        <table class="table table-striped">
            <tbody>
                <tr v-if="player.avatarIconUrl">
                    <td colspan="2" style="text-align: center;">
                        <img :src="player.avatarIconUrl" style="max-width: 70vw;" />
                    </td>
                </tr>
                <tr>
                    <td>Player padmiss GUID</td>
                    <td>{{player._id}}</td>
                </tr>
                <tr>
                    <td>Nickname</td>
                    <td>{{player.nickname}}</td>
                </tr>
                <tr>
                    <td>Short nickname</td>
                    <td>{{player.shortNickname}}</td>
                </tr>
                <tr>
                    <td>Country</td>
                    <td v-if="player.country">{{player.country.name}} <img style="display: inline-block; max-width: 30px; margin-left: 12px;" :src="'https://lipis.github.io/flag-icon-css/flags/4x3/' + player.country.code.toLowerCase() + '.svg'" /></td>
                    <td v-else>Unknown</td>
                </tr>
                <tr>
                    <td>Level</td>
                    <td>{{player.playerLevel}}</td>
                </tr>
                <tr>
                    <td>Songs played</td>
                    <td>{{player.scores}}</td>
                </tr>
            </tbody>
        </table>

        <template v-if="favoriteScores.length > 0">
            <br/>
            <Scores :filter="{_id: favoriteScores}" title="Favorites" /><br/>
        </template>

        <Scores :filter="{player: player._id}" title="Player scores"/>


    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import Scores from "./Scores.vue";

    export default {
        methods: {

        },

        created() {
            let me = this
            let playerId = me.$route.params.playerId
            console.log(playerId)

            me.$multiGraph({
                player: [
                    'Player',
                    [
                        '_id',
                        'nickname',
                        'shortNickname',
                        'playerLevel',
                        'avatarIconUrl',
                        'metaData',
                        {'country': [
                            'code',
                            'name'
                        ]}
                    ],
                    {id: playerId}
                ],
                scores: [
                    'Scores',
                    ['totalDocs'],
                    {player: playerId},
                    true
                ]
            }).then(result => {
                me.player = result.player
                me.player.scores = result.scores.totalDocs
                try {
                    let meta = JSON.parse(me.player.metaData)
                    if(Array.isArray(meta.favoriteScores)) {
                        me.favoriteScores = meta.favoriteScores
                    }
                } catch (e) {
                    throw e
                }
            }).then(r => {
                me.loading = false
            })
        },

        data () {
            return {
                loading: true,
                favoriteScores: [],
                player: {}
            }
        },

        components: {
            "vue-form-generator": VueFormGenerator.component,
            "loading": Loading,
            Scores: Scores
        }
    }
</script>

<style>
    .header {
        text-align: center;
        font-weight: bold;
    }
</style>