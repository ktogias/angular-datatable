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

##Service API

angular-datatable provides datatableService angular service that provides the following methods:
* setFields(name, someFields) : Sets the fields array. name is the unique name of this datatable. 
    The someFields is an array of objects of the form 
    ```js    
    {title: string, field: string, sortable: boolean}
    ```
* getFields(name) : Returns the fields array. name is the unique name of this datatable. 
* setData(name, someData, $scope, params) : Set the data array. 
    The data array is an array of objects of the type 
    ```js    
    {field1name: data, field2name: data, ...}
    ```
    $scope is used for broadcasting a datatable/reloadData event after setting the data
    params is an object with extra parameters. Currently only boolean params.redraw is used for forcing an redraw of the table after setting data.
* getData(name) : Returns the data array
* setSort(name, someSort, $scope) : Sets the sorting of the table.
    someSort object is of the form
    ```js    
    {index: number, field: a field object(see setFields), order: 'asc'||'desc'}
    ```
    A datatable/setSort event is broadcasted to $scope if provided.
* getSort(name) : Returns the sort object
* setIdField(name, fieldName) : Set the filed that is used to identify data rows
* getIdField(name) : Get the id field
* setSelected(name, index, id, $scope, options) : Set the selected row
    index: The index of the selected row
    id: The id of the selected data item (see setIdField)
    $scope: A datatable/updateSelected event will be broadcasted on this scope
    options: This object will be passed with the datatable/updateSelected
* getSelected(name) : Returns the selected data item as an object of the following form
    ```js    
    {index: number, id: mixed, dataItem: the data item object }
    ```
* setDatatableScope(name, scope): Set the datatable scope. This is the datatable module scope used for emiting events.
* getDatatableScope(name) : Returns the datatable scope
* setSearch(name, asearch, $scope) : Sets the search box contents to the asearch string. A datatable/setSearch event is broadcasted on $scope.  
* getSearch(name) : Returns the search string
* waitForData(name, where) : Used to notify datatable that we are waiting for table data. 
    Used to stop repeating datatable/scrollReachedTop and datatable/scrollReachedBottom events while waiting for data from an asynchronous call.
    where is 'top' or 'bottom'.
* getWaitForData(name) : Returns an object of the form:
    ```js    
    {status: boolean, where: 'top'||'bottom'}
    ```
* scrollTop(name) : Scrolls the table at top