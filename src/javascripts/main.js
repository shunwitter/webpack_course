import Vue from 'vue';
import VueApp from'./VueApp.vue';

import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

console.log('This is index.js');
my();

new Vue({
  el: '#vue-root',
  render: (h) => h(VueApp),
});
