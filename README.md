# angular-datatable
An AngularJS module for creating dynamic bootstrap tables

## Demo

[Try it on Plunker] (http://plnkr.co/edit/CpPD56z1BIguJ7eSBfb3?p=preview)

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

##Directive configuration attributes

* name : Unique name used to distinguish between multiple tables in the same application
* title : An optional title that is rendered above the table inside heading element
* container-classes : Container element classes. Container element contains every other element created by angular-datatable
* heading-classes : Heading element classes. Heading element contains the title
* body-classes: Classes for the element that contains the actual table and an optional search box. Do not confuse with html body.
* table-height: The height of the table in pixels
* scroll-for-more: If true events are generated when table scrolling reaches the top or the bottom. Such events can be used to load more data. 
* scroll-for-more-distance: The distance in pixels from top or bottom when the corresponding events are generated.
* show-search: If true a search box is rendered above the table

See demo/index.html for an example of directive config attributes