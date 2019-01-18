<template>
  <div id="app">
    <Menu />

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Menu from './components/App/Menu.vue'

  export default {
    name: 'App',
    components: {
      Menu
    }
  }
</script>
