angular.module('zs-ionic-autocomplete',['ionic'])
    .directive('ionicAutocomplete', function ($rootScope, $ionicModal, $filter, $parse) {
    return {
        restrict: 'AE',
        link: function ($scope, element, attrs) {

            var modal;
            var scope;

            $ionicModal.fromTemplateUrl('views/zenside-autocomplete.html', {
                animation: 'slide-in-up'
            }).then(function (m) {
                modal = m;
                scope = modal.scope;
                scope.allElts = [];
                scope.elts = [];
                scope.search = {input:''};

                scope.eltValue = $parse(attrs['resultsField']);
                scope.placeholder = attrs['placeholder'];

                var modelSetter = $parse(attrs['ngModel']).assign;

                scope.select = function (value) {
                    modelSetter($scope, value);
                    modal.hide();
                }
                scope.loadElts = function(){

                    scope.allElts.length=scope.elts.length=0;

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

                scope.search = function(){
                    if (attrs['searchMethod']){
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

                scope.hide = function(){
                    modal.hide();
                }
            });

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
