import Component from '@ember/component';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  googleMapsApi: inject(),
  google: reads('googleMapsApi.google'),

  address: '',
  points: [],

  actions: {
    search(map) {
      const gc = new google.maps.Geocoder();
      gc.geocode(this.getProperties('address'), ([location], status) => {
        const lat = location.geometry.location.lat(),
              lng = location.geometry.location.lng();
        map.panTo({ lat, lng });
      });
    },
    onLoad({ map, _publicAPI}) {
      this.set('map', map);
    },
    onClick({ googleEvent }) {
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
      lines.setMap(this.get('map'));
    }
  }
});
