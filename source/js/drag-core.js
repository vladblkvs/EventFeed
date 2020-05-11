class Coords {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const onСontactStart = function (evt, slide) {
  if (slide.startAction !== null) {
    slide.startAction();
  }

  const startCoords = new Coords(evt.clientX, evt.clientY);
  let dragged = false;
  const onMove = function (moveEvt) {
    dragged = true;

    if (moveEvt.type === `touchmove`) {
      document.body.classList.add(`no-refresh`);

      moveEvt.clientX = moveEvt.touches[0].clientX;
      moveEvt.clientY = moveEvt.touches[0].clientY;
    }

    const shift = new Coords((startCoords.x - moveEvt.clientX), (startCoords.y - moveEvt.clientY));

    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;

    const currentPosition = new Coords((slide.container.offsetLeft - shift.x), (slide.container.offsetTop - shift.y));
    if (currentPosition.x >= -slide.left && currentPosition.x <= slide.right) {
      slide.container.style.left = `${currentPosition.x}px`;
    }
    if (currentPosition.y >= -slide.top && currentPosition.y <= slide.bottom) {
      slide.container.style.top = `${(currentPosition.y)}px`;
    }

    if (slide.moveAction !== null) {
      slide.moveAction();
    }
  };

  const onСontactEnd = function (endEvt) {
    document.removeEventListener(`mousemove`, onMove);
    document.removeEventListener(`touchmove`, onMove);
    document.removeEventListener(`mouseup`, onСontactEnd);
    document.removeEventListener(`touchend`, onСontactEnd);

    if (dragged) {
      if (endEvt.type === `mouseup`) {
        const onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          slide.el.removeEventListener(`click`, onClickPreventDefault);
        };

        slide.el.addEventListener(`click`, onClickPreventDefault);
      }

      if (slide.finalAction !== null) {
        slide.finalAction();
      }
    }
    document.body.classList.remove(`no-refresh`);
  };

  if (evt.type === `touchstart`) {
    document.addEventListener(`touchmove`, onMove, {passive: true});
    document.addEventListener(`touchend`, onСontactEnd, {passive: true});
  } else if (evt.type === `mousedown`) {
    document.addEventListener(`mousemove`, onMove);
    document.addEventListener(`mouseup`, onСontactEnd);
  }
};

export class Drag {
  constructor(options) {
    this.el = this._getOption(options.el);
    this.container = this._getOption(options.container);
    this.left = this._getOption(options.left);
    this.right = this._getOption(options.right);
    this.top = this._getOption(options.top);
    this.bottom = this._getOption(options.bottom);
    this.startAction = this._getOption(options.startAction);
    this.moveAction = this._getOption(options.moveAction);
    this.finalAction = this._getOption(options.finalAction);
  }

  onEvent(evt) {
    const slide = this;

    if (evt.type === `touchstart`) {
      document.body.classList.add(`no-refresh`);
    } else if (evt.type === `mousedown`) {
      evt.preventDefault();
    }
    onСontactStart(evt, slide);
  }

  _getOption(option) {
    if (option === undefined) {
      option = null;
    }
    return option;
  }
}
