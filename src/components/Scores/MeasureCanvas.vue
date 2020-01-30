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
            canvasWidth: Number, // Width of the canvas
            measureRenderHeight: Number, // Render height of a single measure in pixels
            beatRenderHeight: Number, // Render height of a single beat in pixels
            noteSize: Number, // Note sprite size in pixels
            noteSpacing: Number, // Multiplier for note spacing
            inputEvents: Array, // input events for this measure
            noteScoresWithBeats: Array // note scores for this measure
        },

        data() {
            return {
                renderingContext: null, // CanvasRenderingContext
                sprites: [],

                // Text rendering settings
                textFillStyle: 'black',

                // Measure line rendering settings
                measureTextFontSize: 14,
                measureTextXPos: 0,
                measureTextYPos: 14,
                thinMeasureLine: 1, // Draw second and fourth beat with thin lines
                mediumMeasureLine: 2, // Draw third beat with medium line
                thickMeasureLine: 3, // Draw first beat with thick line
                measureLineStyle: 'black',

                // Note rendering settings
                holdBodyHeight: 128,
                directions: [90, 0, 180, 270, 90, 0, 180, 270], // Left, down, up, right and same for double
                noteRowOffset: 80, // How many pixels to add to the left side of drawn note row
                noteColumnSpacing: 10, // How many pixels to have between columns

                // Judgement rendering settings
                judgementSpriteWidth: 110,
                judgementSpriteHeight: 36,
                judgementLineStrokeStyles: {
                    "W1": 'rgb(4,142,255)',
                    "W2": 'rgb(192,189,21)',
                    "W3": 'rgb(21,255,7)',
                    "W4": 'rgb(110,39,255)',
                    "W5": 'rgb(255,166,21)',
                    "Miss": 'rgb(255,30,32)',
                    "Held": 'rgb(32,32,32)',
                    "AvoidMine": 'rgb(97,97,97)',
                },

                // Input event rendering settings
                inputEventFillStyle: 'rgba(132,26,255,0.5)',

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
                mineUrl: "/assets/notes/mine.png",
                errorSpriteUrl: "/assets/notes/error.png",
                judgementsSpriteUrl: "/assets/judgements/GrooveNights.png"
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
                return Math.floor(this.noteSize / 2);
            },

            judgementSpriteLocations() {
                return {
                    "earlyFantastic": {sx: 0, sy: 0},
                    "lateFantastic": {sx: this.judgementSpriteWidth, sy: 0},
                    "earlyExcellent": {sx: 0, sy: this.judgementSpriteHeight},
                    "lateExcellent": {sx: this.judgementSpriteWidth, sy: this.judgementSpriteHeight},
                    "earlyGreat": {sx: 0, sy: 2 * this.judgementSpriteHeight},
                    "lateGreat": {sx: this.judgementSpriteWidth, sy: 2 * this.judgementSpriteHeight},
                    "earlyDecent": {sx: 0, sy: 3 * this.judgementSpriteHeight},
                    "lateDecent": {sx: this.judgementSpriteWidth, sy: 3 * this.judgementSpriteHeight},
                    "earlyWayOff": {sx: 0, sy: 4 * this.judgementSpriteHeight},
                    "lateWayOff": {sx: this.judgementSpriteWidth, sy: 4 * this.judgementSpriteHeight},
                    "earlyMiss": {sx: 0, sy: 5 * this.judgementSpriteHeight},
                    "lateMiss": {sx: this.judgementSpriteWidth, sy: 5 * this.judgementSpriteHeight}
                }
            }
        },

        methods: {
            renderCanvas() {
                // 1. draw measure texts
                this.writeText(`Measure ${this.measure + 1}`, this.measureTextXPos, this.measureTextYPos, this.textFillStyle);

                // 2. draw measure lines
                this.drawMeasureLines();

                // 3. draw current measure hold and roll bodies
                this.drawHoldAndRollBodies(this.currentMeasureNotes, this.currentMeasureNotes.length);

                if (this.measure > 0) {
                    const beatNoteAmount = this.previousMeasureNotes.length / 4 // .sm supports only 4 beats per measure
                    const lastBeatNotes = this.previousMeasureNotes.slice(3 * beatNoteAmount);

                    // 4. draw previous measure hold & roll ends
                    this.drawHoldAndRollEnds(lastBeatNotes, this.previousMeasureNotes.length, this.beatRenderHeight);

                    // 5. draw current measure hold & roll ends
                    this.drawHoldAndRollEnds(this.currentMeasureNotes, this.currentMeasureNotes.length, 0);

                    // 6. draw previous measure last beat notes
                    this.drawNotes(lastBeatNotes, this.previousMeasureNotes.length, this.beatRenderHeight);
                }
                else {
                    // 5. draw current measure hold & roll ends
                    this.drawHoldAndRollEnds(this.currentMeasureNotes, this.currentMeasureNotes.length, 0);
                }

                // 7. draw current measure notes
                this.drawNotes(this.currentMeasureNotes, this.currentMeasureNotes.length, 0);

                // 8. draw input events if any
                if (this.inputEvents.length > 0) {
                    this.drawInputEvents();
                }

                // 9. draw note judgements if any
                if (this.noteScoresWithBeats.length > 0) {
                    this.drawNoteJudgements();
                }
            },

            writeText(text, xPos, yPos, textStyle) {
                this.renderingContext.fillStyle = textStyle;
                this.renderingContext.font = `${this.measureTextFontSize}px serif`;
                this.renderingContext.fillText(text, xPos, yPos);
            },

            drawMeasureLines() {
                // .sm supports only measures with 4 beats
                for (let i = 0; i < 4; i++) {
                    const measureLineYPos = i * this.beatRenderHeight + this.measureLineYOffset;

                    const measureLineThickness = i === 0 ? this.thickMeasureLine :
                        i === 2 ? this.mediumMeasureLine : this.thinMeasureLine;

                    this.drawHorizontalLine(0, measureLineYPos, this.canvasWidth, measureLineThickness, this.measureLineStyle);
                }
            },

            drawHorizontalLine(x, y, length, lineThickness, lineStyle) {
                this.renderingContext.strokeStyle = lineStyle;
                this.renderingContext.beginPath();
                this.renderingContext.moveTo(x, y);
                this.renderingContext.lineTo(x + length, y);
                this.renderingContext.lineWidth = lineThickness;
                this.renderingContext.stroke();
            },

            drawNotes(measureNotes, totalMeasureNotes, previousMeasureYOffset) {
                measureNotes.forEach((columns, index) => {
                    if (this.rowHasNoteValue(columns)) {
                        const beat = index * (4 / totalMeasureNotes);

                        columns.forEach((col, columnIndex) => {
                            switch (col) {
                                case "1":
                                    this.drawNote(columnIndex, beat, "normal", previousMeasureYOffset);
                                    break;
                                case "2":
                                    this.drawNote(columnIndex, beat, "hold-head", previousMeasureYOffset);
                                    break;
                                case "4":
                                    this.drawNote(columnIndex, beat, "roll-head", previousMeasureYOffset);
                                    break;
                                case "M":
                                    this.drawNote(columnIndex, beat, "mine", previousMeasureYOffset);
                                    break;
                                default:
                                    break;
                            }
                        })
                    }
                })
            },

            drawHoldAndRollEnds(measureNotes, totalMeasureNotes, previousMeasureYOffset) {
                measureNotes.forEach((columns, index) => {
                    if (this.rowHasNoteValue(columns)) {
                        const beat = index * (4 / totalMeasureNotes);

                        columns.forEach((col, columnIndex) => {
                            if (col === "3") {
                                this.drawNote(columnIndex, beat, "hold-or-roll-end", previousMeasureYOffset);
                            }
                        })
                    }
                })
            },

            drawHoldAndRollBodies(measureNotes, totalMeasureNotes) {
                measureNotes.forEach((columns, index) => {
                    if (this.rowHasNoteValue(columns)) {
                        const beat = index * (4 / totalMeasureNotes);

                        columns.forEach((col, columnIndex) => {
                            let endBeat = this.getEndBeat(index, measureNotes, columnIndex, totalMeasureNotes);

                            switch (col) {
                                case "2":
                                    this.drawHoldOrRollBody(columnIndex, beat, endBeat, "hold", true);
                                    break;
                                case "H":
                                    this.drawHoldOrRollBody(columnIndex, beat, endBeat, "hold", false);
                                    break;
                                case "4":
                                    this.drawHoldOrRollBody(columnIndex, beat, endBeat, "roll", true);
                                    break;
                                case "R":
                                    this.drawHoldOrRollBody(columnIndex, beat, endBeat, "roll", false);
                                    break;
                                default:
                                    break;
                            }
                        })
                    }
                })
            },

            getEndBeat(noteIndex, measureNotes, columnIndex, totalMeasureNotes) {
                const holdEndIndex = this.tryGetHoldOrRollEnd(noteIndex, measureNotes, columnIndex);
                let endBeat;

                // Not found -> hold continues to next measure
                if (holdEndIndex === -1) {
                    endBeat = 4;
                }
                // Found -> hold ends in this measure
                else {
                    endBeat = holdEndIndex * (4 / totalMeasureNotes);
                }

                return endBeat;
            },

            tryGetHoldOrRollEnd(noteIndex, measureNotes, columnIndex) {
                return measureNotes.findIndex((col, idx) => col[columnIndex] === "3" && idx > noteIndex);
            },

            rowHasNoteValue(columns) {
                return columns.includes("1") || // Normal note
                    columns.includes("2") || // Hold head
                    columns.includes("H") || // Hold custom marker
                    columns.includes("3") || // Hold/Roll tail
                    columns.includes("4") || // Roll head
                    columns.includes("R") || // Roll custom marker
                    columns.includes("M"); // Mine
            },

            drawNote(column, beat, noteType, previousMeasureYOffset) {
                let me = this;
                // Add column spacing if not column zero
                const noteXPos = this.noteRowOffset + (column * (this.noteSize + this.noteColumnSpacing));
                const noteYPos = (beat * this.beatRenderHeight) - previousMeasureYOffset;
                const rotationAngle = me.directions[column];

                // Rotate canvas if needed for normal notes
                if (this.shouldRotate(rotationAngle, noteType)) {
                    const spriteCenterPointX = noteXPos + Math.floor(me.noteSize / 2);
                    const spriteCenterPointY = noteYPos + Math.floor(me.noteSize / 2);

                    // Rotate canvas around sprite center
                    me.renderingContext.translate(spriteCenterPointX, spriteCenterPointY);
                    me.renderingContext.rotate(me.directions[column] * Math.PI / 180);
                    me.renderingContext.translate(-spriteCenterPointX, -spriteCenterPointY);
                }

                const noteSprite = this.sprites.find(s => s.url === this.getNoteSpriteUrl(beat, noteType)).img;

                me.renderingContext.drawImage(noteSprite, noteXPos, noteYPos);

                // Reset canvas matrix if needed
                if (this.shouldRotate(rotationAngle, noteType)) {
                    me.renderingContext.setTransform(1, 0, 0, 1, 0, 0);
                }
            },

            shouldRotate(rotationAngle, noteType) {
                return (rotationAngle > 0 && (noteType === "normal" || noteType === "hold-head" || noteType === "roll-head"));
            },

            drawHoldOrRollBody(column, beat, endBeat, holdType, isHead) {
                let me = this;
                // Add column spacing if not column zero
                const noteXPos = this.noteRowOffset + (column * (this.noteSize + this.noteColumnSpacing));
                let noteYPos = (beat * this.beatRenderHeight);

                if (isHead)
                    noteYPos += (this.noteSize / 2);

                const endYPos = (endBeat * this.beatRenderHeight);

                // How many parts are needed -> get the total height of the hold and divide by single part height
                let totalHoldHeight = this.beatRenderHeight * (endBeat - beat);

                if (isHead)
                    totalHoldHeight -= (this.noteSize / 2);

                const neededBodyParts = Math.ceil(totalHoldHeight / this.holdBodyHeight);

                // Draw all body parts
                for (let i = 0; i < neededBodyParts; i++) {
                    const isLastPart = i === (neededBodyParts - 1);
                    const partYPos = noteYPos + (i * this.holdBodyHeight);
                    const partHeight = isLastPart ? (endYPos - partYPos) : this.holdBodyHeight;

                    let sprite;

                    if (holdType === "hold") {
                        sprite = this.sprites.find(s => s.url === this.holdBodyUrl).img;
                    }
                    else { // Just assume everything else is a roll
                        sprite = this.sprites.find(s => s.url === this.rollBodyUrl).img;
                    }

                    if (isLastPart) {
                        me.renderingContext.drawImage(sprite, 0, 0, this.noteSize, partHeight,
                            noteXPos, partYPos, this.noteSize, partHeight);
                    }
                    else
                        me.renderingContext.drawImage(sprite, noteXPos, partYPos);
                }
            },

            drawInputEvents() {
                this.renderingContext.fillStyle = this.inputEventFillStyle;
                const pressed = this.inputEvents.filter(ie => ie.released === false);
                const released = this.inputEvents.filter(ie => ie.released === true);

                pressed.forEach(p => {
                    const startXPos = this.noteRowOffset + (p.column * (this.noteSize + this.noteColumnSpacing));
                    const startYPos = Math.floor(((p.beat - (this.measure * 4)) * this.beatRenderHeight));

                    // Try to find the first released event where beat value is bigger
                    const releasedEvent = released.find(r => r.column === p.column && r.beat > p.beat);

                    let endYPos;

                    // Found -> get the values from the event
                    if (releasedEvent) {
                        endYPos = ((releasedEvent.beat - (this.measure * 4)) * this.beatRenderHeight);
                    }
                    // Not found -> released after the end of this measure
                    else {
                        endYPos = (4 * this.beatRenderHeight);
                    }

                    const width = this.noteSize;
                    const height = Math.floor(endYPos - startYPos);

                    this.renderingContext.fillRect(startXPos, startYPos, width, height);
                })
            },

            drawNoteJudgements() {
                const judgementSpriteSheet = this.sprites.find(s => s.url === this.judgementsSpriteUrl).img;

                this.noteScoresWithBeats.forEach(ns => {
                    const yPos = Math.floor(((ns.beat - (this.measure * 4)) * this.beatRenderHeight)) - (this.judgementSpriteHeight / 2);
                    const xPos = this.noteRowOffset + (5 * (this.noteSize + this.noteColumnSpacing));

                    if (ns.tapNoteScore !== "None" && ns.tapNoteScore !== "AvoidMine") {
                        const judgementSprite = this.getJudgementSprite(ns.offset, ns.tapNoteScore);

                        if (judgementSprite) {
                            this.renderingContext.drawImage(judgementSpriteSheet, judgementSprite.sx, judgementSprite.sy,
                                this.judgementSpriteWidth, this.judgementSpriteHeight,
                                xPos, yPos, this.judgementSpriteWidth, this.judgementSpriteHeight);
                        }
                    }

                    const judgementLineXPos = this.noteRowOffset + (ns.column * (this.noteSize + this.noteColumnSpacing)) + this.noteSize;
                    const judgementLineYPos = Math.floor(((ns.beat - (this.measure * 4)) * this.beatRenderHeight));
                    const lineLength = Math.floor(xPos - judgementLineXPos);

                    const judge = ns.tapNoteScore !== "None" ? ns.tapNoteScore : ns.holdNoteScore;
                    const lineStyle =  this.judgementLineStrokeStyles[judge];

                    this.drawHorizontalLine(judgementLineXPos, judgementLineYPos, lineLength, this.thinMeasureLine, lineStyle);

                    if (ns.holdNoteScore === "None") {
                        this.writeText(`${(ns.offset * 1000).toFixed(2)}ms`, xPos - 50, judgementLineYPos - 5, this.textFillStyle);
                    }

                    if (ns.tapNoteScore === "AvoidMine") {
                        this.writeText("Avoid mine", xPos + 10, judgementLineYPos, this.textFillStyle);
                    }
                    else if (ns.holdNoteScore === "Held") {
                        this.writeText("Held", xPos + 10, judgementLineYPos, this.textFillStyle);
                    }
                });
            },

            // TODO: Get global standard timing windows from padmiss API
            getJudgementSprite(offset, tapNoteScore) {
                let me = this;

                switch (tapNoteScore) {
                    case "W1":
                        return me.judgementSpriteLocations["earlyFantastic"];
                    case "W2":
                        return (offset < 0) ?
                            me.judgementSpriteLocations["earlyExcellent"] :
                            me.judgementSpriteLocations["lateExcellent"];
                    case "W3":
                        return (offset < 0) ?
                            me.judgementSpriteLocations["earlyGreat"] :
                            me.judgementSpriteLocations["lateGreat"];
                    case "W4":
                        return (offset < 0) ?
                            me.judgementSpriteLocations["earlyDecent"] :
                            me.judgementSpriteLocations["lateDecent"];
                    case "W5":
                        return (offset < 0) ?
                            me.judgementSpriteLocations["earlyWayOff"] :
                            me.judgementSpriteLocations["lateWayOff"];
                    case "Miss":
                        return me.judgementSpriteLocations["earlyMiss"];
                    default:
                        console.error(`Unknown tapNoteScore '${tapNoteScore}'`);
                        break;
                }
            },

            getNoteSpriteUrl(beat, noteType) {
                let spriteUrl = "";

                // We need to draw the normal note in holds and rolls too
                if (noteType === "normal" || noteType === "hold-head" || noteType === "roll-head") {
                    spriteUrl = this.getNoteUrlByNoteValue(beat, 4);
                }
                else if (noteType === "hold-or-roll-end") {
                    spriteUrl = this.holdEndUrl;
                }
                else if (noteType === "mine") {
                    spriteUrl = this.mineUrl;
                }
                // Should not happen
                else {
                    spriteUrl = this.errorSpriteUrl;
                }

                return spriteUrl;
            },

            getNoteUrlByNoteValue(beat, size) {
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
            },

            loadSprites() {
                let me = this;

                const imageUrls = Object.values(me.noteSpriteUrlsByBeatValue).concat([
                    me.holdBodyUrl,
                    me.holdEndUrl,
                    me.rollBodyUrl,
                    me.rollEndUrl,
                    me.mineUrl,
                    me.errorSpriteUrl,
                    me.judgementsSpriteUrl
                ]);

                const distinct = [...new Set(imageUrls)];

                return distinct.map(url => {
                    return new Promise((resolve, reject) => {
                        let img = new Image();

                        img.onload = function () {
                            resolve({ url: url, img: img });
                        };

                        img.src = url;
                    });
                });
            }
        },

        async mounted () {
            // We can't access the rendering context until the canvas is mounted to the DOM.
            this.renderingContext = this.$refs["measure-canvas"].getContext("2d");

            this.$refs["measure-canvas"].width = this.canvasWidth;
            this.$refs["measure-canvas"].height = this.measureRenderHeight;

            this.sprites = await Promise.all(this.loadSprites());

            this.renderCanvas();
        }
    }
</script>
