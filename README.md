# solar-calc

This README outlines the details of how to set up the Solar Calc(ulator) project. Solar Calc is a simple tool to estimate the excpected nominal solar power of a given area.


### Assumptions

The potential nominal solar power of a given area is calculated by multiplying the area in meters by the Solar Constant. The Solar Constant is the average solar radiation fluctuation through a circular projection of the earth. This provides a solid prediction of the total solar power for a given area.

Next, estimation the estimation is refined by calculating what percentage of the light hits the drawn solar panel directly. Using the information given by https://www.grc.nasa.gov/www/k-12/Numbers/Math/Mathematical_Thinking/sun12.htm , Solar Calc calculates the potential minimum and maximum angles between a given latitude on earth and the sun. Using these equations Solar Calc will return an estimate of 1300W/m^2, pretty close to the accepted solar potential per square meter.

Finally, to calculate the consumers expected nominal power, multiply the solar potential by the expected solar panel efficiency (inputted manually by user).

Under the best conditions the calculator estimates roughly 250W/m^2.

## Prerequisites

You will need the following things properly installed on your computer.

* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)


## Installation

* `git clone git@github.com:hmcq6/solar-calc.git` this repository
* `cd solar-calc`
* `npm install`
* Add your google maps key to `config/environments.js`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

* `ember test`
* `ember test --server`

### 3rd Party Libraries

* [`ember-bootstrap`](http://www.ember-bootstrap.com/)
* [`ember-cli-numeral`](https://github.com/josemarluedke/ember-cli-numeral)
* [`ember-font-awesome`](https://github.com/martndemus/ember-font-awesome)
* [`ember-google-maps`](https://github.com/sandydoo/ember-google-maps)
* [`ember-truth-helpers`](https://github.com/jmurphyau/ember-truth-helpers)

## Features/Requirements

 - Display a map
 - Search for address and jump to location
 - Draw polygon on map
 - Display estimated solar power at location

Bonus

 - Minimal testing

 #### Supports major browsers

Tested working on
 - Chrome 65
 - Safari 11
 - MS Edge
 - Firefox

## Bugs

Solved

 - Firefox click event not defined
Fixed with an [update to ember-google-maps](https://github.com/sandydoo/ember-google-maps/commit/6f47dff6fd81556bbd1cc902a45206c21a13ca00). `event` was not defined in the scope of the click event handler.
 - Can not click through polygon, todo - implement click handler (example https://developers.google.com/maps/documentation/javascript/examples/polygon-arrays)

 ## Features I would like to implement

  - Point marker with "x" icon
  - Click to remove point
