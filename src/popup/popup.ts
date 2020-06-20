import Vue from 'vue';
import VueFeather from 'vue-feather';
import VueI18n from 'vue-i18n';
import App from './App';
import store from '../store';
import localeMessages from '../_locales';
import '../css/tailwind.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';

Vue.use(PerfectScrollbar);
Vue.use(VueFeather);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: browser.i18n.getUILanguage(),
  fallbackLocale: {
    'zh-CN': ['zh_CN'],
    default: ['en'],
  },
  messages: localeMessages,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  render: h => h(App),
});
