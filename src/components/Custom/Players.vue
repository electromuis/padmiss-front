<template>
    <div class="players">
        <div class="form-group">
            <input type="text" class="form-control" v-model="filter">
        </div>
        <div class="group" v-for="group in groups">
            {{group}}
            <draggable v-model="players[group]" class="dragArea" :options="{group:'players'}" @end="handleMove" :group="group">
                <div class="player" v-for="player in players[group].filter(filterPlayers)" :data-player="JSON.stringify(player)">
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
            filterPlayers(p) {
                if(this.filter.length === 0) {
                    return true
                }

                return p.name.indexOf(this.filter) > -1
            },

            handleMove(e) {
                let from = e.from.attributes['group'].nodeValue
                let to = e.to.attributes['group'].nodeValue
                let player = JSON.parse(e.item.attributes['data-player'].nodeValue)

                if(typeof this.$props.dragged !== "undefined") {
                    this.$props.dragged(player, from, to)
                }
            }
        },

        data() {
            return {
                filter: ""
            }
        },

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