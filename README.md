# solar-calc

This README outlines the details how to set up the Solar Calc(ulator) project.

## Prerequisites

You will need the following things properly installed on your computer.

* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)


## Installation

* `git clone <repository-url>` this repository
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

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### 3rd Party Libraries

* `ember-bootstrap`
* `ember-cli-numeral`
* `ember-font-awesome`
* `ember-google-maps`
* `ember-truth-helpers`

## Features/Requirements

 - Display a map
 - Search for address and jump to location
 - Draw polygon on map
 - Display estimated solar power at location

 #### Supports major browsers

Tested working on
 - Chrome 65
 - Safari 11
 - MS Edge
 - Firefox

## Bugs

 - Can not click through polygon, todo - implement click handler (example https://developers.google.com/maps/documentation/javascript/examples/polygon-arrays)

Solved
 - Firefox click event not defined
Fixed with an [update to ember-google-maps](https://github.com/sandydoo/ember-google-maps/commit/6f47dff6fd81556bbd1cc902a45206c21a13ca00). `event` was not defined in the scope of the click event handler.

 ## Features I would like to implement

  - Point marker with "x" icon
  - Click to remove point