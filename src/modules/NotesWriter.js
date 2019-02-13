export default class {
    data = ""
    info = {}
    tags = [
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
    ]
    splitTags = [
        'BPMS',
        'STOPS',
        'BGCHANGES',
        'FGCHANGES',
        'KEYSOUNDS',
        'ATTACKS'
    ]
    out = []
    chart = {
        type: "",
        description: "",
        credit: "",
        diff: "Easy",
        meter: 1
    }

    setData(data) {
        this.data = data
    }

    read() {
        let me = this

        let lines = this.data.split("\n")
        let mode = "normal"

        let re1 = /^#(\w+):([^;]*);$/
        let re2 = /;$/
        let re3 = /a/

        let buff = ""

        lines.forEach(l => {
            l = l.trim()
            if(l.length === 0) {
                return
            }

            if(mode === "normal") {
                let match = re1.exec(l)
                if(match) {
                    me.handleLine(match)
                } else {
                    buff = l
                    mode = "buffer"
                }
            } else if (mode === "buffer") {
                buff += l
                if(re2.match(l)) {
                    mode = "normal"

                    let match = re1.exec(buff)
                    if(match) {
                        me.handleLine(match)

                        return
                    } else {
                        //todo
                    }
                }
            }
        })
    }

    handleLine(matches) {
        let me = this

        let k = matches[1]
        let v = matches[2]
        if(this.splitTags.includes(k)) {
            let v = v.split(',').map(i => i.trim())

            if(['STOPS', 'BPMS'].includes(k)) {
                v = v.map(i => {
                    let pts = i.split('.')
                    if(pts.length !== 2) {
                        //todo
                        return i
                    }

                    return me.formatDec(pts[0]) + '=' + me.formatDec(pts[1])
                })
            }
        }

        this.info[k] = k
    }

    formatDec(i) {
        i = parseFloat(i)
        return i.toPrecision(6)
    }

    write() {
        this.out = []

        this.writeHeader()
        this.writeChart()

        let ret = ""
        this.out.forEach(l => {
            l = l.trim()
            ret += l + "\r\n"
        })
        return ret
    }

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
                if(t === 'STOPS') {
                    val = me.info[t].join(",\r\n")
                } else {
                    val = me.info[t].join(',')
                }
            }
            this.writeTag(t, val)
        })

    }

    writeChart() {
        this.out.push("")
        this.out.push("//---------------" + this.chart.type + " - " + this.chart.description +"----------------")
        this.out.push('#NOTES:')
        this.out.push('     ' + this.chart.type + ':')
        this.out.push('     ' + this.chart.credit + ':')
        this.out.push('     ' + this.chart.diff + ':')
        this.out.push('     ' + this.chart.meter + ':')


    }

    writeTag(tag, val) {
        this.out.push("#" + tag + ":" + val + ";\r\n")
    }
}