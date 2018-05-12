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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
