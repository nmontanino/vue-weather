const express = require('express')
const cors = require('cors')
const DarkSky = require('dark-sky')
const keys = require('./keys.js')

const darksky = new DarkSky(keys.darksky)

const app = express()

app.use(cors())

app.get('/weather', (req, res) => {
  let lat = req.query.lat
  let lon = req.query.lon
  let units = req.query.units

  darksky
    .latitude(lat)
    .longitude(lon)
    .units(units)
    .language('en')
    .exclude('minutely,hourly,flags')
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
