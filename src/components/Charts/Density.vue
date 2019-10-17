<template>
    <div>
        <GChart
            ref="graph"
            type="AreaChart"
            :data="data"
            :options="options"
        />
        <br/>
        <template v-if="breakdown">
        Streams: {{breakdown}}
        </template>
    </div>
</template>

<script>
    import NotesWriter from "../../modules/NotesWriter";
    import { GChart } from 'vue-google-charts'
    let me = null

    export default  {
        created() {
            me = this
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

            let range = null;
            if(width) {
                // range = Math.max(Math.floor((length / width) * 25), 5)
            }
            range = 4

            let data = writer.density(chart, range)
            let i = 0

            data.forEach(d => {
                let time = me.moment.utc(i*range * 1000).format('mm:ss')

                me.data.push([time, Math.floor(d / range)])
                i++
            })

            me.breakdown = writer.breakdown(chart)
        },

        data() {
            return {
                data: [
                    ['Time', 'NPS']
                ],
                options: {

                },
                breakdown: ''
            }
        },

        props: ['chart', 'width']
    }
</script>

<style>
    .magic-svg {
        width:0;
        height:0;
        position:absolute;
    }
</style>