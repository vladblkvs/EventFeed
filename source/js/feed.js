import {data} from './data.js';
import {Drag} from './drag-core.js';

const feed = document.querySelector(`.feed`);
const feedList = feed.querySelector(`.feed__list`);

export const recieveNotificationCount = function () {
  const notificationHolders = document.querySelectorAll(`.notification`);
  notificationHolders.forEach((holder) => {
    holder.textContent = data.notificationCount;
    if (!data.notificationCount) {
      holder.style.display = `none`;
    }
  });
};

const renderFeed = function (feedData) {
  const feedItemTemplate = document.querySelector(`#feed-post-template`).content.querySelector(`.feed__item`);
  const feedArtistTemplate = document.querySelector(`#feed-artist-template`).content.querySelector(`.feed__artist`);
  const feedVidDurationTemplate = document.querySelector(`#feed-vid-duration-template`).content.querySelector(`.feed__video-duration`);
  const feedLocationTemplate = document.querySelector(`#feed-location-template`).content.querySelector(`.feed__location`);
  const feedDateTemplate = document.querySelector(`#feed-date-template`).content.querySelector(`.feed__date`);

  feedData.forEach((itemData) => {
    const item = feedItemTemplate.cloneNode(true);
    const image = item.querySelector(`.feed__image`);
    const title = item.querySelector(`.feed__item-title`);
    const link = item.querySelector(`.feed__link`);
    const addition = item.querySelector(`.feed__addition`);

    item.classList.add(`feed__item--` + itemData.type);
    image.src = itemData.image;
    title.textContent = itemData.title;
    link.href = itemData.link;

    if (itemData.bookmark) {
      item.classList.add(`feed__item--bookmarked`);
    }
    if (itemData.new) {
      item.classList.add(`feed__item--new`);
    }
    if (itemData.recommendation) {
      item.classList.add(`feed__item--recommended`);
      const recommend = item.querySelector(`.feed__recommendation`);
      const recommendLink = recommend.querySelector(`.link`);
      recommendLink.textContent = itemData.recommendation.name;
      recommendLink.href = itemData.recommendation.link;
    }
    if (itemData.artist) {
      const artist = feedArtistTemplate.cloneNode(true);
      artist.textContent = itemData.artist;
      addition.appendChild(artist);
    }
    if (itemData.duration) {
      const videoDuration = feedVidDurationTemplate.cloneNode(true);
      videoDuration.textContent = itemData.duration;
      addition.appendChild(videoDuration);
    }
    if (itemData.location) {
      const location = feedLocationTemplate.cloneNode(true);
      location.textContent = itemData.location;
      addition.appendChild(location);
    }
    if (itemData.date) {
      const date = feedDateTemplate.cloneNode(true);
      date.textContent = itemData.date;
      addition.appendChild(date);
    }

    feedList.appendChild(item);
  });

  handleFeedEvents();
};

const handleFeedEvents = function () {

  const onContact = function (evt) {
    const item = evt.target.closest(`.feed__item`);
    const slide = item.querySelector(`.feed__slide`);
    const feedLink = item.querySelector(`.feed__link`);

    const bookmarkBtn = item.querySelector(`.feed__bookmark-btn`);
    bookmarkBtn.addEventListener(`click`, () => {
      item.classList.toggle(`feed__item--bookmarked`);
    });

    const onItemSlideEnd = function () {
      const MIN_SHIFT = 100;
      if (parseInt(slide.style.left, 10) >= MIN_SHIFT) {
        item.classList.toggle(`feed__item--bookmarked`);
      }

      slide.style.transition = `.3s`;
      slide.style.left = 0;
      setTimeout(() => {
        slide.removeAttribute(`style`);
      }, 300);
    };

    const SLIDE_DISTANCE_RIGHT = 128;
    const slider = new Drag({
      el: feedLink,
      container: slide,
      right: SLIDE_DISTANCE_RIGHT,
      finalAction: onItemSlideEnd
    });

    if (evt.target.closest(`.feed__link`)) {
      slider.onEvent(evt);
    }
  };
  feedList.addEventListener(`touchstart`, onContact, {passive: true});
  feedList.addEventListener(`mousedown`, onContact);
};

const activateMapFeed = function () {
  const mapSection = document.querySelector(`.map`);
  const mapFeedBtn = mapSection.querySelector(`.map__control--feed`);
  const feedTitle = feed.querySelector(`.feed__title`);
  const feedSubtitle = feed.querySelector(`.feed__subtitle`);
  const feedCloseBtn = feed.querySelector(`.feed__toggle-btn`);

  const showFeed = function (importedFeed) {
    feedCloseBtn.addEventListener(`click`, onFeedCloseClick);

    renderFeed(importedFeed);
    document.body.classList.add(`no-scroll`);
    feed.classList.add(`feed--show`);

    let feedItems = feed.querySelectorAll(`.feed__item`);
    feedItems[0].classList.add(`feed__item--rounded`);

    feed.addEventListener(`touchstart`, onContact, {passive: true});
    feed.addEventListener(`mousedown`, onContact);
  };

  const onFeedSlide = function () {
    const MIN_SHIFT = 100;
    if (parseInt(feed.style.top, 10) >= MIN_SHIFT && feed.scrollTop === 0) {
      feed.removeEventListener(`touchstart`, onContact);
      feed.removeEventListener(`mousedown`, onContact);
      onFeedCloseClick();
    } else if (parseInt(feed.style.top, 10) < MIN_SHIFT) {
      feed.style.transition = `.3s`;
      feed.style.top = 0;
      setTimeout(() => {
        feed.removeAttribute(`style`);
      }, 300);
    }
  };

  const onContact = function (evt) {

    if (evt.target.closest(`.feed__title-bar`)) {
      const titleBar = feed.querySelector(`.feed__title-bar`);
      const SLIDE_DISTANCE_BOTTOM = feed.offsetHeight;
      const slider = new Drag({
        el: titleBar,
        container: feed,
        bottom: SLIDE_DISTANCE_BOTTOM,
        finalAction: onFeedSlide
      });

      slider.onEvent(evt);
    }
  };

  const onFeedBtnClick = function () {
    showFeed(data.globalEvents);

    feedTitle.textContent = `Events`;
    feedSubtitle.textContent = `${data.eventCount} Upcoming Events`;
  };

  const onFeedCloseClick = function () {
    feed.style.transition = `.6s`;
    feed.style.transform = `translateY(100%)`;

    setTimeout(() => {
      document.body.classList.remove(`no-scroll`);
      feedList.textContent = ``;
      feed.classList.remove(`feed--show`);
      feed.removeAttribute(`style`);
    }, 550);

    feedCloseBtn.removeEventListener(`click`, onFeedCloseClick);
  };

  mapFeedBtn.addEventListener(`click`, onFeedBtnClick);

  window.receiveLocalFeed = function (location) {
    showFeed(data.localEvents);

    feedTitle.textContent = location.position.city;
    feedSubtitle.textContent = location.position.country;
  };
};

export const activateFeed = function () {
  const pageWrapper = document.querySelector(`.page-wrapper`);
  if (pageWrapper.classList.contains(`page-wrapper--main`)) {
    renderFeed(data.generalFeed);
  }
  if (pageWrapper.classList.contains(`page-wrapper--map`)) {
    activateMapFeed();
  }
};
