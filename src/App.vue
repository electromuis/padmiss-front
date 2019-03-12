<template>
  <div id="app">
    <loading v-if="loading" :active="true"></loading>

    <div v-else>
      <Menu />
      <Breadcrumb />
      <div v-if="wrapper" class="container">
        <router-view></router-view>
      </div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
  import Menu from './components/App/Menu.vue'
  import Breadcrumb from './components/App/Breadcrumb.vue'
  import AuthMixin from "./mixins/AuthMixin";

  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: 'App',
    mixins: [AuthMixin],
    data() {
      return {
          loading: true,
          wrapper: true
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
      Loading,
      Breadcrumb
    }
  }
</script>
