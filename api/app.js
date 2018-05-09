const express = require('express')
const cors = require('cors')
const keys = require('./keys.js')

const DarkSky = require('dark-sky')
const darksky = new DarkSky(keys.darksky)

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  let lat = req.query.lat
  let lon = req.query.lon
  darksky
      .latitude(lat)
      .longitude(lon)
      .time('2016-01-28')
      .units('us')
      .language('en')
      .exclude('minutely,daily')
      .extendHourly(true)
      .get()
      .then(response => {
        res.send(response)
      })
      .catch(error => {
        res.send(error)
      })
})

app.listen(3000, function () {
  console.log('> Starting API server...')
  console.log('> Listening at http://localhost:' + this.address().port)
})

module.exports = app
