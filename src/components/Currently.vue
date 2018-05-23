<template>
  <div v-if="!$store.state.isLoaded" class="loader"></div>

  <div v-else class="weather-container">
    <h1>{{ location.city }}, {{ location.region }}, {{ location.country }}</h1>

    <div class="current">
      <div>
        <h2>{{ moment(weather.currently.time * 1000).format('dddd, MMMM Do') }}</h2>
        <h2>{{ weather.currently.summary }}</h2>
        <div class="temp">
          <skycon :condition="weather.currently.icon"></skycon>
          <div>{{ Math.round(weather.currently.temperature) }}</div>
          <span class="convert" v-if="units === 'us'" @click="convertUnits('us')">&deg;F</span>
          <span class="convert" v-if="units === 'si'" @click="convertUnits('si')">&deg;C</span>
        </div>
      </div>

      <div class="right">
        <p>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</p>
        <!-- <p>Dew Point: {{ Math.round(weather.currently.dewPoint) }}&deg;</p> -->
        <p>Wind: {{ weather.currently.windSpeed.toFixed(1) }} {{ windSpeedUnit }}</p>
        <p>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</p>
        <!-- <p>Pressure: {{ weather.currently.pressure }} mb</p> -->
        <p>Visibility: {{ weather.currently.visibility.toFixed(1) }} {{ distanceUnit }}</p>
      </div>
    </div>

    <hr>

    <forecast :weather="weather.daily.data"></forecast>
    <info></info>

  </div>

</template>

<script>
import IconSunrise from '../assets/sunrise.svg'
import IconSunset from '../assets/sunset.svg'
import Forecast from './Forecast.vue'
import Info from './Info.vue'

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
      units: 'si'
    }
  },
  components: {
    IconSunrise,
    IconSunset,
    Forecast,
    Info
  },
  computed: {
    windSpeedUnit () {
      if (this.units === 'us') {
        return 'mph'
      } else {
        return 'm/s'
      }
    },
    distanceUnit () {
      if (this.units === 'us') {
        return 'miles'
      } else {
        return 'km'
      }
    }
  },
  methods: {
    getCurrentWeather () {
      fetch(`${process.env.API_URL.darksky}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
        .then(response => {
          if (response.ok) {
            response.json()
              .then(data => {
                this.weather = data
                this.$store.commit('loading', true)
              })
          }
        })
        .catch(error => {
          console.log(error)
          alert('Failed to connect to the API')
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
      this.$store.commit('loading', false)
      if (units === 'us') {
        this.units = 'si'
      } else {
        this.units = 'us'
      }
      this.getCurrentWeather()
    }
  },
  created () {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        if (navigator.language === 'en-US') {
          this.units = 'us'
        }
        this.lat = position.coords.latitude
        this.lon = position.coords.longitude
        this.getCurrentWeather()
        this.getLocation()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../sass/_loader.scss';

h1 {
  font-size: 28px;
  margin-bottom: 1rem;
}

h2 {
  font-size: 18px;
  margin-bottom: 8px;
}

.convert {
  cursor: pointer;
  color: slategray;

  &:hover {
    color:  rgb(89, 119, 150);
  }
}

.weather-container {
  padding: 40px 50px 20px 50px;
  background-color: #fff;
  opacity: 0.9;

  .current {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    min-width: 475px;

    .right {
      text-align: right;

      p {
        margin-bottom: 10px;
      }
    }

    .temp {
      padding-top: 8px;
      font-size: 64px;
      display: inline-flex;

      span {
        font-size: 36px;
      }

      canvas {
        margin-right: 8px;
      }
    }
  }

  hr {
    opacity: 0.2;
    margin: 16px 0 24px 0;
  }
}

// .sunrise,
// .sunset {
//   display: inline-flex;
// }

</style>
