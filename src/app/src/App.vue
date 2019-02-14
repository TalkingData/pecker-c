<template>
  <div id="app">
    <Header v-if="$route.name !== 'login'"></Header>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/header';

export default {
  name: 'App',
  data() {
    return {};
  },
  components: {
    Header,
  },
};
</script>

<style lang="scss">
  @import "./assets/style/index.scss";
</style>
