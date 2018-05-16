<template>
  <div class="loader" v-if="!isLoaded"></div>
  <div class="weather-container" v-else>
    <div class="row">
      <div class="column">
        <h1>{{ location.city }}, {{ location.region }}, {{ location.country }}</h1>
        <h2>{{ formatDate(weather.currently.time) }}</h2>
        <h2>
          Current Temperature: {{ Math.round(weather.currently.temperature) }}
          <span class="convert" v-if="units === 'us'" @click="convertUnits('us')">&deg;F</span>
          <span class="convert" v-if="units === 'si'" @click="convertUnits('si')">&deg;C</span>
        </h2>
        <h2>Summary: {{ weather.currently.summary }}</h2>
      </div>
      <div class="column right">
        <div class="icon">
          <skycon :condition="weather.currently.icon"></skycon>
        </div>
        <p>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</p>
        <p>
          Dew Point: {{ Math.round(weather.currently.dewPoint) }}
          <span v-if="units === 'us'">&deg;F</span>
          <span v-if="units === 'si'">&deg;C</span>
        </p>
        <p>
          Wind: {{ weather.currently.windSpeed }}
          <span v-if="units === 'us'">mph</span>
          <span v-if="units === 'si'">m/s</span>
        </p>
        <p>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</p>
        <p>Pressure: {{ weather.currently.pressure }} mbar</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Currently',
  data () {
    return {
      location: {
        city: null,
        region: null,
        country: null
      },
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
            let locationData = data[0].address_components
            locationData.forEach(element => {
              if (element.types[0] === 'locality') {
                this.location.city = element.long_name
              }
              if (element.types[0] === 'administrative_area_level_1') {
                this.location.region = element.long_name
              }
              if (element.types[0] === 'country') {
                this.location.country = element.long_name
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
    },
    formatDate (date) {
      return moment(date * 1000).format('dddd, MMMM Do')
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
  color: slategray;
}
.loader {
  border: 14px solid #f3f3f3;
  border-radius: 50%;
  border-top: 14px solid #5e5e5e;
  width: 70px;
  height: 70px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  opacity: 0.4;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.row {
  display: flex;
}
.right {
  /* justify-content: right; */
  text-align: right;
}
.weather-container {
  /* min-height: 300px; */
  /* min-width: 800px; */
  padding: 40px 60px;
  background-color: #fff;
  opacity: 0.9;
  /* display: flex;
  flex-direction: row;
  height: 100%; */
}
.icon {
  margin-top: 20px;
}
</style>
