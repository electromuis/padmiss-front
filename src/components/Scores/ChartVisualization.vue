<template>
    <div ref="chart-data" id="chart-visualization">
        <Loading v-if="loading"></Loading>
        <div v-else>
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
        </div>
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
                noteSpacing: 3, // Multiplier for note spacing

                loading: true
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

        methods: {
            writeHoldAndRollMarkersToNoteData(measures) {
                const measuresInCols = measures.map(measureNoteRows => {
                    return measureNoteRows.map(columnString => [...columnString]) // 0000 -> [0, 0, 0, 0]
                })

                // Measure consists of 4, 8, 12, 16 etc rows of arrow column arrays
                measuresInCols.forEach((measure, measureIndex) => {
                    measure.forEach((columns, rowIndex) => {
                        columns.forEach((col, colIndex) => {
                            if (col === "2" || col === "4" || col === "H" || col === "R") {
                                const foundIndex = measure.findIndex((col, idx) => col[colIndex] === "3" && idx > rowIndex)

                                // If not found, write custom marker for hold or roll (if not the last measure & next measure does not begin with hold/roll end)
                                if (foundIndex === -1 && measureIndex < measuresInCols.length - 1 && measuresInCols[measureIndex+1][0][colIndex] !== "3") {
                                    if (col === "2" || col === "H")
                                        measuresInCols[measureIndex+1][0][colIndex] = "H"
                                    else if (col === "4" || col === "R")
                                        measuresInCols[measureIndex+1][0][colIndex] = "R"
                                }
                            }
                        })
                    })
                })

                return measuresInCols
            }
        },

        created() {
            this.loading = true;

            let writer = new NotesWriter();
            writer.setData(this.$props.stepData);
            writer.read();

            if (writer.charts.length === 0) {
                return
            }

            this.chart = writer.charts[0];
            this.measures = this.writeHoldAndRollMarkersToNoteData(writer.charts[0].notes);
            this.chartSeconds = writer.notesToSeconds(this.chart);

            this.loading = false;
        }
    }
</script>
