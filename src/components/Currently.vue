<template>
  <div v-if="isLoaded">
    <h1>Local Coordinates: {{ weather.latitude }}, {{ weather.longitude }}</h1>
    <h2>Current Temperature: {{ weather.currently.temperature }}&deg;F</h2>
    <h2>Weather Summary: {{ weather.currently.summary }}</h2>
    <h2>Dew Point: {{ weather.currently.dewPoint }}&deg;F</h2>
    <h2>Humidity: {{ weather.currently.humidity * 100 }}%</h2>
    <h2>Pressure: {{ weather.currently.pressure }} mbar</h2>
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>

<script>
export default {
  name: 'Currently',
  data () {
    return {
      weather: {},
      isLoaded: false
    }
  },
  methods: {
    fetchCurrentWeather () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          return new Promise((resolve, reject) => {
            fetch(`${process.env.API_URL}lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
              .then(response => {
                response.json()
                  .then(data => {
                    console.log(data)
                    this.weather = data
                    this.isLoaded = true
                  })
                resolve(response)
              })
          })
        })
      }
    }
    // getLocation () {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(position => {
    //       this.latitude = position.coords.latitude
    //       this.longitude = position.coord.longitude
    //       console.log(this.latitude)
    //     })
    //   } else {
    //     // Need to handle errors if geolocation not supported
    //   }
    // },
    // fetchCurrentWeather () {
    //   return new Promise((resolve, reject) => {
    //     fetch(`${process.env.API_URL}lat=${this.latitude}&lon=${this.longitude}`)
    //     .then(response => {
    //         response.json()
    //         .then(data => {
    //           console.log(data)
    //           this.weather = data
    //         })
    //         resolve(response)
    //       })
    //     })
    //   }
  },
  // beforeMount() {
  //   this.getLocation()
  // },
  mounted () {
    this.fetchCurrentWeather()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
