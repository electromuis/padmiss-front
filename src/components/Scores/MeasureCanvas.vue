<template>
    <canvas :style="canvasStyles" ref="measure-canvas"></canvas>
</template>

<script>
    export default {
        name: "MeasureCanvas",

        props: {
            measure: Number,
            previousMeasureNotes: Array,
            currentMeasureNotes: Array,
            measureRenderHeight: Number, // Render height of a single measure in pixels
            beatRenderHeight: Number, // Render height of a single beat in pixels
            noteSize: Number, // Note sprite size in pixels
            noteSpacing: Number // Multiplier for note spacing
        },

        data() {
            return {
                renderingContext: null, // CanvasRenderingContext
                canvasWidth: null,

                // Measure line rendering settings
                measureTextFontSize: 14,
                measureTextXPos: 0,
                measureTextYPos: 14,
                thinMeasureLine: 1, // Draw second and fourth beat with thin lines
                mediumMeasureLine: 2, // Draw third beat with medium line
                thickMeasureLine: 3, // Draw first beat with thick line

                // Note rendering settings
                directions: [90, 0, 180, 270, 90, 0, 180, 270], // Left, down, up, right and same for double
                noteRowOffset: 80, // How many pixels to add to the left side of drawn note row
                noteColumnSpacing: 10, // How many pixels to have between columns

                // Note image sprite source URL's
                noteSpriteUrlsByBeatValue: {
                    "4th": "/assets/notes/note_red.png",
                    "8th": "/assets/notes/note_blue.png",
                    "12nd": "/assets/notes/note_purple.png",
                    "16th": "/assets/notes/note_green.png",
                    "24th": "/assets/notes/note_purple.png",
                    "32nd": "/assets/notes/note_orange.png",
                    "48th": "/assets/notes/note_purple.png",
                    "64th": "/assets/notes/note_teal.png",
                    "92nd": "/assets/notes/note_purple.png",
                    "128th": "/assets/notes/note_teal.png",
                    "192nd": "/assets/notes/note_purple.png",
                },

                // Other image sprite source URL's
                holdBodyUrl: "/assets/notes/hold_body.png",
                holdEndUrl: "/assets/notes/hold_end.png",
                rollBodyUrl: "/assets/notes/roll_body.png",
                rollEndUrl: "/assets/notes/roll_end.png",
                mineUrl: "/assets/notes/mine.png"
            }
        },

        computed: {
            canvasStyles() {
                return {
                    width: "100%",
                    height: `${this.measureRenderHeight}px`
                };
            },

            measureLineYOffset() {
                return Math.floor(this.noteSize / 2)
            }
        },

        methods: {
            renderCanvas() {
                this.renderingContext.font = `${this.measureTextFontSize}px serif`
                this.renderingContext.fillText(`Measure ${this.measure + 1}`, this.measureTextXPos, this.measureTextYPos)

                this.drawMeasureLines()

                // draw previous measure notes if this is not the first measure
                if (this.measure > 0) {
                    const beatNoteAmount = this.previousMeasureNotes.length / 4 // .sm supports only 4 beats per measure
                    const lastBeatNotes = this.previousMeasureNotes.slice(3 * beatNoteAmount)

                    // Draw previous measure last beat notes
                    this.drawNotes(lastBeatNotes, this.previousMeasureNotes.length, this.beatRenderHeight)
                }

                // Draw current measure notes
                this.drawNotes(this.currentMeasureNotes, this.currentMeasureNotes.length, 0)
            },

            drawMeasureLines() {
                // .sm supports only measures with 4 beats
                for (let i = 0; i < 4; i++) {
                    const measureLineYPos = i * this.beatRenderHeight + this.measureLineYOffset

                    const measureLineThickness = i === 0 ? this.thickMeasureLine :
                        i === 2 ? this.mediumMeasureLine : this.thinMeasureLine

                    this.drawMeasureLine(0, measureLineYPos, this.canvasWidth, measureLineThickness)
                }
            },

            drawMeasureLine(x, y, length, lineThickness) {
                this.renderingContext.beginPath();
                this.renderingContext.moveTo(x, y);
                this.renderingContext.lineTo(x + length, y);
                this.renderingContext.lineWidth = lineThickness;
                this.renderingContext.stroke();
            },

            drawNotes(measureNotes, totalMeasureNotes, previousMeasureYOffset) {
                measureNotes.forEach((note, index) => {
                    const columns = [...note]

                    if (this.rowHasNoteValue(columns)) {
                        const beat = index * (4 / totalMeasureNotes)

                        columns.forEach((col, columnIndex) => {
                            switch (col) {
                                case "1":
                                    this.drawNote(columnIndex, beat, "normal", previousMeasureYOffset)
                                    break
                                case "2":
                                    break
                                case "3":
                                    break
                                case "4":
                                    break
                                case "M":
                                    this.drawNote(columnIndex, beat, "mine", previousMeasureYOffset)
                                    break
                                default:
                                    break
                            }
                        })
                    }
                })
            },

            rowHasNoteValue(columns) {
                // .sm note values
                // 0 – No note
                // 1 – Normal note
                // 2 – Hold head
                // 3 – Hold/Roll tail
                // 4 – Roll head
                // M – Mine

                return columns.includes("1") || columns.includes("M")
            },

            drawNote(column, beat, noteType, previousMeasureYOffset) {
                let me = this
                // Add column spacing if not column zero
                const noteXPos = this.noteRowOffset + (column * (this.noteSize + this.noteColumnSpacing))
                const noteYPos = (beat * this.beatRenderHeight) - previousMeasureYOffset

                const img = new Image()

                img.onload = function() {
                    const rotationAngle = me.directions[column]

                    // Rotate canvas if needed
                    if (rotationAngle > 0) {
                        const spriteCenterPointX = noteXPos + Math.floor(me.noteSize / 2)
                        const spriteCenterPointY = noteYPos + Math.floor(me.noteSize / 2)

                        // Rotate canvas around sprite center
                        me.renderingContext.translate(spriteCenterPointX, spriteCenterPointY);
                        me.renderingContext.rotate(me.directions[column] * Math.PI / 180);
                        me.renderingContext.translate(-spriteCenterPointX, -spriteCenterPointY);
                    }

                    me.renderingContext.drawImage(img, noteXPos, noteYPos)

                    // Reset canvas matrix if needed
                    if (rotationAngle > 0) {
                        me.renderingContext.setTransform(1, 0, 0, 1, 0, 0)
                    }
                }

                img.src = this.getNoteSpriteUrl(beat, noteType)
            },

            getNoteSpriteUrl(beat, noteType) {
                let spriteUrl = "";

                if (noteType === "normal") {
                    spriteUrl = this.getNoteColorUrl(beat, 4)
                }
                else if (noteType === "mine") {
                    spriteUrl = "/assets/notes/mine.png"
                }
                // Should not happen TODO: add error sprite
                else {
                    spriteUrl = "/assets/notes/note_red.png"
                }

                return spriteUrl
            },

            getNoteColorUrl(beat, size) {
                const divs = 3 * 192;
                const val = beat * divs / size;

                if (val % (divs / 4) === 0) {
                    return this.noteSpriteUrlsByBeatValue["4th"];
                }
                else if (val % (divs / 8) === 0) {
                    return this.noteSpriteUrlsByBeatValue["8th"];
                }
                else if (val % (divs / 12) === 0) {
                    return this.noteSpriteUrlsByBeatValue["12nd"];
                }
                else if (val % (divs / 16) === 0) {
                    return this.noteSpriteUrlsByBeatValue["16th"];
                }
                else if (val % (divs / 24) === 0) {
                    return this.noteSpriteUrlsByBeatValue["24th"];
                }
                else if (val % (divs / 32) === 0) {
                    return this.noteSpriteUrlsByBeatValue["32nd"];
                }
                else if (val % (divs / 48) === 0) {
                    return this.noteSpriteUrlsByBeatValue["48th"];
                }
                else if (val % (divs / 64) === 0) {
                    return this.noteSpriteUrlsByBeatValue["64th"];
                }
                else if (val % (divs / 92) === 0) {
                    return this.noteSpriteUrlsByBeatValue["92nd"];
                }
                else if (val % (divs / 128) === 0) {
                    return this.noteSpriteUrlsByBeatValue["128th"];
                }
                else {
                    return this.noteSpriteUrlsByBeatValue["192nd"];
                }
            }
        },

        mounted () {
            // We can't access the rendering context until the canvas is mounted to the DOM.
            this.renderingContext = this.$refs["measure-canvas"].getContext("2d")

            // Resize the canvas to fit its parent's width.
            this.canvasWidth = this.$refs["measure-canvas"].parentElement.clientWidth

            this.$refs["measure-canvas"].width = this.canvasWidth
            this.$refs["measure-canvas"].height = this.measureRenderHeight

            this.renderCanvas()
        }
    }
</script>
