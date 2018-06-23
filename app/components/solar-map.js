import Component from '@ember/component';

export default Component.extend({
  classNames: ['col', 'solar-map'],

  points: [],
  _polylines: null,
  _polygon: null,

  isDrawing: true,

  _drawPolygon() {
    const polygon = this.get('_polygon');

    if (polygon !== null) {
      polygon.setMap(this.get('map'));

      google.maps.event.removeListener(this.get('_polygonListener'));
      this.set('_polygonListener',
        polygon.addListener('click', (googleEvent) => {
          this._onClick({ googleEvent });
        })
      );
    }
  },

  _onClick({ googleEvent }) {
    const { latLng: { lat, lng } } = googleEvent;

    // Add new point
    this.get('points').addObject({
      lat: lat(),
      lng: lng()
    })

    const paths = Object.assign(
            { path: this.get('points') },
            {
              geodesic: true,
              strokeColor: 'orange',
              strokeOpacity: 1.0,
              strokeWeight: 3,
              fillColor: 'black',
              fillOpacity: 0.35
            },
          ),
          // Calculate polylines from points
          lines = new google.maps.Polyline(paths),
          // Calculate polygon from points
          polygon = new google.maps.Polygon(paths);

    this.clearMap();

    this.set('_polylines', lines);
    this.set('_polygon', polygon);

    // Add polylines to map
    lines.setMap(this.get('map'));

    // add polygon to map and attach click handler
    this._drawPolygon();
  },

  clearMap() {
    // Remove polylines and polygon if any exist
    ['_polylines', '_polygon'].
      filter((property) => this.get(property) !== null).
      forEach((property) => {
        this.get(property).setMap(null);
      });
  },

  actions: {
    onLoad({ map, _publicAPI }) {
      this.set('map', map);
      this.send('_updateCursor', this.get('isDrawing'));
    },

    clearPoints() {
      this.clearMap();
      this.setProperties({
        points: [],
        _polylines: null,
        _polygon: null
      });
    },

    _updateCursor(isDrawing) {
      this.get('map').setOptions({
        draggableCursor: isDrawing ? 'crosshair' : 'move'
      });
    },

    toggleIsDrawing() {
      this.toggleProperty('isDrawing');
      this.send('_updateCursor', this.get('isDrawing'));
    },

    onClick({ googleEvent }) {
      if (!this.get('isDrawing')) { return; }
      this._onClick({ googleEvent });
    }
  }
});
