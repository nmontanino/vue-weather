import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// TODO: Set this up so the forecast component can get state data from the store

export default new Vuex.Store({
//   state: {
//     weather: {},
//     units: 'si',
//     lat: null,
//     long: null,
//     isLoaded: false
//   },
//   actions: {
//     getWeather ({commit}) {
//       fetch(`${process.env.API_URL.darksky}lat=${this.lat}&lon=${this.lon}&units=${this.units}`)
//         .then(response => {
//           console.log(response)
//           response.json()
//             .then(data => {
//               commit(data)
//             })
//         })
//         .catch(error => {
//           console.log(error)
//         })
//     },
//   },
//   mutations: {
//     setWeather () {
//
//     }
//   },
//   strict: process.env.NODE_ENV !== 'production'
})
