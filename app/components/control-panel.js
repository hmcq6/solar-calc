import Component from '@ember/component';
import { computed } from '@ember/object';
import numeral from 'numeral';

const solarConstant = 1365; // W/m^2

export default Component.extend({
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
    return Math.min(...this.get('points').mapBy('lat'));
  }),

  maxLat: computed('points.[]', function() {
    return Math.max(...this.get('points').mapBy('lat'));
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
    this.sendAction('toggleIsDrawing');
  },

  actions: {
    // Bypass default checkbox behavior and trigger action instead
    triggerMethod(func, event) {
      event.stopPropagation();
      this[func]();
    },

    toggleDraw() {
      this._toggleDraw();
    },

    clearPoints() {
      this.sendAction('clearPoints');
    },

    selectRange(range) {
      this.set('selectedEfficiency', range);
    }
  }
});
