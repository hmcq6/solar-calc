import Component from '@ember/component';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import numeral from 'numeral';

const solarConstant = 1365; // W/m^2

export default Component.extend({
  googleMapsApi: inject(),
  google: reads('googleMapsApi.google'),

  classNames: ['col', 'solar-map'],

  address: '',
  draw: false,
  isBoundingBoxShown: false,
  isClearDisabled: computed.equal('_polylines', null),
  points: [],
  _polylines: null,
  _polygon: null,

  selectedEfficiency: computed.oneWay('solarEfficiencyRanges.firstObject'),

  solarEfficiencyRanges: '15% 16% 17% 18% 19% 20% 21% 22%'.w(),

  area: computed('_polygon', function() {
    if (this.get('_polygon') === null) { return 0; }
    return google.maps.geometry.spherical.computeArea(this.get('_polygon').getPath());
  }),

  minLat: computed('points.[]', function() {
    return this.get('points').reduce(
      (min, cur) => Math.min(min, cur.lat),
      Infinity
    );
  }),

  maxLat: computed('points.[]', function() {
    return this.get('points').reduce(
      (max, cur) => Math.max(max, cur.lat),
      -Infinity
    );
  }),

  averageLat: computed('{min,max}Lat', function() {
    return (this.get('minLat') + this.get('maxLat')) / 2;
  }),

  // Power is determined by the Solar Constant (1365 W/m^2) multiplied by
  // the cosine of the angle between the plotted area on earth and the sun
  // multiplied by the size of the plotted area in m^2
  // all multiplied by the expected efficiency


  seasonalPeakPower: computed('area', 'averageLat', 'selectedEfficiency', function() {
    const efficiency = numeral(this.get('selectedEfficiency')).value(),
          peakPercentage = Math.cos(
      // Its commonly accepted that the sun moves about 23.5 degrees north and
      // south each year, so 23.5 is used as the maximum variance between seasons
      (this.get('averageLat') - 23.5)
      // Math.cos expects radians. 1π rad = 180˚, so ans in rads = num of ˚ times π / 180
      * Math.PI / 180
    );
    return solarConstant * peakPercentage * this.get('area') * efficiency;
  }),

  seasonalMinPower: computed('area', 'averageLat', 'selectedEfficiency', function() {
    const efficiency = numeral(this.get('selectedEfficiency')).value(),
          minPercentage = Math.cos((this.get('averageLat') + 23.5) * Math.PI / 180 );
    return solarConstant * minPercentage * this.get('area') * efficiency;
  }),

  _toggleDraw() {
    this.toggleProperty('draw');
    this.get('map').setOptions({
      draggableCursor: this.get('draw')
        ? 'crosshair'
        : 'grab'
    });
  },

  _toggleBoundingBox() {
    this.toggleProperty('isBoundingBoxShown');
    if (this.get('_polygon') !== null) {
      this.get('_polygon').setMap(
        this.get('isBoundingBoxShown')
          ? this.get('map')
          : null
      );
    }
  },

  actions: {
    search(map) {
      (new google.maps.Geocoder()).geocode(
        this.getProperties('address'),
        ([res], status) => {
          const { location } = res.geometry;
          map.panTo({
            lat: location.lat(),
            lng: location.lng()
          });
        }
      );
    },
    triggerMethod(func, event) {
      event.stopPropagation();
      this[func]();
    },
    toggleDraw() {
      this._toggleDraw();
    },
    clearPoints() {
      this.set('points', []);
      ['_polylines', '_polygon'].forEach((property) => {
        if (this.get(property) !== null) {
          this.get(property).setMap(null);
          this.set(property, null);
        }
      });
    },
    toggleBoundingBox() {
      this._toggleBoundingBox();
    },
    selectRange(range) {
      this.set('selectedEfficiency', range);
    },
    onLoad({ map, _publicAPI}) {
      this.set('map', map);
    },
    onClick({ googleEvent }) {
      if (!this.get('draw')) { return; }
      const { latLng } = googleEvent,
            mapDefaults = {
              geodesic: true,
              strokeColor: 'orange',
              strokeOpacity: 1.0,
              strokeWeight: 3,
              fillColor: 'black',
              fillOpacity: 0.35
            };
      this.get('points').addObject({
        lat: latLng.lat(),
        lng: latLng.lng()
      })
      const lines = new google.maps.Polyline(
        Object.assign({ path: this.get('points') }, mapDefaults)
      );
      if (this.get('_polylines') !== null) {
        this.get('_polylines').setMap(null);
      }
      this.set('_polylines', lines);
      lines.setMap(this.get('map'));
      const polygon = new google.maps.Polygon(
        Object.assign({ paths: this.get('points') }, mapDefaults)
      );
      if (this.get('_polygon') !== null) {
        this.get('_polygon').setMap(null);
      }
      this.set('_polygon', polygon);
      if (this.get('isBoundingBoxShown')) {
        polygon.setMap(this.get('map'));
      }
    }
  }
});
