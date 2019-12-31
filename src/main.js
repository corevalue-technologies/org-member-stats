import Vue from 'vue'
import App from './App.vue'
import Config from './config'

import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/style.scss'

import { SemipolarSpinner } from 'epic-spinners'

Vue.use(Config)

Vue.component('semipolar-spinner', SemipolarSpinner)

new Vue({
  el: '#app',
  render: h => h(App)
})
