/*
 * angular-datatable - An AngularJS module for creating dynamic bootstrap tables
 *
 * Copyright (c) 2016 Konstantinos Togias - info@ktogias.gr - http://ktogias.gr
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

/* global angular */
angular.module('datatableDemo', ['datatable'])
  .controller('datatableDemoController', ['$scope', 'datatableService', 'filterFilter', function ($scope, datatableService, filterFilter) {
    var demo = this;
    var fields = [
      {title: 'First name', field: 'fname', sortable: true},
      {title: 'Last name', field: 'lname', sortable: true},
      {title: 'Address', field: 'address', sortable: true},
      {title: 'Phone', field: 'phone', sortable: true},
      {title: 'Account', field: 'account', sortable: true},
      {title: 'Balance', field: 'balance', sortable: true}
    ];
    var data = [
      {
        id: 1,
        fname: 'John',
        lname: 'Papas',
        address: '123 Abc Street',
        phone: '1234343232',
        account: '1234/67',
        balance: '34560'
      },
      {
        id: 2,
        fname: 'Nick',
        lname: 'Lepos',
        address: '435 Fert Street',
        phone: '2323454543',
        account: '4323/56',
        balance: '4000'
      },
      {
        id: 3,
        fname: 'Toto',
        lname: 'Loko',
        address: '43 Gout Street',
        phone: '5434567890',
        account: '3245/34/657',
        balance: '25670'
      },
      {
        id: 4,
        fname: 'Harry',
        lname: 'Terponi',
        address: '76 Ferero Street',
        phone: '0967542312',
        account: '1234345-67-09099',
        balance: '400000'
      },
      {
        id: 5,
        fname: 'Terry',
        lname: 'Findi',
        address: '56 Goldo Street',
        phone: '9763829012',
        account: '98392-4949-345',
        balance: '68000'
      },
      {
        id: 6,
        fname: 'Hooter',
        lname: 'Lortis',
        address: '768 Wert Street',
        phone: '9649302978',
        account: '234545/78',
        balance: '54000'
      },
      {
        id: 7,
        fname: 'Lelos',
        lname: 'Fontis',
        address: '12 Jeri Street',
        phone: '5209621906',
        account: '344534-7676-655',
        balance: '19600'
      },
      {
        id: 8,
        fname: 'Antigoni',
        lname: 'Martes',
        address: '65 Sertes Street',
        phone: '1287905434',
        account: '2343456789/564',
        balance: '9800'
      },
      {
        id: 9,
        fname: 'Peter',
        lname: 'Santos',
        address: '345 Xenon Street',
        phone: '9830286712',
        account: '235636-676-45-454',
        balance: '60000'
      }
    ];

    var datatableName = 'customerstable';
    var defaultParams = {
      datatable: {redraw: true},
      sort: {index: 0, field: fields[0], order: 'asc'}
    };

    var watchers = [];

    var params = null;

    var sortFunction = function (a, b) {
      if (params.sort.order === 'asc') {
        return a[params.sort.field.field] > b[params.sort.field.field];
      }
      else {
        return a[params.sort.field.field] < b[params.sort.field.field];
      }
    };

    var loadaedMoreData = false;

    datatableService.setFields(datatableName, fields);

    datatableService.setIdField(datatableName, 'id');

    watchers.push(
      $scope.$on('datatable/ready', function (event, name) {
        if (name === datatableName) {
          if (params === null) {
            params = angular.copy(defaultParams);
          }
          datatableService.setData(datatableName, data.sort(sortFunction).slice(0, 5), $scope, params.datatable);
          datatableService.setSort(datatableName, params.sort, $scope);
          loadaedMoreData = false;
        }
      })
    );

    watchers.push(
      $scope.$on('datatable/setSort', function (event, name) {
        if (name === datatableName) {

          var lastSort = params.sort;
          var newSort = datatableService.getSort(datatableName);
          if (!angular.equals(lastSort, newSort)) {
            params.sort = angular.copy(newSort);
            datatableService.setData(datatableName, data.sort(sortFunction).slice(0, 5), $scope, params.datatable);
            datatableService.scrollTop(datatableName);
            datatableService.setSearch(datatableName, '');
            datatableService.setSelected(datatableName, null, null, $scope);
            loadaedMoreData = false;
          }
        }
      })
    );

    watchers.push(
      $scope.$on('datatable/scrollReachedBottom', function (event, name) {
        if (name === datatableName && !loadaedMoreData) {
          var filteredData = data;
          if (datatableService.getSearch(datatableName)) {
            filteredData = filterFilter(filteredData, datatableService.getSearch(datatableName));
          }
          datatableService.setData(datatableName, filteredData.sort(sortFunction), $scope, params.datatable);
          loadaedMoreData = true;
        }
      })
    );

    watchers.push(
      $scope.$on('datatable/setSearch', function (event, name) {
        if (name === datatableName) {
          datatableService.setData(datatableName, filterFilter(data, datatableService.getSearch(datatableName)).sort(sortFunction).slice(0, 5), $scope, params.datatable);
          datatableService.scrollTop(datatableName);
          datatableService.setSelected(datatableName, null, null, $scope);
          loadaedMoreData = false;
        }
      })
    );

    watchers.push(
      $scope.$on('datatable/updateSelected', function (event, name, options) {
        if (name === datatableName) {
          $scope.selected = datatableService.getSelected(datatableName);
        }
      })
    );

    watchers.push(
      $scope.$on('$destroy', function () {
        for (var w in watchers) {
          watchers[w]();
        }
      })
    );
  }])
;

