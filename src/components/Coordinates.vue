<template>
  <div>
    <h1>Coordinates: {{ lat }}, {{ long }}</h1>
    <h2>Current Temperature: {{ weather.currently.temperature }}</h2>
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
            fetch(`http://localhost:3000?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
              .then(response => {
                console.log(response)
                response.json()
                  .then(data =>{
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
