<template>
    <GChart
        ref="graph"
        type="LineChart"
        :data="data"
        :options="options"
    />
</template>

<script>
    import NotesWriter from "../../modules/NotesWriter";
    import { GChart } from 'vue-google-charts'

    export default  {
        created() {
            let me = this
            let width = null;

            if(this.$props.width) {
                width = this.$props.width;
            }
            else {
                width = window.innerWidth - 40
            }

            let writer = new NotesWriter()
            writer.setData(this.$props.chart)
            writer.read()

            if(writer.charts.length === 0) {
                return
            }

            let chart = writer.charts[0]
            let length = writer.calcLength(chart)

            let range = 1;
            if(width) {
                range = Math.floor(width / length)
            }

            let data = writer.density(chart, range)
            let i = 0

            data.forEach(d => {
                let time = me.moment(Math.round(i*range)).format('MM:SS')

                me.data.push([time, d*range])
                i++
            })

            console.log(me.data)
        },

        data() {
            return {
                data: [
                    ['Time', 'NPS']
                ],
                options: {

                }
            }
        },

        props: ['chart', 'width']
    }
</script>