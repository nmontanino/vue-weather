<template>
  <div id="app">
    <weather></weather>
  </div>
</template>

<script>
import Weather from './components/Weather'

export default {
  name: 'App',
  components: {
    Weather
  }
}
</script>

<style lang="scss">
@import 'sass/_reset.scss';
@import 'sass/_vars.scss';

html, body {
  background-color: $color-bg;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-primary;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
