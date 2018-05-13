<template>
  <div class="loader" v-if="!isLoaded"></div>
  <div v-else>
    <h1>{{ this.city }}, {{ this.region }}, {{ this.country }}</h1>
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
</template>

<script>
export default {
  name: 'Currently',
  data () {
    return {
      city: null,
      region: null,
      country: null,
      weather: {},
      lat: null,
      lon: null,
      units: 'si',
      isLoaded: false
    }
  },
  methods: {
    getCurrentWeather () {
      fetch(`${process.env.API_URL.darksky}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
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
      fetch(`${process.env.API_URL.googleMaps}latlng=${this.lat},${this.lon}`)
        .then(response => {
          // console.log(response)
          response.json().then(data => {
            // console.log(data)
            let location = data[0].address_components
            location.forEach(element => {
              if (element.types[0] === 'locality') {
                this.city = element.long_name
              }
              if (element.types[0] === 'administrative_area_level_1') {
                this.region = element.long_name
              }
              if (element.types[0] === 'country') {
                this.country = element.long_name
              }
            })
          })
        })
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
        this.getLocation()
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
.loader {
  border: 14px solid #f3f3f3;
  border-radius: 50%;
  border-top: 14px solid #5e5e5e;
  width: 70px;
  height: 70px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
