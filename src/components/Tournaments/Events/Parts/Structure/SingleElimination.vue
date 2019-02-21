<template>
    <div class="bracket">
        <div class="round" v-for="round in rounds">

            <div class="match" v-for="match in round.matches">
                <div class="line-connect"></div>
                <div class="line-connect"></div>
                <div class="line-connect"></div>
                <div class="line-connect"></div>

                <div class="player" v-for="player in match.players">
                    <div class="line-right"></div>

                    {{player.name}}

                </div>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "SingleElimination",

        methods: {
            update() {

            }
        },

        created() {
            this.update()
        },

        data() {
            return {
                rounds: [
                    {
                        name: 'round 1',
                        matches: [
                            {
                                name: 'match 1',
                                players: [
                                    {
                                        id: 1,
                                        name: 'player 1'
                                    },
                                    {
                                        id: 2,
                                        name: 'player 2'
                                    }
                                ]
                            },
                            {
                                name: 'match 2',
                                players: [
                                    {
                                        id: 3,
                                        name: 'player 3'
                                    },
                                    {
                                        id: 4,
                                        name: 'player 4'
                                    }
                                ]
                            },
                            {
                                name: 'match 1',
                                players: [
                                    {
                                        id: 1,
                                        name: 'player 1'
                                    },
                                    {
                                        id: 2,
                                        name: 'player 2'
                                    }
                                ]
                            },
                            {
                                name: 'match 2',
                                players: [
                                    {
                                        id: 3,
                                        name: 'player 3'
                                    },
                                    {
                                        id: 4,
                                        name: 'player 4'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'round 2',
                        matches: [
                            {
                                name: 'match 1',
                                players: [
                                    {
                                        id: 2,
                                        name: 'player 2'
                                    },
                                    {
                                        id: 4,
                                        name: 'player 4'
                                    }
                                ]
                            },
                            {
                                name: 'match 1',
                                players: [
                                    {
                                        id: 2,
                                        name: 'player 2'
                                    },
                                    {
                                        id: 4,
                                        name: 'player 4'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>

<style>
    .bracket {
        height: 600px;
    }

    .round {
        height: 100%;
        width: 300px;
        border: 1px solid black;
        float: left;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: stretch;
        align-items: flex-start;
    }

    .match {
        height: 70px;
        width: 100px;
        border: 1px solid black;

        order: 0;
        flex: 0 1 auto;
        align-self: auto;

        margin: 5px;

        position: relative;
    }

    .line-connect:nth-child(1) {
        border: 1px solid black;
        width: 2px;
        height: 50%;

        position: absolute;
        left: 200%;
        top: 25%;
    }

    .line-connect:nth-child(2) {
        border: 1px solid black;
        width: 50%;
        height: 2px;

        position: absolute;
        left: 200%;
        top: 50%;
    }

    .line-connect:nth-child(3) {
        border: 1px solid black;
        width: 2px;
        height: 25%;

        position: absolute;
        left: 250%;
        top: 50%;
    }

    .match:nth-child(even) .line-connect:nth-child(3) {
        top: 25%;
    }

    .line-connect:nth-child(4) {
        border: 1px solid black;
        width: calc(200% - 140px);
        height: 2px;

        position: absolute;
        left: 250%;
        top: 75%;
    }

    .match:nth-child(even) .line-connect:nth-child(4) {
        top: 25%;
    }

    .player {
        border: 1px solid black;

        height: 50%;
        width: 100%;

        line-height: 200%;
        vertical-align: middle;
        text-align: center;

        position: relative;
    }

    .line-right {
        border: 1px solid black;
        width: 100px;
        height: 2px;

        position: absolute;

        top: 50%;
        left: 100%;
    }
</style>