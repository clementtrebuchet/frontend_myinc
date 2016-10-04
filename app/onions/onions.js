/**
 * Created by clement on 9/24/16.
 */
'use strict';

var app = angular.module('myApp.onions', ['ngRoute', 'ngResource', "ui.bootstrap",]);

app.config(['$routeProvider', '$httpProvider', '$resourceProvider', function ($routeProvider, $httpProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}]);

app.factory('Onions', ['$http', function ($http) {
    var onion_client = function () {
    };
    onion_client.prototype.default_url = function () {

        return 'https://curriculum.trebuchetclement.fr:5055/';
    };

    onion_client.prototype.getOnions = function (successCbk, errorCbk, data) {

        var self = this;
        $http({
            'url': self.default_url() + 'onions/?max_results=' + data.limit + '&page=' + data.page + '&sort=[("_updated", ' + data.order + ')]&' + Math.floor(Date.now() / 1000),
            'method': 'GET',
            'withCredentials': false
        }).then(
            function (response) {
                if (response.status == '200') {
                    try {

                        //console.log(response.data);
                        successCbk(response);
                    }
                    catch (e) {
                        console.log(e);
                        errorCbk(e);
                    }
                } else if (response.status == '401') {
                    console.log(response);
                    errorCbk('Authentication error ' + response);
                }
            }
        )
    };

    onion_client.prototype.searchOnions = function (successCbk, errorCbk, data, searchfield, expression) {

        var self = this;
        $http({
            'url': self.default_url() + 'onions/?where={"' + searchfield + '": {"$regex": ".*' + expression + '.*"}}&max_results=' + data.limit + '&page=' + data.page + '&sort=[("_updated", ' + data.order + ')]&' + Math.floor(Date.now() / 1000),
            'method': 'GET',
            'withCredentials': false
        }).then(
            function (response) {
                if (response.status == '200') {
                    try {

                        //console.log(response.data);
                        successCbk(response);
                    }
                    catch (e) {
                        console.log(e);
                        errorCbk(e);
                    }
                } else if (response.status == '401') {
                    console.log(response);
                    errorCbk('Authentication error ' + response);
                }
            }
        )
    };

    onion_client.prototype.getOnions_exits = function (successCbk, errorCbk, data) {

        var self = this;
        $http({
            'url': self.default_url() + 'onions_exits/?max_results=' + data.limit + '&page=' + data.page + '&sort=[("_updated", ' + data.order + ')]&' + Math.floor(Date.now() / 1000),
            'method': 'GET',
            'withCredentials': false
        }).then(
            function (response) {
                if (response.status == '200') {
                    try {

                        //console.log(response.data);
                        successCbk(response);
                    }
                    catch (e) {
                        console.log(e);
                        errorCbk(e);
                    }
                } else if (response.status == '401') {
                    console.log(response);
                    errorCbk('Authentication error ' + response);
                }
            }
        )
    };

    onion_client.prototype.searchOnions_exits = function (successCbk, errorCbk, data, searchfield, expression) {

        var self = this;
        $http({
            'url': self.default_url() + 'onions_exits/?where={"' + searchfield + '": {"$regex": ".*' + expression + '.*"}}&max_results=' + data.limit + '&page=' + data.page + '&sort=[("_updated", ' + data.order + ')]&' + Math.floor(Date.now() / 1000),
            'method': 'GET',
            'withCredentials': false
        }).then(
            function (response) {
                if (response.status == '200') {
                    try {

                        //console.log(response.data);
                        successCbk(response);
                    }
                    catch (e) {
                        console.log(e);
                        errorCbk(e);
                    }
                } else if (response.status == '401') {
                    console.log(response);
                    errorCbk('Authentication error ' + response);
                }
            }
        )
    };

    onion_client.prototype.relay_by_locale_data = function (successCbk, errorCbk) {

        var self = this;
        $http({
            'url': self.default_url() + 'relay_by_locale',
            'method': 'GET',
            'withCredentials': false
        }).then(
            function (response) {
                if (response.status == '200') {
                    try {

                        //console.log(response.data);
                        successCbk(response.data['_items']);
                    }
                    catch (e) {
                        console.log(e);
                        errorCbk(e);
                    }
                } else if (response.status == '401') {
                    console.log(response);
                    errorCbk('Authentication error ' + response);
                }
            }
        )
    };

    return onion_client;

}]);

app.controller('OnionsCtrl', ['$scope', 'Onions', '$q', '$mdToast', function ($scope, Onions, $q, $mdToast) {

    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.oni = new Onions();
    $scope.searching = false;
    $scope.searchingexit = false;
    $scope.search_touched = false;
    $scope.search_touchedexit = false;
    $scope.relay_by_locale_labels = [];
    $scope.relay_by_locale_data = [];

    function success(onions) {
        $scope.onions_items = [];
        //console.log(onions);
        onions.data._items.forEach(function (item) {
            $scope.onions_items.push(item);
        });
        //console.log($scope.onions_items);
    }

    function successexit(onions) {
        $scope.onionsexit_items = [];
        //console.log(onions);
        onions.data._items.forEach(function (item) {
            $scope.onionsexit_items.push(item);
        });
        //console.log($scope.onions_items);
    }

    $scope.selected = [];

    $scope.query = {
        order: -1,
        limit: 5,
        page: 1
    };

    $scope.queryexit = {
        order: -1,
        limit: 5,
        page: 1
    };

    $scope.toastPosition = angular.extend({}, last);

    $scope.getToastPosition = function () {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
            .filter(function (pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;

        if (current.bottom && last.top) current.top = false;
        if (current.top && last.bottom) current.bottom = false;
        if (current.right && last.left) current.left = false;
        if (current.left && last.right) current.right = false;

        last = angular.extend({}, current);
    }

    $scope.fields = ['pageTitle', 'snapshot', 'linkedSites', 'serverVersion', 'hiddenService', 'ipAddresses', 'sshKey', 'webDetected'];

    $scope.fieldexit = ['address', 'nickname', 'fingerprint', 'locale', 'hiddenService'];
    /***
     *
     */
    $scope.$watch('search_touched', function (old, newv, attrs) {
        if (newv === true) {
            console.log('leaving search mode');
            $scope.getPaginateRe();
        }
    });

    $scope.$watch('search_touchedexit', function (old, newv, attrs) {
        if (newv === true) {
            console.log('leaving search mode');
            $scope.getPaginateReexit();
        }
    });
    $scope.$on('finishloading', function (event) {
        console.log('finnishloading');
        $scope.interrogate = true;
        $scope.def.resolve();

    });
    $scope.$on('startloading', function (event) {
        $scope.interrogate = false;

    });
    $scope.$on('finishloadingexit', function (event) {
        console.log('finnishloading');
        $scope.interrogateexit = true;
        $scope.defexit.resolve();

    });
    $scope.$on('startloadingexit', function (event) {
        $scope.interrogateexit = false;

    });
    $scope.interrogate = true;
    $scope.def = $q.defer();
    $scope.search = function () {
        $scope.searching = true;
        if ($scope.interrogate === true) {
            $scope.promise = $scope.oni.searchOnions(
                function (data) {
                    $scope.$broadcast('startloading');
                    success(data);
                    $scope.total = data.data._meta['total'];
                    $scope.$broadcast('finishloading');
                    $scope.searching = false;
                },
                function (error) {
                    console.log(error);
                    $scope.searching = false;
                },
                $scope.query,
                $scope.searchField,
                $scope.expression
            );
        }

    };
    $scope.getPaginateRe = function () {
        if ($scope.search_touched === true) {
            $scope.search();
            console.log('searching mode');
            return;
        }
        if ($scope.interrogate === true) {
            $scope.loader = $scope.def.promise;
            $scope.promise = $scope.oni.getOnions(
                function (data) {
                    $scope.$broadcast('startloading');
                    success(data);
                    $scope.total = data.data._meta['total'];
                    $scope.$broadcast('finishloading');
                },
                function (error) {
                    console.log(error);
                },
                $scope.query
            );
        } else {
            console.log('previous request was not finished')
        }
    };

    $scope.interrogateexit = true;
    $scope.defexit = $q.defer();
    $scope.searchexit = function () {
        $scope.searchingexit = true;
        $scope.promiseexit = $scope.oni.searchOnions_exits(
            function (data) {
                $scope.$broadcast('startloadingexit');
                successexit(data);
                $scope.totalexit = data.data._meta['total'];
                $scope.$broadcast('finishloadingexit');
                $scope.searchingexit = false;
            },
            function (error) {
                console.log(error);
                $scope.searchingexit = false;
            },
            $scope.queryexit,
            $scope.searchFieldExit,
            $scope.expressionexist
        )

    };
    $scope.getPaginateReexit = function () {
        if ($scope.search_touchedexit === true) {
            $scope.searchexit();
            console.log('searching mode');
            return;
        }
        if ($scope.interrogateexit === true) {
            $scope.loader = $scope.defexit.promise;
            $scope.promise = $scope.oni.getOnions_exits(
                function (data) {
                    $scope.$broadcast('startloadingexit');
                    successexit(data);
                    $scope.totalexit = data.data._meta['total'];
                    $scope.$broadcast('finishloadingexit');
                },
                function (error) {
                    console.log(error);
                },
                $scope.queryexit
            );
        } else {
            console.log('previous request was not finished')
        }
    };

    $scope.relay_by_locale_chart = function () {
        $scope.relay_by_locale_labels = [];
        $scope.relay_by_locale_data = [];
        $scope.oni.relay_by_locale_data(
            function (array_data) {
                array_data.forEach(function (item) {
                    $scope.relay_by_locale_labels.push(item['_id'].toUpperCase());
                    $scope.relay_by_locale_data.push(item['number']);

                });

            },
            function (error) {
                console.log(error);
            }
        )
    };

    $scope.getPaginateRe();
    $scope.getPaginateReexit();
    $scope.relay_by_locale_chart();
}

]);