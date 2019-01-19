<template>
  <div id="app">
    <loading v-if="loading" :active="true"></loading>

    <div v-else>
      <Menu />
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from './components/App/Menu.vue'
  import AuthMixin from "./mixins/AuthMixin";

  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: 'App',
    mixins: [AuthMixin],
    data() {
      return {
          loading: true
      }
    },
    created() {
        let me = this

        me.$autoLogin()
            .finally(() => {
                me.loading = false
            })
    },
    components: {
      Menu,
      Loading
    }
  }
</script>
