<template>
    <div class="players">
        <div class="form-group">
            <input type="text" class="form-control" v-model="filter">
        </div>
        <div class="group" v-for="group in groups">
            {{group}}
            <draggable v-model="players[group]" class="dragArea" :options="{group:'players'}" @end="handleMove" :group="group" :move="checkMove">
                <div class="player" v-for="player in players[group]" v-if="filterPlayers(player, group)" :data-player="player.id">
                    {{player.name}}
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"

    export default {
        name: "Players",

        methods: {
            filterPlayers(p, group) {
                if(this.filter.length === 0) {
                    return true
                }

                return p.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
            },

            handleMove(e) {
                //could also do a deep watch of the players var?
                let me = this
                let all = {}

                this.groups.forEach(g => {
                    me.players[g].forEach(p => {
                        all[p.id] = p
                    })
                })

                let from = e.from.attributes['group'].nodeValue
                let to = e.to.attributes['group'].nodeValue

                let playerId = e.clone.attributes['data-player'].nodeValue
                let player = all[playerId]

                if(typeof me.$props.dragged !== "undefined") {
                    me.$props.dragged(player, from, to)
                }
            },

            checkMove(e)
            {
                let from = e.from.attributes['group'].nodeValue
                let to = e.to.attributes['group'].nodeValue

                if(from === to) {
                    return true
                }

                if(Array.isArray(this.$props.allowedMoves)) {

                    if(this.$props.allowedMoves.filter(i => {
                        return i[0] === from && i[1] === to
                    }).length > 0) {
                        return true
                    } else {
                        return false
                    }
                }

                return true
            }
        },

        data() {
            return {
                filter: ""
            }
        },

        // watch: {
        //     players: {
        //         handler() {
        //             let me = this
        //             this.all = {}
        //
        //
        //         },
        //         deep: true
        //     }
        // },

        props: {
            groups: Array,
            players: Object,
            dragged: Function,
            allowedMoves: Array
        },

        components: {
            draggable
        }
    }
</script>

<style>
    .group {
        float: left;
        margin-right: 20px;
    }

    .dragArea {
        width: 200px;
        min-height: 10px;
        border: 1px solid black;
    }
</style>