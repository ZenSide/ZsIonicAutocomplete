angular.module('zs-ionic-autocomplete', ['ionic'])

    .directive('labelField', function ($parse) {
        return {
            restrict: 'AE',
            link: function ($scope, element, attrs) {
                var valueGetter = $parse(attrs['labelField']);
                $scope.$watch(attrs['ngModel'], function (newValue) {
                    if (newValue) {
                        element[0].value = valueGetter(newValue);
                    }
                })
            }
        }
    })
    .directive('ionicAutocomplete', function ($rootScope, $ionicModal, $filter, $parse) {
        return {
            restrict: 'AE',
            link: function ($scope, element, attrs) {

                var modal;
                var scope;

                element[0].style.cursor = 'pointer';
                element[0].style.backgroundColor = 'transparent';

                var tmpl = '<ion-modal-view class="zs-autocomplete">' +
                    '<ion-header-bar>' +
                    '<label class="item-input-wrapper">' +
                    '<i class="icon ion-ios-search placeholder-icon"></i>' +
                    '<input type="search" placeholder="{{placeholder}}" class="input-field" ng-change="search()" ng-model="search.input" style="background-color: transparent;">' +
                    '</label>' +
                    '<button class="button button-clear" ng-click="hide()">' +
                    '{{ "general.cancel" | translate }}' +
                    '</button>' +
                    '</ion-header-bar>' +
                    '<ion-content>' +
                    '<div class="list" ng-show="elts && elts.length > 0">' +
                    '<a class="item" ng-repeat="elt in elts" ng-click="select(elt)">{{ eltValue(elt) }}</a>' +
                    '</div>' +
                    '<div class="card text-center" ng-show="loading && elts.length == 0">' +
                    '<p class="item">' +
                    '<ion-spinner icon="ripple"></ion-spinner>' +
                    '<br>' +
                    '{{ "general.list.loading" | translate }}' +
                    '</p>' +
                    '</div>' +
                    '<div class="card" ng-show="!loading && elts.length == 0">' +
                    '<div class="item item-text-wrap">' +
                    '{{"general.list.noResults" | translate }}' +
                    '</div>' +
                    '</div>' +
                    '</ion-content>' +
                    '</ion-modal-view>';
                var m = $ionicModal.fromTemplate(tmpl, {
                    animation: 'slide-in-up'
                })
                modal = m;
                scope = modal.scope;
                scope.allElts = [];
                scope.elts = [];
                scope.search = {input: ''};

                scope.eltValue = $parse(attrs['resultsField']);
                scope.placeholder = attrs['placeholder'];

                var modelSetter = $parse(attrs['ngModel']).assign;

                scope.select = function (value) {
                    modelSetter($scope, value);
                    modal.hide();
                }
                scope.loadElts = function () {

                    scope.allElts.length = scope.elts.length = 0;

                    if (attrs['eltsMethod']) {
                        scope.loading = true;
                        $scope[attrs['eltsMethod']]()
                            .then(function (elts) {
                                scope.elts = scope.allElts = elts;
                                scope.loading = false;
                            })
                            .catch(function () {
                                scope.loading = false;
                            })
                    }
                }

                scope.search = function () {
                    if (attrs['searchMethod']) {
                        scope.loading = true;
                        $scope[attrs['searchMethod']](scope.search.input)
                            .then(function (elts) {
                                scope.elts = scope.allElts = elts;
                                scope.loading = false;
                            })
                            .catch(function () {
                                scope.loading = false;
                            })
                    }
                    else {
                        var options = {};
                        options[attrs['searchField']] = scope.search.input;
                        scope.elts = $filter('filter')(scope.allElts, options);
                    }
                }
                scope.loadElts();

                scope.hide = function () {
                    modal.hide();
                }

                $scope.$on('$destroy', function () {
                    modal.remove();
                });
                element.on('click', function () {
                    modal.show().then(function () {
                        $(".input-field", modal.el)[0].focus();
                    });
                })
            }
        }
    })
