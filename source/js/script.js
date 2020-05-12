import {activateSlider} from './promo-slider.js';
import {activateFeed} from './feed.js';
import {recieveNotificationCount} from './feed.js';
import {activateMap} from './map.js';

recieveNotificationCount();

if (document.querySelector(`.slider`)) {
  activateSlider();
}

if (document.querySelector(`.feed`)) {
  activateFeed();
}

if (document.querySelector(`.map`)) {
  activateMap();
}
