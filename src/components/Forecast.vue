<template>
  <div id="forecast">
    <div class="day" v-for="(day, index) in daily" :key="index">
      <p>{{ moment(day.time * 1000).format('ddd') }}</p>
      <skycon :condition="day.icon" :width="42" :height="42"></skycon>
      <p>{{ Math.round(day.temperatureMax) }}&deg;</p>
      <p>{{ Math.round(day.temperatureMin) }}&deg;</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forecast',
  props: ['daily']
}
</script>

<style lang="scss" scoped>

#forecast {
  text-align: center;
  display: flex;
  justify-content: space-between;

  p:last-child {
    opacity: 0.5;
    margin-top: 0.25em;
  }

  // .day:first-child {
  //   display: none;
  // }

  canvas {
    margin: 8px 0;
  }
}

</style>
