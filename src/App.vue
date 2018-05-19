<template>
  <div id="app">
    <Currently></Currently>
  </div>
</template>

<script>
import Currently from './components/Currently'

export default {
  name: 'App',
  components: {
    Currently
  }
}
</script>

<style lang="scss">
@import 'sass/_reset.scss';

html, body {
  background-color: #2c3e50;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
