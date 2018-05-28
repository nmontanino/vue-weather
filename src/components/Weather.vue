<template>
  <div v-if="!$store.state.isLoaded" class="loader"></div>

  <div v-else class="weather-container">
    <h1>{{ location.city }}, {{ location.region }}, {{ location.country }}</h1>

    <div class="current">
      <div class="summary">
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
        <!-- <ul>
          <li>Sunrise: {{ moment(weather.daily.data[0].sunriseTime * 1000).format('h:mm a') }}</li>
          <li>Sunset: {{ moment(weather.daily.data[0].sunsetTime * 1000).format('h:mm a') }}</li>
          <li>Dew Point: {{ Math.round(weather.currently.dewPoint) }}&deg;</li>
          <li>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</li>
          <li>Pressure: {{ weather.currently.pressure }} mb</li>
        </ul> -->
        <ul>
          <li>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</li>
          <li>Dew Point: {{ Math.round(weather.currently.dewPoint) }}&deg;</li>
          <li>Wind: {{ weather.currently.windSpeed.toFixed(1) }} {{ windSpeedUnit }}</li>
          <li>Cloud Cover: {{ Math.round(weather.currently.cloudCover * 100) }}%</li>
          <li>Visibility: {{ weather.currently.visibility.toFixed(1) }} {{ distanceUnit }}</li>
        </ul>

        <!-- <div class="sunrise">
          <icon-sunrise></icon-sunrise>
          <div>{{ moment(weather.daily.data[0].sunriseTime * 1000).format('h:mm a') }}</div>
        </div>
        <div class="sunset">
          <icon-sunset></icon-sunset>
          <div>{{ moment(weather.daily.data[0].sunsetTime * 1000).format('h:mm a') }}</div>
        </div> -->

      </div>
    </div>
    <hr>

    <forecast :daily="weather.daily.data"></forecast>
    <app-info></app-info>

  </div>

</template>

<script>
import IconSunrise from '../assets/sunrise.svg'
import IconSunset from '../assets/sunset.svg'
import Forecast from './Forecast.vue'
import AppInfo from './AppInfo.vue'

export default {
  name: 'Weather',
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
    AppInfo
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
    getWeather () {
      // this.$http.get(`${process.env.API_URL.darksky}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
      this.$http.get(`/api/weather?lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
        .then(response => {
          this.weather = response.data
          this.$store.commit('loading', true)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getLocation () {
      // this.$http.get(`${process.env.API_URL.googleMaps}latlng=${this.lat},${this.lon}`)
      this.$http.get(`/api/location?latlng=${this.lat},${this.lon}`)
        .then(response => {
          let locationData = response.data[0].address_components
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
        .catch(error => {
          console.log(error)
        })
    },
    convertUnits (units) {
      this.$store.commit('loading', false)
      if (units === 'us') {
        this.units = 'si'
      } else {
        this.units = 'us'
      }
      this.getWeather()
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
        this.getWeather()
        this.getLocation()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../sass/_loader.scss';
@import '../sass/_vars.scss';

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
  color: $color-secondary;

  &:hover {
    color: $color-hover;
  }
}

.weather-container {
  padding: 40px 45px 25px 45px;
  background-color: #fff;
  opacity: 0.9;
  // min-width: 30%;

  .current {
    display: flex;
    flex-wrap: wrap;

    .summary {
      flex-grow: 1;
    }

    .right {
      align-self: flex-end;
      text-align: right;
      margin-left: 24px;

      ul {
        // min-width: fit-content;
        margin-left: 24px;
        display: inline-block;

        li {
          margin-bottom: 8px;
        }
      }

    }

    .temp {
      padding-top: 12px;
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
//   margin-bottom: 8px;

//   div {
//     font-size: 16px;
//     margin: auto;
//   }

//   svg {
//     margin: 0 4px;
//   }
// }

</style>
