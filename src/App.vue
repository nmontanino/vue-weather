<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <Coordinates/>
  </div>
</template>

<script>
import Coordinates from './components/Coordinates'

export default {
  name: 'App',
  components: {
    Coordinates
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
