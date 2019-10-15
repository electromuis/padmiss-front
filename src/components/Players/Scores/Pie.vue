<template>
    <div class="row">
        <div class="col-md-6">
            <GChart
                    type="PieChart"
                    :data="data"
                    :options="options"
                    style="height: 300px;"
            />
        </div>
        <div class="col-md-6">
            <GChart
                    type="LineChart"
                    :data="datesData"
                    :options="datesOptions"
                    style="height: 300px;"
            />
        </div>
    </div>

</template>

<script>
    import { GChart } from 'vue-google-charts'

    export default {
        created() {
            let me = this
            let counts = {}
            let dates = {}

            for(let i=12; i>-1; i--) {
                let date = me.moment().subtract(i, 'months').format('MM-Y')
                dates[date] = 0
            }

            console.log(dates)

            this.$props.scores.forEach(s => {
                if(!counts[s.stepChart.difficultyLevel]) {
                    counts[s.stepChart.difficultyLevel] = 1
                }
                else {
                    counts[s.stepChart.difficultyLevel] ++
                }

                let date = me.moment(s.playedAt).format('MM-Y')
                if(typeof dates[date] !== 'undefined') {
                    dates[date] = dates[date] + 1
                }
            })

            // console.log(this.$props.scores)
            console.log(dates)

            Object.keys(counts).forEach(c => {
                me.data.push([c, counts[c]])
            })

            Object.keys(dates).forEach(c => {
                me.datesData.push([c, dates[c]])
            })
        },

        data() {
            return {
                data: [
                    ['Diff', 'Plays']
                ],
                options: {
                    title: 'Diffs played',
                    is3D: true
                },

                datesData: [
                    ['Month', 'Plays']
                ],
                datesOptions: {
                    title: 'Amount played',
                    curveType: 'function'
                }
            }
        },

        props: ['scores'],

        components: {
            GChart
        }
    }
</script>