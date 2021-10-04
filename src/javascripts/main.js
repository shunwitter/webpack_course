import './reactApp.jsx';
import '../stylesheets/main.scss';


import lax from 'lax.js';
window.onload = function () {
  window.lax = { presets: lax.presets }
  lax.init();
  console.log('lax initialized');
  // Add a driver that we use to control our animations
  lax.addDriver('scrollY', function () {
    return window.scrollY;
  });
}
