<template>
    <div ref="chart-data" id="chart-visualization">
        <p>Total measures: {{totalMeasures}}</p>
        <p>Total beats: {{totalBeats}}</p>
        <p>Total render height: {{totalRenderHeight}}px</p>
        <div :style="canvasContainerStyle" v-for="(measure, index) in measures">
            <MeasureCanvas
                    :measure="index"
                    :previous-measure-notes="index > 0 ? measures[index-1] : []"
                    :current-measure-notes="measure"
                    :canvas-width="width"
                    :measure-render-height="measureRenderHeight"
                    :beat-render-height="beatRenderHeight"
                    :note-size="noteSize"
                    :note-spacing="noteSpacing"
            >
            </MeasureCanvas>
        </div>
        <p>{{JSON.stringify(measures, null, 2)}}</p>
    </div>
</template>

<script>
    import MeasureCanvas from "./MeasureCanvas.vue";
    import NotesWriter from "../../modules/NotesWriter";
    import Loading from 'vue-loading-overlay';

    export default {
        name: "ChartVisualization",

        props: {
            stepData: String
        },

        components: {
            "Loading": Loading,
            "MeasureCanvas": MeasureCanvas
        },

        data() {
            return {
                chart: {},
                chartSeconds: {},
                measures: {},
                width: 600,

                // Note rendering settings
                noteSize: 64, // Note sprite size in pixels
                noteSpacing: 3 // Multiplier for note spacing
            }
        },

        computed: {
            canvasContainerStyle() {
                return {
                    width: `${this.width}px`,
                    height: `${this.measureRenderHeight}px`
                };
            },

            totalMeasures() {
                return this.measures.length
            },

            totalBeats() {
                return this.measures.length * 4 // .sm format supports only 4 beats per measure
            },

            // Render height of a single measure in pixels, a measure will be rendered in it's own canvas element
            // Take note of canvas maximum heights in browsers
            measureRenderHeight() {
                return this.beatRenderHeight * 4 // .sm format supports only 4 beats per measure
            },

            // Render height of a single beat in pixels
            beatRenderHeight() {
                return this.noteSize * this.noteSpacing
            },

            totalRenderHeight() {
                // Add one beat to make room for notes that would be rendered
                return this.totalMeasures * this.measureRenderHeight
            }
        },

        created() {
            let writer = new NotesWriter();
            writer.setData(this.$props.stepData);
            writer.read();

            if (writer.charts.length === 0) {
                return
            }

            this.chart = writer.charts[0];
            this.measures = writer.charts[0].notes;
            this.chartSeconds = writer.notesToSeconds(this.chart);
        }
    }
</script>
