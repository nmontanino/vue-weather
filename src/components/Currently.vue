<template>
  <div v-if="isLoaded">
    <h2>
      Current Temperature: {{ Math.round(weather.currently.temperature) }}
      <span class="convert" v-if="units === 'us'" @click="convertUnits('us')">&deg;F</span>
      <span class="convert" v-if="units === 'si'" @click="convertUnits('si')">&deg;C</span>
    </h2>
    <h2>Weather Summary: {{ weather.currently.summary }}</h2>
    <h3>
      Dew Point: {{ Math.round(weather.currently.dewPoint) }}
      <span v-if="units === 'us'">&deg;F</span>
      <span v-if="units === 'si'">&deg;C</span>
    </h3>
    <h3>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</h3>
    <h3>Pressure: {{ weather.currently.pressure }} mbar</h3>
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
          // TODO: Check if response.status == 200
          response.json()
            .then(data => {
              console.log(data)
              this.weather = data
              this.isLoaded = true
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getLocation () {
      // Get city name from coordinates
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
}
</style>
