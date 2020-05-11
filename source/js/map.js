import {data} from './data.js';

const mapSection = document.querySelector(`.map`);

// Google Map
const initMap = function () {
  const google = window.google;

  const map = new google.maps.Map(document.querySelector(`.map__google`), {
    zoom: 4.78,
    center: {
      lat: 46.8532955,
      lng: 0.8684862
    }
  });

  const styles = [
    {
      'elementType': `geometry`,
      'stylers': [
        {
          'color': `#333333`
        }
      ]
    },
    {
      'elementType': `labels.icon`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'elementType': `labels.text.stroke`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `administrative`,
      'elementType': `geometry`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `administrative.country`,
      'elementType': `labels.text.fill`,
      'stylers': [
        {
          'color': `#737373`
        }
      ]
    },
    {
      'featureType': `administrative.land_parcel`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `administrative.locality`,
      'elementType': `labels.text.fill`,
      'stylers': [
        {
          'color': `#999999`
        }
      ]
    },
    {
      'featureType': `administrative.neighborhood`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `poi`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `poi`,
      'elementType': `labels.text`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `road`,
      'elementType': `labels`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `road`,
      'elementType': `labels.icon`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `road.arterial`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `road.highway`,
      'elementType': `geometry`,
      'stylers': [
        {
          'color': `#484848`
        },
        {
          'weight': 0.1
        }
      ]
    },
    {
      'featureType': `road.highway`,
      'elementType': `labels`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `road.local`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `transit`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
    {
      'featureType': `water`,
      'elementType': `geometry`,
      'stylers': [
        {
          'color': `#1d1d1d`
        }
      ]
    },
    {
      'featureType': `water`,
      'elementType': `labels.text`,
      'stylers': [
        {
          'visibility': `off`
        }
      ]
    },
  ];

  map.setOptions({styles});

  const image = {
    url: `img/icon-map-location-marker.svg`,
    scaledSize: new google.maps.Size(18, 18)
  };

  const imageFocus = {
    url: `img/icon-map-location-marker-focus.svg`,
    scaledSize: new google.maps.Size(18, 18)
  };

  const imageActive = {
    url: `img/icon-map-location-marker-active.svg`,
    scaledSize: new google.maps.Size(18, 18)
  };

  const mapInner = mapSection.querySelector(`.map__inner`);
  const markerA11yTemplate = document.querySelector(`#map-marker-a11y-template`).content.querySelector(`.map__marker`);
  const addMarker = function (markerData) {
    const marker = new google.maps.Marker({
      position: {
        lat: markerData.lat,
        lng: markerData.lng
      },
      map,
      icon: image
    });
    marker.position.country = markerData.country;
    marker.position.city = markerData.city;

    marker.addListener(`click`, function () {
      marker.setIcon(imageActive);
      window.receiveLocalFeed(marker);
      setTimeout(() => {
        marker.setIcon(image);
      }, 500);
    });
    marker.addListener(`mouseover`, function () {
      marker.setIcon(imageFocus);
      const restoreIcon = function () {
        marker.setIcon(image);
        google.maps.event.clearListeners(`mouseout`, restoreIcon);
      };
      marker.addListener(`mouseout`, restoreIcon);
    });

    const markerA11y = markerA11yTemplate.cloneNode(true);
    markerA11y.textContent = markerData.city + `, ` + markerData.country;
    mapInner.appendChild(markerA11y);
    markerA11y.addEventListener(`focus`, () => {
      marker.setIcon(imageFocus);

      const onMarkerA11yClick = function () {
        window.receiveLocalFeed(marker);
      };
      markerA11y.addEventListener(`click`, onMarkerA11yClick);

      const restoreIcon = function () {
        markerA11y.removeEventListener(`click`, onMarkerA11yClick);

        marker.setIcon(image);
        markerA11y.removeEventListener(`blur`, restoreIcon);
      };
      markerA11y.addEventListener(`blur`, restoreIcon);
    });
  };

  const receiveMarkers = function (markers) {
    markers.forEach((marker) => {
      addMarker(marker);
    });
  };

  receiveMarkers(data.mapMarkers);
};

const script = document.createElement(`script`);
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAvMu0zHq9RZh_6OJBRk9_UWrFJ7755J2s&language=en&callback=initMap`;
script.defer = true;

export const activateMap = function () {
  document.head.appendChild(script);
  window.initMap = initMap;
};
