import Vue from 'vue';
import App from './App';
import store from '../store';
import '../css/tailwind.css';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,

  render: h => h(App),
});
