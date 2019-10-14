import Vue from 'vue';
import VueFeather from 'vue-feather';
import App from './App';
import store from '../store';
import '../css/tailwind.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';

Vue.use(PerfectScrollbar);
Vue.use(VueFeather);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,

  render: h => h(App),
});
