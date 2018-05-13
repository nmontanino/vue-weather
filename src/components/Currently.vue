<template>
  <div v-if="isLoaded">
    <h1>
      Current Temperature: {{ Math.round(weather.currently.temperature) }}
      <span class="convert" v-if="units === 'us'" @click="convertUnits('us')">&deg;F</span>
      <span class="convert" v-if="units === 'si'" @click="convertUnits('si')">&deg;C</span>
    </h1>
    <h1>Summary: {{ weather.currently.summary }}</h1>
    <h2>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</h2>
    <h2>
      Dew Point: {{ Math.round(weather.currently.dewPoint) }}
      <span v-if="units === 'us'">&deg;F</span>
      <span v-if="units === 'si'">&deg;C</span>
    </h2>
    <h2>
      Wind Speed: {{ weather.currently.windSpeed }}
      <span v-if="units === 'us'">mph</span>
      <span v-if="units === 'si'">m/s</span>
    </h2>
    <h2>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</h2>
    <h2>Pressure: {{ weather.currently.pressure }} mbar</h2>
  </div>
  <div v-else>
    <!-- This will do until I can add a spinner or something -->
    <h1>Loading...</h1>
  </div>
</template>

<script>
export default {
  name: 'Currently',
  data () {
    return {
      weather: {},
      lat: null,
      lon: null,
      units: 'si',
      isLoaded: false
    }
  },
  methods: {
    getCurrentWeather () {
      fetch(`${process.env.API_URL}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
        .then(response => {
          // TODO: Check if response.status == 200, then handle errors
          response.json()
            .then(data => {
              // console.log(data)
              this.weather = data
              this.isLoaded = true
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getLocation () {
      // TODO: Get city name from coordinates
    },
    convertUnits (units) {
      if (units === 'us') {
        // this.weather.currently.temperature = (this.weather.currently.temperature - 32) * 5 / 9
        this.units = 'si'
      } else {
        // this.weather.currently.temperature = this.weather.currently.temperature * 9 / 5 + 32
        this.units = 'us'
      }
      // TODO: Find out a better way to do this
      this.isLoaded = false
      this.getCurrentWeather()
    }
  },
  created () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // console.log('Coordinates:', position.coords)
        this.lat = position.coords.latitude
        this.lon = position.coords.longitude

        if (navigator.language === 'en-US') {
          this.units = 'us'
        }
        this.getCurrentWeather()
      })
    } else {
      // TODO: Need to handle errors if geolocation not supported or not enabled
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.convert {
  cursor: pointer;
  color: slateblue;
}
</style>
