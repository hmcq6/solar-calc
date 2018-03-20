import Component from '@ember/component';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  googleMapsApi: inject(),
  google: reads('googleMapsApi.google'),

  address: '',
  draw: false,
  points: [],
  _polylines: null,

  actions: {
    search(map) {
      const gc = new google.maps.Geocoder();
      gc.geocode(this.getProperties('address'), ([location], status) => {
        const lat = location.geometry.location.lat(),
              lng = location.geometry.location.lng();
        map.panTo({ lat, lng });
      });
    },
    toggleDraw() {
      this.toggleProperty('draw');
    },
    clearPoints() {
      this.set('points', []);
      this.get('_polylines').setMap(null);
      this.set('_polylines', null);
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
