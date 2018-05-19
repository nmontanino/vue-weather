<template>
  <div class="loader" v-if="!isLoaded"></div>

  <div class="weather-container" v-else>
    <h1>{{ location.city }}, {{ location.region }}, {{ location.country }}</h1>
    <div class="row">
      <div>
        <h2>{{ formatTime(weather.currently.time, 'dddd, MMMM Do') }}</h2>
        <h2>{{ weather.currently.summary }}</h2>
        <div class="temp">
          <skycon :condition="weather.currently.icon"></skycon>
          <div>{{ Math.round(weather.currently.temperature) }}</div>
          <span class="convert" v-if="units === 'us'" @click="convertUnits('us')">&deg;F</span>
          <span class="convert" v-if="units === 'si'" @click="convertUnits('si')">&deg;C</span>
        </div>

        <!-- TODO: Align sunrise and sunset icons to time -->
        <!-- <div class="sunrise">
          <IconSunrise></IconSunrise>
          <p>{{ formatTime(weather.daily.data[0].sunriseTime, 'h:mm a') }}</p>
        </div>
        <div class="sunset">
          <IconSunset></IconSunset>
          <p>{{ formatTime(weather.daily.data[0].sunsetTime, 'h:mm a') }}</p>
        </div> -->
      </div>

      <div class="right">
        <p>Humidity: {{ Math.round(weather.currently.humidity * 100) }}%</p>
        <p>Dew Point: {{ Math.round(weather.currently.dewPoint) }}&deg;</p>
        <p>
          Wind: {{ weather.currently.windSpeed }}
          <span v-if="units === 'us'">mph</span>
          <span v-if="units === 'si'">m/s</span>
        </p>
        <p>Precipitation: {{ Math.round(weather.currently.precipProbability * 100) }}%</p>
        <!-- <p>Pressure: {{ weather.currently.pressure }} mbar</p> -->
      </div>
    </div>

    <hr>

    <!-- TODO: Move daily forecast into its own vue component -->
    <div class="row">
      <div class="forecast-container" v-for="(day, index) in weather.daily.data" :key="index">
        <p>{{ formatTime(day.time, 'ddd') }}</p>
        <skycon :condition="day.icon" :width="42" :height="42"></skycon>
        <p>{{ Math.round(day.temperatureMax) }}&deg;</p>
        <p>{{ Math.round(day.temperatureMin) }}&deg;</p>
      </div>
    </div>
  </div>

</template>

<script>
import IconSunrise from '../assets/sunrise.svg'
import IconSunset from '../assets/sunset.svg'
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
  components: {
    IconSunrise,
    IconSunset
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
      this.isLoaded = false
      if (units === 'us') {
        this.units = 'si'
      } else {
        this.units = 'us'
      }
      this.getCurrentWeather()
    },
    formatTime (date, format) {
      return moment(date * 1000).format(format)
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
  padding: 40px 50px;
  background-color: #fff;
  opacity: 0.9;

  .row {
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

.forecast-container {
  text-align: center;

  p:last-child {
    opacity: 0.5;
    margin-top: 0.25em;
  }

  &:last-child {
    display: none;
  }

  canvas {
    margin: 8px 0;
  }
}

// .sunrise,
// .sunset {
//   display: inline-flex;
// }

</style>
