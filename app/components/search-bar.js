import Component from '@ember/component';

export default Component.extend({
  address: '',

  searchByAddress() {
    // Wraps geocode results in a promise
    return new Promise((resolve, reject) => {
      (new google.maps.Geocoder()).geocode(
        this.getProperties('address'),
        function(results, status) {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        }
      );
    });
  },

  actions: {
    async search() {
      const [{ geometry: { location: { lat, lng } } }] = await this.searchByAddress();
      this.get('map').panTo({
        lat: lat(),
        lng: lng()
      });
    }
  }
});
