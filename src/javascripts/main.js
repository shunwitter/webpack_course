import Vue from 'vue';
import VueApp from'./VueApp.vue';

import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

import add from './add.ts';

console.log(add(3, 9));
console.log('This is index.js');
my();

new Vue({
  el: '#vue-root',
  render: (h) => h(VueApp),
});
