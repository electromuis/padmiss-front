<template>
    <div class="players">
        <div class="form-group">
            <input type="text" class="form-control" v-model="filter">
        </div>
        <div class="group" v-for="group in groups">
            {{group}}
            <draggable v-model="players[group]" class="dragArea" :options="{group:'players'}" @end="handleMove" :group="group">
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

                console.log(p, group)

                return p.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
            },

            handleMove(e) {
                //could also do a deep watch of the players var?

                let from = e.from.attributes['group'].nodeValue
                let to = e.to.attributes['group'].nodeValue

                let playerId = e.item.attributes['data-player'].nodeValue
                let player = this.players[from].filter(p => p.id == playerId)[0]

                if(typeof this.$props.dragged !== "undefined") {
                    this.$props.dragged(player, from, to)
                }
            }
        },

        data() {
            return {
                filter: "",
                all: []
            }
        },

        // watch: {
        //     players: {
        //         handler() {
        //             let me = this
        //             this.all = {}
        //             let new =
        //
        //             this.groups.forEach(g => {
        //                 me.players[g].forEach(p => {
        //                     me.all[p.id] = p
        //                 })
        //             })
        //         },
        //         deep: true
        //     }
        // },

        props: {
            groups: Array,
            players: Object,
            dragged: Function
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