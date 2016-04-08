/*
 * angular-datatable - An AngularJS module for creating dynamic bootstrap tables
 *
 * Copyright (c) 2016 Konstantinos Togias - info@ktogias.gr - http://ktogias.gr
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length - 1].src;

/* global angular */
angular.module('datatable', [])
  .factory('datatableService', [function () {
    var fields = {};
    var data = {};
    var sort = {};
    var idField = {};
    var selected = {};
    var search = {};
    var datatableScope = {};
    var waitForDataObj = {};

    function setFields(name, someFields) {
      fields[name] = someFields;
    }

    function getFields(name) {
      return fields[name];
    }

    function setData(name, someData, $scope, params) {
      data[name] = someData;
      waitForDataObj = {status: false};
      if (typeof $scope !== 'undefined') {
        $scope.$broadcast('datatable/reloadData', name, params);
      }
    }

    function getData(name) {
      return data[name];
    }

    function setSort(name, someSort, $scope) {
      if (!someSort.field) {
        someSort.field = fields[someSort.index];
      }
      if (!someSort.order) {
        someSort.order = 'asc';
      }
      sort[name] = someSort;
      //datatableScope[name].$broadcast('datatable/setSort', name);
      if (typeof $scope === 'undefined') {
        datatableScope[name].$emit('datatable/setSort', name);
      }
      else {
        $scope.$broadcast('datatable/setSort', name);
      }
    }

    function getSort(name) {
      return sort[name];
    }

    function setIdField(name, fieldName) {
      idField[name] = fieldName;
    }

    function getIdField(name) {
      return idField[name];
    }

    function setSelected(name, index, id, $scope, options) {
      if (typeof index === 'undefined' || index === null) {
        selected[name] = {index: null, id: null, dataItem: null};
      }
      else {
        if (typeof id === 'undefined' || id === null) {
          selected[name] = {index: parseInt(index, 10), id: null, dataItem: null};
        }
        else {
          var selectedItem;
          if (data[name][index][idField] === id) {

            selectedItem = data[name][index];
          }
          else {
            for (var i in data[name]) {
              if (String(data[name][i][idField[name]]) === String(id)) {
                selectedItem = data[name][i];
                break;
              }
            }
          }
          selected[name] = {index: parseInt(index), id: id, dataItem: selectedItem};
        }
      }
      if (typeof $scope === 'undefined') {
        datatableScope[name].$emit('datatable/updateSelected', name, options);
      }
      else {
        $scope.$broadcast('datatable/updateSelected', name, options);
      }
    }

    function getSelected(name) {
      return selected[name];
    }

    function setDatatableScope(name, scope) {
      datatableScope[name] = scope;
    }

    function getDatatableScope(name) {
      return datatableScope[name];
    }

    function setSearch(name, asearch, $scope) {
      search[name] = asearch;
      if (typeof $scope === 'undefined') {
        datatableScope[name].$emit('datatable/setSearch', name);
      }
      else {
        $scope.$broadcast('datatable/setSearch', name);
      }
    }

    function getSearch(name) {
      return search[name];
    }

    function waitForData(name, where) {
      waitForDataObj[name] = {status: true, where: where};
      datatableScope[name].$broadcast('datatable/waitForData', name, where);
    }

    function getWaitForData(name) {
      return waitForDataObj[name];
    }

    function scrollTop(name) {
      datatableScope[name].$broadcast('datatable/scrollTop', name);
    }

    return {
      setFields: setFields,
      getFields: getFields,
      setData: setData,
      getData: getData,
      setSort: setSort,
      getSort: getSort,
      setIdField: setIdField,
      getIdField: getIdField,
      setSelected: setSelected,
      getSelected: getSelected,
      setDatatableScope: setDatatableScope,
      getDatatableScope: getDatatableScope,
      setSearch: setSearch,
      getSearch: getSearch,
      waitForData: waitForData,
      getWaitForData: getWaitForData,
      scrollTop: scrollTop
    };
  }])
  .directive('datatable', ['$timeout', 'datatableService', function ($timeout, datatableService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('.js', '.phtml'),
      replace: true,
      scope: {
        name: '@',
        title: '@',
        containerClasses: '@',
        headingClasses: '@',
        bodyClasses: '@',
        tableClasses: '@',
        tableHeight: '@',
        scrollForMore: '@',
        scrollForMoreDistance: '@',
        showSearch: '@'
      },
      controllerAs: 'datatableController',
      controller: ['$scope', function ($scope) {
        var watchers = [];
        datatableService.setDatatableScope($scope.name, $scope);
        $scope.tableId = 'datatable-' + $scope.name;
        $scope.fields = datatableService.getFields($scope.name);
        $scope.data = datatableService.getData($scope.name);
        $scope.idfield = datatableService.getIdField($scope.name);
        $scope.setSelected = function () {
          if ($scope.focusIndex === null) {
            datatableService.setSelected($scope.name, null, null);

          }
          else {
            datatableService.setSelected($scope.name, $scope.focusIndex,
              $('#' + $scope.tableId + ' .selectable:eq(' + $scope.focusIndex + ')').attr('data-id')
            );
          }
        };
        $scope.setSort = function (index) {
          var sort = {
            index: index,
            field: $scope.fields[index],
            order: 'asc'
          };
          if ($scope.sort && $scope.sort.index === index && $scope.sort.order === 'asc') {
            sort.order = 'desc';
          }
          datatableService.setSort($scope.name, sort);
        };
        $scope.$watch('search', function (newValue, oldValue) {
          if (typeof newValue !== 'undefined') {
            datatableService.setSearch($scope.name, newValue);
          }
        });
        watchers.push(
          $scope.$on('datatable/reloadData', function (event, name, params) {
            if ($scope.name === name) {
              $scope.data = datatableService.getData($scope.name);
            }
          })
        );
        watchers.push(
          $scope.$on('datatable/setSort', function (event, name) {
            if (name === $scope.name) {
              $scope.sort = datatableService.getSort(name);
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
      }],
      link: function (scope, element) {
        var watchers = [];
        var scrollContainer;
        var scrollForMore = false;
        if (scope.scrollForMore) {
          scrollForMore = scope.$eval(scope.scrollForMore);
        }

        var scrollForMoreDistance = 0;
        if (scope.scrollForMoreDistance) {
          scrollForMoreDistance = parseInt(scope.scrollForMoreDistance, 10);
        }
        var keyBindings = {
          38: function () {
            if (typeof scope.focusIndex === 'undefined' || scope.focusIndex === null || scope.focusIndex <= 0) {
              scope.focusIndex = 0;
            }
            else {
              scope.focusIndex--;
              var selected = $('#' + scope.tableId + ' .selectable:eq(' + scope.focusIndex + ')');
              if (scrollContainer.offset().top > selected.offset().top) {
                scrollContainer.scrollTop(scrollContainer.scrollTop() + selected.offset().top + selected.height() - scrollContainer.offset().top - scrollContainer.height());
              }
            }
            scope.setSelected();
          },
          40: function () {
            if (typeof scope.focusIndex === 'undefined' || scope.focusIndex === null || scope.focusIndex < 0) {
              scope.focusIndex = 0;
            }
            else if (scope.focusIndex >= scope.data.length - 1) {
              scope.focusIndex = scope.data.length - 1;
            }
            else {
              scope.focusIndex++;
              var selected = $('#' + scope.tableId + ' .selectable:eq(' + scope.focusIndex + ')');
              if (scrollContainer.offset().top + scrollContainer.height() < selected.offset().top + selected.height()) {
                scrollContainer.scrollTop(scrollContainer.scrollTop() + (selected.offset().top - scrollContainer.offset().top));
              }

            }
            scope.setSelected();
          }
        };
        var scrollHandler = function () {
          var waitForData = datatableService.getWaitForData(scope.name);
          if (!waitForData || !waitForData.status) {
            var tbody, containerBottom, containerTop, tbodyBottom, tbodyTop, remainingBottom, remainingTop, atBottom, atTop;
            tbody = scrollContainer.find('tbody');
            containerBottom = scrollContainer.height() + scrollContainer.offset().top;
            containerTop = scrollContainer.offset().top;
            tbodyBottom = tbody.offset().top + tbody.height();
            tbodyTop = tbody.offset().top;
            remainingBottom = tbodyBottom - containerBottom;
            remainingTop = containerTop - tbodyTop - 1;
            atBottom = remainingBottom <= scrollContainer.height() * scrollForMoreDistance;
            atTop = remainingTop <= scrollContainer.height() * scrollForMoreDistance;
            if (atTop) {
              scope.$emit('datatable/scrollReachedTop', scope.name);
            }
            if (atBottom) {
              scope.$emit('datatable/scrollReachedBottom', scope.name);
            }
          }
        };

        watchers.push(
          scope.onClick = function (item) {
            var index = scope.data.indexOf(item);
            scope.focusIndex = (scope.focusIndex !== index) ? index : null;
            scope.setSelected();
          }
        );
        watchers.push(
          scope.onKeyDown = function (event) {
            if (event && typeof keyBindings[event.keyCode] === 'function') {
              keyBindings[event.keyCode]();
              event.preventDefault();
            }
          }
        );
        watchers.push(
          scope.$on('datatable/reloadData', function (event, name, params) {
            if (scope.name === name) {
              if (params && params.redraw) {
                $timeout(function () {
                  $('#' + scope.tableId + '.sticky-header').fixedHeaderTable({
                    height: scope.tableHeight, create: function () {
                      //console.log('stikyAgain!!');
                      scrollContainer = $('.datatable-container[name="' + scope.name + '"] .fht-tbody');
                      if (scrollForMore) {
                        scrollContainer.on('scroll', scrollHandler);
                        scrollHandler();
                      }
                      element.find('.fht-thead th').each(function (index) {
                        var el = $(this);
                        el.off('click');
                        if (scope.fields[index].sortable) {
                          el.addClass('sortable');
                          el.on('click', function () {
                            scope.setSort(index);
                          });
                          scope.$on('$destroy', function () {
                            el.off('click');
                          });
                        }
                      });
                      element.find('#' + scope.tableId + ' .selectable:eq(' + scope.focusIndex + ')').addClass('selected');
                      if (scope.sort) {
                        scope.$broadcast('datatable/setSort', scope.name);
                      }
                    }
                  });
                });
              }
            }
          })
        );
        watchers.push(
          scope.$on('datatable/updateSelected', function (event, name) {
            if (scope.name === name) {
              var selected = datatableService.getSelected(name);
              if (selected) {
                scope.focusIndex = selected.index;
              }
              else {
                scope.focusIndex = null;
              }
            }
          })
        );
        watchers.push(
          scope.$on('datatable/setSort', function (event, name) {
            if (name === scope.name) {
              element.find('.fht-thead th').each(function (index) {
                var el = $(this);
                if (scope.sort.index === index) {
                  el.addClass('sorted').removeClass('sorted-asc').removeClass('sorted-desc').addClass('sorted-' + scope.sort.order);
                }
                else {
                  el.removeClass('sorted').removeClass('sorted-asc').removeClass('sorted-desc');
                }
              });
            }
          })
        );
        watchers.push(
          scope.$on('datatable/scrollTop', function (event, name) {
            if (scrollContainer) {
              scrollContainer.scrollTop(0);
            }
          })
        );

        watchers.push(
          scope.$on('$destroy', function () {
            scrollContainer.off('scroll', scrollHandler);
            for (var w in watchers) {
              watchers[w]();
            }
          })
        );
        $timeout(function () {
          scope.$emit('datatable/ready', scope.name);
        });
      }
    };
  }]);
