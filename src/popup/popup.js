import Vue from 'vue';
import VueFeather from 'vue-feather';
import App from './App';
import store from '../store';
import '../css/tailwind.css';

Vue.use(VueFeather);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,

  render: h => h(App),
});
