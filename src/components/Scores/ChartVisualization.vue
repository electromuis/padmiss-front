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
                        :input-events="measureGroupedInputEvents[index]"
                        :previous-measure-note-scores="index > 0 ?
                            getNoteScoresWithBeatsForMeasure(noteScoresWithBeats, index-1, 1, 3) : []"
                        :note-scores-with-beats="getNoteScoresWithBeatsForMeasure(noteScoresWithBeats, index, 4, 0)"
                        :next-measure-note-scores="index  < totalMeasures-1 ?
                            getNoteScoresWithBeatsForMeasure(noteScoresWithBeats, index+1, 1, 0) : []"
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
            stepData: String,
            inputEvents: Array,
            noteScoresWithBeats: Array
        },

        components: {
            "Loading": Loading,
            "MeasureCanvas": MeasureCanvas
        },

        data() {
            return {
                chart: {},
                chartSeconds: {},
                measures: [],
                measureGroupedInputEvents: [],
                width: 600,

                // Note rendering settings
                noteSize: 64, // Note sprite size in pixels
                noteSpacing: 5, // Multiplier for note spacing

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
                return this.measures.length;
            },

            totalBeats() {
                return this.measures.length * 4; // .sm format supports only 4 beats per measure
            },

            // Render height of a single measure in pixels, a measure will be rendered in it's own canvas element
            // Take note of canvas maximum heights in browsers
            measureRenderHeight() {
                return this.beatRenderHeight * 4; // .sm format supports only 4 beats per measure
            },

            // Render height of a single beat in pixels
            beatRenderHeight() {
                return this.noteSize * this.noteSpacing;
            },

            totalRenderHeight() {
                // Add one beat to make room for notes that would be rendered
                return this.totalMeasures * this.measureRenderHeight;
            }
        },

        methods: {
            writeHoldAndRollMarkersToNoteData(measures) {
                const measuresInCols = measures.map(measureNoteRows => {
                    return measureNoteRows.map(columnString => [...columnString]); // 0000 -> [0, 0, 0, 0]
                });

                // Measure consists of 4, 8, 12, 16 etc rows of arrow column arrays
                measuresInCols.forEach((measure, measureIndex) => {
                    measure.forEach((columns, rowIndex) => {
                        columns.forEach((col, colIndex) => {
                            if (col === "2" || col === "4" || col === "H" || col === "R") {
                                const foundIndex = measure.findIndex((col, idx) => col[colIndex] === "3" && idx > rowIndex);

                                // If not found, write custom marker for hold or roll (if not the last measure & next measure does not begin with hold/roll end)
                                if (foundIndex === -1 && measureIndex < measuresInCols.length - 1 && measuresInCols[measureIndex+1][0][colIndex] !== "3") {
                                    if (col === "2" || col === "H")
                                        measuresInCols[measureIndex+1][0][colIndex] = "H";
                                    else if (col === "4" || col === "R")
                                        measuresInCols[measureIndex+1][0][colIndex] = "R";
                                }
                            }
                        })
                    })
                });

                return measuresInCols
            },

            // We need to add pressed events when the input event was not released on the same measure as it was pressed on
            groupInputEventsByMeasure(inputEvents, measureCount) {
                let me = this;

                const groupedByMeasure = Array(measureCount).fill().map((_, index) =>
                    me.getInputEventsForMeasure(inputEvents, index));

                groupedByMeasure.forEach((inputEvents, measureIndex) => {
                    // Return if last measure
                    if (measureIndex === (groupedByMeasure.length - 1))
                        return;

                    // If there are input events in the measure that have NOT matching released input event
                    // add a pressed input event to the beginning of the next measure on the same column
                    const pressed = inputEvents.filter(ie => ie.released === false);
                    const eventsWithoutReleasedPair = pressed.filter(ie => !me.hasMatchingReleasedEvent(ie, inputEvents));

                    eventsWithoutReleasedPair.forEach(e => {
                        // Add a pressed input event to the next measure
                        groupedByMeasure[measureIndex + 1].unshift({
                            beat: (measureIndex + 1) * 4,
                            column: e.column,
                            released: false
                        });
                    });
                });

                return groupedByMeasure;
            },

            hasMatchingReleasedEvent(inputEvent, inputEvents) {
                return inputEvents.find(r =>
                    r.released === true &&
                    r.column === inputEvent.column &&
                    r.beat > inputEvent.beat
                ) !== undefined
            },

            getInputEventsForMeasure(inputEvents, measureIndex) {
                const startBeat = measureIndex * 4;
                const endBeat = startBeat + 4;

                return inputEvents.filter(ie => ie.beat >= startBeat && ie.beat < endBeat);
            },

            getNoteScoresWithBeatsForMeasure(noteScoresWithBeats, measureIndex, beatAmount, startBeatOffset) {
                const startBeat = measureIndex * 4 + startBeatOffset;
                const endBeat = startBeat + beatAmount;

                return noteScoresWithBeats.filter(nsb => nsb.beat >= startBeat && nsb.beat < endBeat);
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
            this.measureGroupedInputEvents = this.groupInputEventsByMeasure(this.$props.inputEvents, this.measures.length);

            this.loading = false;
        }
    }
</script>
