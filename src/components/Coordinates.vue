<template>
  <div>
    <h1>Local Coordinates: {{ lat }}, {{ long }}</h1>
    <h2>Current Temperature: {{ weather.currently.temperature }}&deg;F</h2>
    <h2>Weather Summary: {{ weather.currently.summary }}</h2>
    <h2>Dew Point: {{ weather.currently.dewPoint }}&deg;F</h2>
    <h2>Humidity: {{ weather.currently.humidity * 100 }}%</h2>
    <h2>Pressure: {{ weather.currently.pressure }} mbar</h2>
  </div>
</template>

<script>
export default {
  name: 'Coordinates',
  data () {
    return {
      lat: null,
      long: null,
      weather: {}
    }
  },
  methods: {
    getCoordinates (position) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude
          this.long = position.coords.longitude

          return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
              .then(response => {
                response.json()
                  .then(data => {
                    console.log(data)
                    this.weather = data
                  })
                resolve(response)
              })
          })
        })
      }
    }
  },
  mounted () {
    this.getCoordinates()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
