import {Drag} from './drag-core.js';

let activateSlider;

const sliderSection = document.querySelector(`.slider`);
if (sliderSection) {
  const slideList = sliderSection.querySelector(`.slider__list`);
  const slides = slideList.querySelectorAll(`.slider__item`);
  const slideLinks = slideList.querySelectorAll(`.slider__link`);
  const sliderIndicators = sliderSection.querySelectorAll(`.slider__indicator`);
  const prevSlideBtn = sliderSection.querySelector(`.slider__toggle-btn--prev`);
  const nextSlideBtn = sliderSection.querySelector(`.slider__toggle-btn--next`);
  let slideIndex = 0;

  const SLIDES_DIVIDER = 8;
  const slideImg = slides[slideIndex].querySelector(`.slider__image`);

  const getSlideWidth = function () {
    return slideImg.offsetWidth + SLIDES_DIVIDER;
  };

  if (slideIndex === 0) {
    prevSlideBtn.setAttribute(`disabled`, `disabled`);
  }

  const changeSlide = function (newSlideIndex) {
    slideList.removeEventListener(`focusin`, onSlideLinkFocus);

    if (newSlideIndex !== slideIndex) {
      slideLinks[slideIndex].blur();
    }

    switch (true) {
      case newSlideIndex === 0:
        prevSlideBtn.setAttribute(`disabled`, `disabled`);
        break;
      case slideIndex === 0 && newSlideIndex > 0:
        prevSlideBtn.removeAttribute(`disabled`);
        break;
      case newSlideIndex === (slides.length - 1):
        nextSlideBtn.setAttribute(`disabled`, `disabled`);
        break;
      case slideIndex === (slides.length - 1) && newSlideIndex < (slides.length - 1):
        nextSlideBtn.removeAttribute(`disabled`);
        break;
    }

    slideList.style.left = `${-getSlideWidth() * slideIndex}px`;
    slideList.style.transition = `.2s ease-out`;

    slideList.style.left = `${-getSlideWidth() * (newSlideIndex)}px`;
    slides[slideIndex].classList.remove(`slider__item--active`);
    sliderIndicators[slideIndex].classList.remove(`slider__indicator--active`);

    slideIndex = newSlideIndex;

    slides[slideIndex].classList.add(`slider__item--active`);
    sliderIndicators[slideIndex].classList.add(`slider__indicator--active`);

    setTimeout(() => {
      slideLinks[slideIndex].focus();
      slideList.style.transition = ``;
      slideList.addEventListener(`focusin`, onSlideLinkFocus);
    }, 300);
  };

  const onItemSlideEnd = function () {
    const getPositionValue = function () {
      return parseInt(slideList.style.left, 10);
    };

    const increaseSlideIndex = slideIndex + 1;
    const decreaseSlideIndex = slideIndex - 1;
    const TOGGLE_VALUE = 90;
    if (getPositionValue() <= (-getSlideWidth() * slideIndex) - TOGGLE_VALUE) {
      changeSlide(increaseSlideIndex);
    } else if (getPositionValue() >= (-getSlideWidth() * slideIndex) + TOGGLE_VALUE && getPositionValue() !== 0) {
      changeSlide(decreaseSlideIndex);
    } else {
      slideList.style.transition = `0.3s`;
      slideList.style.left = `${-getSlideWidth() * (slideIndex)}px`;
      setTimeout(() => {
        slideList.style.transition = ``;
      }, 400);
    }
  };

  const onContact = function (evt) {
    const START_POINT = 0;
    const getSliderLeft = function () {
      slider.left = getSlideWidth() * (slides.length - 1) - START_POINT;
    };

    const slider = new Drag({
      el: slideList,
      container: slideList,
      startAction: getSliderLeft, // Use "startAction: getSliderLeft" instead of just "left" to fix "slider.left" on media query change.
      finalAction: onItemSlideEnd
    });

    if (evt.target.closest(`.slider__list`)) {
      slider.onEvent(evt);
    }
  };

  const onSlideLinkFocus = function (evt) {
    slideLinks.forEach((link, index) => {
      if (evt.target === link) {
        changeSlide(index);
        slideIndex = index;
      }
    });

    /* Alternative method
    const linksList = Array.from(slideLinks);
    let index = linksList.indexOf(evt.target);
    if (evt.target === linksList[index]) {
      changeSlide(index);
      slideIndex = index;
    } */
  };
  slideList.addEventListener(`focusin`, onSlideLinkFocus);

  const sliderToggles = sliderSection.querySelector(`.slider__toggles`);
  const onSliderToggleClick = function (evt) {
    sliderToggles.removeEventListener(`click`, onSliderToggleClick); // Kinda debounce
    if (evt.target === prevSlideBtn && slideIndex !== 0) {
      changeSlide(slideIndex - 1);
    } else if (evt.target === nextSlideBtn && slideIndex !== (slides.length - 1)) {
      changeSlide(slideIndex + 1);
    }

    setTimeout(() => {
      sliderToggles.addEventListener(`click`, onSliderToggleClick);
    }, 500);
  };

  const addSliderListeners = function () {
    slideList.addEventListener(`touchstart`, onContact, {passive: true});
    slideList.addEventListener(`mousedown`, onContact);

    sliderToggles.addEventListener(`click`, onSliderToggleClick);
  };
  activateSlider = addSliderListeners;
}

export {activateSlider};
