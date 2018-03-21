import Component from '@ember/component';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  googleMapsApi: inject(),
  google: reads('googleMapsApi.google'),

  classNames: ['col-sm'],

  address: '',
  draw: false,
  points: [],
  _polylines: null,
  _polygon: null,

  actions: {
    search(map) {
      const gc = new google.maps.Geocoder();
      gc.geocode(this.getProperties('address'), ([location], status) => {
        const lat = location.geometry.location.lat(),
              lng = location.geometry.location.lng();
        map.panTo({ lat, lng });
      });
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
      if (this.get('_polylines') !== null) {
        this.get('_polylines').setMap(null);
        this.set('_polylines', null);
      }
      if (this.get('_polygon') !== null) {
        this.get('_polygon').setMap(null);
        this.set('_polygon', null);
      }
    },
    drawBoundingBox() {
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
      polygon.setMap(this.get('map'));
    },
    calculate() {
      const solarConstant = 136.5, // mW/cm^2
            secondsInYear = 31557600,
            area = google.maps.geometry.spherical.computeArea(this.get('_polygon').getPath()),
            lat = this.get('points').reduce(
              ({ min, max }, cur) => ({ min: Math.min(cur.lat, min), max: Math.max(cur.lat, max) }),
              { min: Infinity, max: -Infinity }
            ),
            averageLat = (lat.min + lat.max) / 2,
            peakPercentage = Math.cos((averageLat - 23.5) * Math.PI / 180 ),
            minPercentage = Math.cos((averageLat + 23.5) * Math.PI / 180 ),
            peakPower = solarConstant * peakPercentage * ( area / 1000 ) * secondsInYear / 2 / 1000,
            minPower = solarConstant * minPercentage * ( area / 1000 ) * secondsInYear / 2 / 1000;
    },
    onLoad({ map, _publicAPI}) {
      this.set('map', map);
    },
    onClick({ googleEvent }) {
      if (!this.get('draw')) { return; }
      const { latLng } = googleEvent;
      this.get('points').push({
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
    }
  }
});
