<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else class="tournament-details">
        <table class="table table-striped">
			<thead>
				<tr>
					<td>
						Player
					</td>
					<td>
						Level
					</td>
					<td>
						Bpm
					</td>
					<td>
						Song
					</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="v, k in data">
					<td>{{k}}</td>
					<td>{{v.score.stepChart.difficultyLevel}}</td>
					<td>{{v.bpm}}</td>
					<td>{{v.score.stepChart.song.title}}</td>
				</tr>
			</tbody>
        </table>
    </div>
</template>

<script>
    import Loading from 'vue-loading-overlay';
    import TournamentMixin from '../../mixins/TournamentMixin'

    export default {
        mixins: [TournamentMixin],

        created() {
            let me = this

            this.$loadTournament().then(() => {
                me.loading = false
                let details = []
                const bpmFind = /#BPMS:([\d\.\=\,]+)/;

                Promise.all(me.tournament.players.map(p => me.$graph(
                    'Scores',
                    [{docs: [
                        'scoreValue',
						{'player': ['_id', 'nickname']},
                        {'stepChart': [
                            'difficultyLevel',
                            'stepData',
                            {song: ['title']}
                        ]}
                    ]}],
                    {sort: "-playedAt", player: p, passed: true},
                    true
                ))).then(p => {
					let players = {}
				
                    p.forEach(playerScores => {
                        let highest = {}
						let player = null

                        playerScores.docs.forEach(s => {
                            let level = parseInt(s.stepChart.difficultyLevel)
							player = s.player.nickname

                            let bpm = s.stepChart.stepData.match(bpmFind)
                            let foundBpm = 0
                            if(bpm) {
                                bpm = bpm[1]
                                let pts = bpm.split(',')
                                pts.forEach(p2 => {
                                    let pts2 = p2.split('=')
                                    if(pts2.length === 2) {
                                        foundBpm = Math.max(foundBpm, parseFloat(pts2[1]))
                                    }
                                })
                            }

                            if(foundBpm > 0) {
                                if(typeof highest[level] === 'undefined' || foundBpm > highest[level].bpm) {
                                    highest[level] = {
                                        bpm: foundBpm,
                                        score: s
                                    }
                                }
                            }

                        })

						if(player !== null) {
							let best = Math.max(...Object.keys(highest))
							console.log(Object.keys(highest), best)
							if(best > 0) {
								players[player] = highest[best]
							}
						}
						
                    })

                    me.data = players
					me.loading = false
                })
            })
        },

        data() {
            return {
                loading: true,
                data: []
            }
        }
    }
</script>

<style scoped>

</style>