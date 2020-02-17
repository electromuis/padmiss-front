<template>
    <div ref="chart-data" id="chart-visualization">
        <Loading v-if="loading"></Loading>
        <div v-else>
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
                measures: [],
                measureGroupedInputEvents: [],
                width: 600,

                // Note rendering settings
                noteSize: 64, // Note sprite size in pixels
                noteSpacing: 6, // Multiplier for note spacing

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

            // Render height of a single measure in pixels, a measure will be rendered in it's own canvas element
            // Take note of canvas maximum heights in browsers
            measureRenderHeight() {
                return this.beatRenderHeight * 4; // .sm format supports only 4 beats per measure
            },

            // Render height of a single beat in pixels
            beatRenderHeight() {
                return this.noteSize * this.noteSpacing;
            },
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

            groupBy(collection, key) {
                return collection.reduce((rv, x) => {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, []);
            },

            // We need to add pressed events when the input event was not released on the same measure as it was pressed on
            groupInputEventsByMeasure(inputEvents, measureCount) {
                let me = this;

                const inputEventsWithBeatAsIndex = inputEvents.map(ie => ({ beatIndex: Math.floor(ie.beat), ...ie }));
                const groupedByBeatIndex = this.groupBy(inputEventsWithBeatAsIndex, "beatIndex");

                const groupedByMeasure = Array(measureCount).fill().map((_, index) =>
                    me.getInputEventsForMeasure(groupedByBeatIndex, index));

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
                            eventStartBeat: e.eventStartBeat,
                            eventEndBeat: e.eventEndBeat,
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

            getInputEventsForMeasure(groupedInputEvents, measureIndex) {
                const startBeat = measureIndex * 4;
                const endBeat = startBeat + 4;

                const eventsWithinRange = [];

                // We are interested only in the beat range of this measure
                for (let i = startBeat; i < endBeat; i++) {
                    const group = groupedInputEvents[i];

                    // if there are any events on this beat
                    if (group) {
                        eventsWithinRange.push(...group);
                    }
                }

                return eventsWithinRange.map(ie => {
                    return {
                        eventStartBeat: ie.released ?
                            this.findInputEventStartBeat(ie.beatIndex, groupedInputEvents, ie.column, ie.beat) : ie.beat,
                        eventEndBeat: ie.released ?
                            ie.beat : this.findInputEventEndBeat(ie.beatIndex, groupedInputEvents, ie.column, ie.beat),
                        beat: ie.beat,
                        column: ie.column,
                        released: ie.released
                    }
                })
            },

            findInputEventStartBeat(searchStartBeatIndex, groupedInputEvents, column, beat) {
                const idx = groupedInputEvents.indexOf(groupedInputEvents[searchStartBeatIndex]);
                const relevantRangeReversed = groupedInputEvents.slice(0, idx + 1).reverse();

                // Iterate the grouped input events backwards starting from the input event that we are trying to find matching pair for
                for (let i = 0; i < relevantRangeReversed.length; i++) {
                    // there might not be any events on this index
                    if (Array.isArray(relevantRangeReversed[i])) {
                        const matchingInputEvent = relevantRangeReversed[i].find(e => e.column === column && e.beat < beat);

                        if (matchingInputEvent) {
                            return matchingInputEvent.beat;
                        }
                    }
                }
            },

            findInputEventEndBeat(searchStartBeatIndex, groupedInputEvents, column, beat) {
                const idx = groupedInputEvents.indexOf(groupedInputEvents[searchStartBeatIndex]);
                const relevantRange = groupedInputEvents.slice(idx);

                // Iterate the grouped input events forward starting from the input event that we are trying to find matching pair for
                for (let i = 0; i < relevantRange.length; i++) {
                    // there might not be any events on this index
                    if (Array.isArray(relevantRange[i])) {
                        const matchingInputEvent = relevantRange[i].find(e => e.column === column && e.beat > beat);

                        if (matchingInputEvent) {
                            return matchingInputEvent.beat;
                        }
                    }
                }
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
            this.measureGroupedInputEvents = this.groupInputEventsByMeasure(this.$props.inputEvents, this.measures.length);

            this.loading = false;
        }
    }
</script>
