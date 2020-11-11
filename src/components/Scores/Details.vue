<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else id="details">
        <h1>Score details</h1>
        <br/>
        <template v-if="$isLoggedIn && $user.data.playerId === score.player.id">
            <b-button v-if="!isFavorite" variant="info" class="m-1" @click="toggleFavorite(true)">Add to favorites</b-button>
            <b-button v-else variant="info" class="m-1" @click="toggleFavorite(false)">Remove from favorites</b-button>
        </template>
        <br/>&nbsp

        <b-tabs content-class="mt-3">
            <b-tab title="Overview" active>
                <ScoreOverview :score="score"></ScoreOverview>
            </b-tab>
            <b-tab title="Chart and step timings" v-if="score.inputEvents.length > 0 && score.noteScoresWithBeats.length > 0">
                <ChartVisualization
                    :step-data="score.stepChart.stepData"
                    :inputEvents="score.inputEvents"
                    :noteScoresWithBeats="score.noteScoresWithBeats">
                </ChartVisualization>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import VueFormGenerator from "vue-form-generator";
    import Loading from 'vue-loading-overlay';
    import AuthMixin from "../../mixins/AuthMixin";
    import Density from "../Charts/Density.vue";
    import ScoreOverview from "./ScoreOverview.vue";
    import ChartVisualization from "./ChartVisualization.vue";

    export default {
        mixins: [AuthMixin],

        methods: {
            toggleFavorite(flag) {
                let me = this

                if(
                    !this.$isLoggedIn||
                    this.$user.data.playerId !== me.score.player.id
                ) {
                    return
                }

                if(!this.$user.metaData.favoriteScores) {
                    this.$user.metaData.favoriteScores = []
                }

                if(this.$user.metaData.favoriteScores.indexOf(this.score.id) < 0) {
                    if(flag) {
                        this.$user.metaData.favoriteScores.push(this.score.id)
                    }
                }
                else {
                    if(!flag) {
                        this.$user.metaData.favoriteScores =
                            this.$user.metaData.favoriteScores
                            .filter(s => s != me.score.id)
                    }
                }

                this.$user.save(me.$api).then(() => {
                    me.isFavorite = flag
                })
            }
        },

        created() {
            let me = this
            let scoreId = me.$route.params.scoreId

            me.$graph(
                'Score',
                [
                    'id',
                    'scoreValue',
                    'secondsSurvived',
                    'originalScore',
                    'noteSkin',
                    'playedAt',
                    'passed',
                    {inputEvents: [
                        'beat',
                        'column',
                        'released'
                    ]},
                    {noteScoresWithBeats: [
                        'beat',
                        'column',
                        'holdNoteScore',
                        'offset',
                        'tapNoteScore'
                    ]},
                    {scoreBreakdown: [
                        'fantastics',
                        'excellents',
                        'greats',
                        'decents',
                        'wayoffs',
                        'misses',
                    ]},
                    {arcadeCab: [
                        'name'
                    ]},
                    {player: [
                        'id',
                        'nickname',
                        {country: [
                            'name'
                        ]}
                    ]},
                    {stepChart: [
                        'id',
                        'stepArtist',
                        'difficultyLevel',
                        'groups',
                        'stepData',
                        {song: [
                            'title',
                            'artist'
                        ]}
                    ]}
                ],
                {id: scoreId}
            ).then(score => {
                me.score = score

                if(
                    me.$isLoggedIn &&
                    me.$user.metaData.favoriteScores &&
                    me.$user.metaData.favoriteScores.indexOf(me.score.id) > -1
                ) {
                    me.isFavorite = true
                }

                me.loading = false
            })
        },

        data () {
            return {
                loading: true,
                isFavorite: false,
                score: {}
            }
        },

        components: {
            "vue-form-generator": VueFormGenerator.component,
            "loading": Loading,
            Density: Density,
            ScoreOverview: ScoreOverview,
            ChartVisualization: ChartVisualization
        }
    }
</script>
