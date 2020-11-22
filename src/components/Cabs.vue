<template>
  <div>
    <h1>Cabs</h1>

<!--    <div class="form-group">-->
<!--      <div class="form-label">-->
<!--        Filter:-->
<!--      </div>-->
<!--      <input v-model="filter" class="form-control col-md-12" />-->
<!--    </div>-->

    <div v-if="$isLoggedIn">
      <b-button variant="info" class="m-1" @click="$router.push({path: `/cabs/0/edit`})">
        Create
      </b-button>
      <br/>&nbsp;
    </div>

    <Table ref="table" :cols="cols" :query="query"></Table>
  </div>
</template>

<script>
    import Table from './Custom/Table.vue'
    import AuthMixin from '../mixins/AuthMixin'

    export default {
        mixins: [AuthMixin],

        data() {
            return {
              filter: '',
              cols: [
                {
                  field: 'name',
                  name: 'Name',
                  sort: 'name'
                },
                {
                  field: 'apiKey',
                  name: 'API Key',
                  sort: 'apiKey'
                },
                {
                  type: 'actions',
                  actions: [
                    {
                      text: 'Edit',
                      action(r) {
                        me.$router.push('/cabs/' + r.id + '/edit')
                      }
                    }
                  ]
                }
              ],
              query: {
                table: 'ArcadeCabs',
                sort: 'name',
                limit: 10,
                fields: [
                  'id',
                  'name',
                  'apiKey'
                ]
              }
            }
        },

        created() {
            let me = this

        },

        components: {
          Table
        }
    }
</script>

<style scoped>

</style>