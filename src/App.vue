<template>
  <div id="app">
    <loading v-if="loading" :active="true"></loading>

    <div v-else>
      <Menu />
      <Breadcrumb />
      <div class="container main-wrapper">
        <router-view></router-view>
      </div>
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
          loading: true
      }
    },
    created() {
        let me = this

        me.$autoLogin().then(() => {
          me.loading = false;
        })
    },
    components: {
      Menu,
      Loading,
      Breadcrumb
    }
  }
</script>

<style lang="scss">
  @import 'assets/custom.scss';
  @import '~bootstrap/scss/bootstrap.scss';
  /*@import '~bootstrap-vue/src/index.scss';*/

  .main-wrapper {
    padding-top: 20px;
  }

</style>