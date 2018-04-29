<template>
  <div>
    <h1>{{ lat }}, {{ long }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Coordinates',
  data () {
    return {
      lat: null,
      long: null
    }
  },
  methods: {
    getCoordinates (position) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude
          this.long = position.coords.longitude
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
