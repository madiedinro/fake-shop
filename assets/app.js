
// js

import Promise from 'promise-polyfill';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

import 'whatwg-fetch';
import './js/scripts';

// css

import './scss/styles.scss';
