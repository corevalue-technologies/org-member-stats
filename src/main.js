import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Config from './config'

import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/style.scss'

import { SemipolarSpinner } from 'epic-spinners'

Vue.use(Config)

Vue.component('semipolar-spinner', SemipolarSpinner)

axios.interceptors.request.use((config) => {
  let token = '<ACCESS_TOKEN>'
  if (token !== null) {
    config.headers.Authorization = `token ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

new Vue({
  el: '#app',
  render: h => h(App)
})
