import {activateFeed} from './feed.js';
import {recieveNotificationCount} from './feed.js';

recieveNotificationCount();

if (document.querySelector(`.feed`)) {
  activateFeed();
}
