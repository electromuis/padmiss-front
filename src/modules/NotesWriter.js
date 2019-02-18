export default {
    data: "",
    info: {},
    tags: [
        'TITLE',
        'SUBTITLE',
        'ARTIST',
        'TITLETRANSLIT',
        'SUBTITLETRANSLIT',
        'ARTISTTRANSLIT',
        'GENRE',
        'CREDIT',
        'BANNER',
        'BACKGROUND',
        'LYRICSPATH',
        'CDTITLE',
        'MUSIC',
        'OFFSET',
        'SAMPLESTART',
        'SAMPLELENGTH'
    ],
    splitTags: [
        'BPMS',
        'STOPS',
        'BGCHANGES',
        'FGCHANGES',
        'KEYSOUNDS',
        'ATTACKS'
    ],
    chartFields: ['type', 'credit', 'diff', 'level', 'meter'],
    out: [],
    charts: [],

    setData(data) {
        this.data = data
    },

    read() {
        let me = this

        let lines = this.data.split("\n")
        let mode = "normal"
        let c = 0

        let re1 = /^#(\w+):([^;]*);$/
        let re2 = /;$/
        let re3 = /\s*(.*)\s*\/\/(.*)$/
        let re4 = /^(.*):$/

        let chart = null

        let notes = []

        let buff = ""

        lines.forEach(l => {
            l = l.trim()

            let match = re3.exec(l)
            if(match !== null) {
                l = match[1]
            }

            l = l.trim()
            if(l.length === 0) {
                return
            }

            // console.log([l, mode])

            if(mode === "normal") {
                let match = re1.exec(l)
                if(match) {
                    me.handleLine(match)
                } else {
                    console.log(l)
                    if(l === '#NOTES:') {

                        if(chart !== null) {
                            me.charts.push(chart)
                        }

                        notes = []
                        chart = {notes: []}
                        mode = "chart"
                        c = 0
                    } else {
                        console.log([1, l, "buffer"])
                        buff = l
                        mode = "buffer"
                    }
                }
            } else if (mode === "buffer") {
                buff += l
                if(re2.exec(l)) {
                    mode = "normal"

                    let match = re1.exec(buff)
                    if(match) {
                        me.handleLine(match)

                        return
                    } else {
                        //todo
                    }
                }
            } else if (mode ===  'chart') {
                if(c < me.chartFields.length) {
                    let match = re4.exec(l)
                    if(match) {
                        chart[me.chartFields[c]] = match[1]
                        c++
                    } else {
                        //ignore?
                    }
                }

                if(c >= me.chartFields.length) {
                    mode = 'notes'
                }

            } else if (mode === 'notes') {
                if(l === ',') {
                    chart.notes.push(notes)
                    notes = []
                } else if (l === ';') {
                    chart.notes.push(notes)
                    me.charts.push(chart)
                    chart = null
                    mode = 'normal'
                } else {
                    notes.push(l)
                }
            }

            // console.log(mode)
        })

        if(chart !== null) {
            me.charts.push(chart)
        }
    },

    handleLine(matches) {
        if(matches.length !== 3) {
            //todo
            return
        }

        let me = this

        let key = matches[1]
        let val = matches[2]

        if(val.length === 0) {
            return
        }

        if(this.splitTags.includes(key)) {
            val = val.split(',').map(i => i.trim())

            if(['STOPS', 'BPMS'].includes(key)) {
                val = val.map(i => {
                    let pts = i.split('=')
                    if(pts.length !== 2) {
                        //todo
                        return i
                    }

                    return me.formatDec(pts[0]) + '=' + me.formatDec(pts[1])
                })
            }
        }

        this.info[key] = val
    },

    formatDec(i) {
        i = parseFloat(i)
        return i.toFixed(6)
    },

    write() {
        this.out = []

        this.writeHeader()
        this.writeCharts()

        let ret = ""
        this.out.forEach(l => {
            ret += l + "\n"
        })
        return ret
    },

    writeHeader() {
        let me = this

        this.tags.forEach(t => {
            let val = ""
            if(me.info[t]) {
                val = me.info[t]
            }
            this.writeTag(t, val)
        })

        this.writeTag('SELECTABLE', 'YES')

        if(this.info.DISPLAYBPM) {
            this.writeTag('DISPLAYBPM', this.info.DISPLAYBPM)
        }

        this.splitTags.forEach(t => {
            let val = ""
            if(me.info[t]) {
                if(Array.isArray(me.info[t])) {
                    if (['STOPS', 'BPMS'].includes(t)) {
                        val = me.info[t].join(",\n") + "\n"
                    } else {
                        val = me.info[t].join(',')
                    }
                } else {
                    //todo
                }
            } else {
                if(['STOPS', 'BPMS'].includes(t)) {
                    val = "\n"
                }
            }

            if(t === 'FGCHANGES' && val.length === 0) {
                return
            }

            this.writeTag(t, val)
        })
    },

    calcLength(chart) {
        if(this.info['BPMS'] && Array.isArray(this.info['BPMS']) && this.info['BPMS'].length > 0) {
          //todo make anti statement
        } else {
            return
        }

        let notes = chart.notes
        let bpms = []
        this.info['BPMS'].forEach(b => {
            let pts = b.split('=')
            if(pts.length !== 2) {
                //todo
                return
            }

            bpms.push([parseFloat(pts[0]), parseFloat(pts[1])])
        })

        //seconds
        let length = 0

        //Check first bpm = 0
        if(typeof bpms[0] === undefined) {
            //todo
            return
        }

        let fromBeat = 0
        let bpm = 0
        console.log(bpms)

        //Calculate length for all beats
        for (let i = 0; i < bpms.length; i++) {
            bpm = bpms[i][1]
            let toBeat = 0

            if(typeof bpms[i+1] !== 'undefined') {
                toBeat = bpms[i+1][0]
            }
            else {
                toBeat = notes.length * 4 //one measure is 4 beats
            }

            let beats = toBeat - fromBeat
            let duration = 0

            if(bpm > 0) {
                duration = 60 * beats / bpm
            } else {
                //todo, bpm gimicks
                duration = 60 * beats / Math.abs(bpm)
            }

            console.log([duration, length, fromBeat, toBeat, bpm, beats, beats/bpm, beats/bpm*60])

            length += duration

            fromBeat = toBeat
        }

        //Substract last bit

        let lastBeatNotes = notes[notes.length - 1].reverse()
        let division = 0;
        let noteDivision = 0

        for(let i = 0; i < lastBeatNotes.length; i++) {
            if(lastBeatNotes[i].replace('0', '').length !== 0) {
                division = lastBeatNotes[i].length
                noteDivision = i
                break;
            }
        }

        if(noteDivision > 0) {
            //todo, dont reuse bpm var, find the actual bpm of the last note becuase maybe the last bpm change is for another chart, after out last notes

            let duration = 60 * (noteDivision / division) / bpm
            let beatDuration = 60 / bpm
            // length -= beatDuration - duration
        } else {
            //todo
        }

        return length
    },

    writeCharts() {
        let me = this

        me.charts.forEach(chart => {
            me.out.push("")
            me.out.push("//---------------" + chart.type + " - " + chart.credit +"----------------")
            me.out.push('#NOTES:')
            me.chartFields.forEach(f => {
                me.out.push('     ' + chart[f] + ':')
            })

            let first = true

            chart.notes.forEach(n => {
                if(first === false) {
                    me.out.push(',')
                }

                n.forEach(l => {
                    me.out.push(l)
                })

                first = false
            })

            me.out.push(';')
        })
    },

    writeTag(tag, val) {
        this.out.push("#" + tag + ":" + val + ";")
    }
}