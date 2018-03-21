import Component from '@ember/component';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

const solarConstant = 136.5, // mW/cm^2
      secondsInYear = 31557600;

export default Component.extend({
  googleMapsApi: inject(),
  google: reads('googleMapsApi.google'),

  classNames: ['col-sm'],

  address: '',
  draw: false,
  points: [],
  _polylines: null,
  _polygon: null,

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

  seasonalPeakPower: computed('area', 'averageLat', function() {
    const peakPercentage = Math.cos((this.get('averageLat') - 23.5) * Math.PI / 180 );
    return solarConstant * peakPercentage * ( this.get('area') / 1000 ) * secondsInYear / 2 / 1000;
  }),

  seasonalMinPower: computed('area', 'averageLat', function() {
    const minPercentage = Math.cos((this.get('averageLat') + 23.5) * Math.PI / 180 );
    return solarConstant * minPercentage * ( this.get('area') / 1000 ) * secondsInYear / 2 / 1000;
  }),

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
    toggleDraw(map) {
      this.toggleProperty('draw');
      map.setOptions({
        draggableCursor: this.get('draw')
          ? 'crosshair'
          : 'grab'
      });
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
    calculate() {
      this.get('_polygon').setMap(this.get('map'));
    },
    onLoad({ map, _publicAPI}) {
      this.set('map', map);
    },
    onClick({ googleEvent }) {
      if (!this.get('draw')) { return; }
      const { latLng } = googleEvent;
      this.get('points').addObject({
        lat: latLng.lat(),
        lng: latLng.lng()
      })
      const lines = new google.maps.Polyline({
        path: this.get('points'),
        geodesic: true,
        strokeColor: 'orange',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      if (this.get('_polylines') !== null) {
        this.get('_polylines').setMap(null);
      }
      this.set('_polylines', lines);
      lines.setMap(this.get('map'));
      const polygon = new google.maps.Polygon({
        paths: this.get('points'),
        geodesic: true,
        strokeColor: 'orange',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: 'black',
        fillOpacity: 0.35
      });
      if (this.get('_polygon') !== null) {
        this.get('_polygon').setMap(null);
      }
      this.set('_polygon', polygon);
    }
  }
});
