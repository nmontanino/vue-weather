<template>
  <div v-if="!$store.state.isLoaded" class="loader"></div>

  <div v-else class="weather-container">
    <h1>{{ location }}</h1>

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
        <ul>
          <li>Sunrise: {{ moment(weather.daily.data[0].sunriseTime * 1000).format('h:mm A') }}</li>
          <li>Sunset: {{ moment(weather.daily.data[0].sunsetTime * 1000).format('h:mm A') }}</li>
          <!-- <li>UV Index: {{ weather.currently.uvIndex }}</li> -->
          <li>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</li>
          <li>Pressure: {{ weather.currently.pressure.toFixed(1) }} mb</li>
        </ul>
        <ul>
          <li>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</li>
          <!-- <li>Dew Point: {{ Math.round(weather.currently.dewPoint) }}&deg;</li> -->
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
import Forecast from './Forecast'
import AppInfo from './AppInfo'

export default {
  name: 'Weather',
  data () {
    return {
      location: '',
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
      this.$http.get(`${process.env.API_URL.darksky}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
        .then(response => {
          this.weather = response.data
          this.$store.commit('loaded', true)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getLocation () {
      let formattedLocation = ''
      this.$http.get(`${process.env.API_URL.googleMaps}latlng=${this.lat},${this.lon}`)
        .then(response => {
          let locationData = response.data[0].address_components
          locationData.forEach(element => {
            if (element.types[0] === 'locality') {
              formattedLocation += element.long_name + ', '
            }
            if (element.types[0] === 'administrative_area_level_1') {
              formattedLocation += element.long_name + ', '
            }
            if (element.types[0] === 'country') {
              formattedLocation += element.long_name
            }
          })
          this.location = formattedLocation
        })
        .catch(error => {
          console.log(error)
        })
    },
    convertUnits (units) {
      this.$store.commit('loaded', false)
      if (units === 'us') {
        this.units = 'si'
      } else {
        this.units = 'us'
      }
      this.getWeather()
    }
  },
  created () {
    this.$store.commit('loaded', false)
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
  font-size: 30px;
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

  .current {
    display: flex;
    flex-wrap: wrap;

    .summary {
      flex-grow: 1;
    }

    .right {
      align-self: flex-end;
      display: inline-flex;
      text-align: right;
      flex-wrap: inherit;

      ul {
        margin-left: 24px;

        li {
          margin-bottom: 10px;
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

@media screen and (max-width: 600px) {
  h1, h2 {
    font-size: 24px;
  }

  .weather-container{
    margin: 15px;
  }

  .summary,
  .right {
    text-align: center;
  }

  .right {
    justify-content: center;
    margin: 20px auto 0 auto;

    ul {
      margin-right: 20px;
      text-align: center;
    }
  }
}

</style>
