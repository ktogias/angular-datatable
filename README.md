# angular-datatable
An AngularJS module for creating dynamic bootstrap tables

## Installation

Installation is easy as angular-datatable has minimal dependencies - only the AngularJS (https://angularjs.org), Twitter Bootstrap's CSS (http://getbootstrap.com/css) and FixedHeaderTable jquery plugin (http://www.fixedheadertable.com) are required.

### Angular Requirements
angular-datatable has been tested with Angular 1.5.0

### Bootstrap Requirements
angular-datatable has been tested with Bootstrap CSS 3.3.6

### FixedHeaderTable Requirements
angular-datatable has been tested with FixedHeaderTable 1.3

### Manual installation
After downloading dependencies (or better yet, referencing them from your favorite CDN) you need to download build version of this project. All the files and their purposes are described here:
* datatable.js : The angular module javascript code
* datatable.phtml : The angular template code
* datatable.css : angular-table css
* demo/demo.js : An angular demo application module that uses angular-datatable
* demo/index.html : The index html file for the demo application

## Adding dependency to your project

When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `datatable` AngularJS module:

```js
angular.module('myModule', ['datatable']);
```
