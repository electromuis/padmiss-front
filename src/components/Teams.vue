<template>
    <loading v-if="loading" :active="true"></loading>
    <div v-else>
        <h1>Teams</h1>
        <br/>&nbsp;
        <Table :cols="cols" :query="query"></Table>
    </div>
</template>

<script>
    import Table from './../Custom/Table.vue'
    import Loading from 'vue-loading-overlay';

    let me = null

    export default {
        created() {
            me = this
            this.loading = false
        },

        data() {
            return {
                loading: true,

                cols: [
                    {
                        field: 'name',
                        name: 'Name'
                    },
                    {
                        field: 'teamLeader.nickname',
                        name: 'Leader'
                    },
                    {
                        type: 'actions',
                        actions: [
                            {
                                text: 'Details',
                                action(r) {
                                    me.$router.push('/teams/details/' + r.id)
                                }
                            }
                        ]
                    }
                ],
                query: {
                    table: 'Teams',
                    sort: 'name',
                    limit: 10,
                    fields: [
                        'id',
                        'name',
                        {'teamLeader': ['nickname']}
                    ]
                }
            }
        },

        components: {
            Table,
            Loading
        }
    }
</script>

<style scoped>

</style>