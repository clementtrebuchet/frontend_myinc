/**
 * Created by clement on 9/24/16.
 */
'use strict';

var app = angular.module('myApp.onions', ['ngRoute', 'ngResource', "ui.bootstrap"]);

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
            'url': self.default_url() + 'onions/?where={"'+searchfield+'": {"$regex": ".*'+ expression +'.*"}}&max_results=' + data.limit + '&page=' + data.page + '&sort=[("_updated", ' + data.order + ')]&' + Math.floor(Date.now() / 1000),
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

    return onion_client;

}]);

app.controller('OnionsCtrl', ['$scope', 'Onions', '$q', function ($scope, Onions, $q) {

    $scope.oni = new Onions();

    $scope.search_touched = false;

    function success(onions) {
        $scope.onions_items = [];
        console.log(onions);
        onions.data._items.forEach(function (item) {
            $scope.onions_items.push(item);
        });
        console.log($scope.onions_items);
    }

    $scope.selected = [];

    $scope.query = {
        order:  -1,
        limit: 5,
        page: 1
    };
    $scope.fields = ['pageTitle', 'snapshot', 'linkedSites'];
    /***
     *
     */
    $scope.$on('finishloading', function (event) {
        console.log('finnishloading');
        $scope.interrogate = true;
        $scope.def.resolve();
    });
    $scope.$on('startloading', function (event) {
        $scope.interrogate = false;
    });
    $scope.interrogate = true;
    $scope.def = $q.defer();
    $scope.search = function () {
        if ($scope.interrogate === true) {
            $scope.search_touched = true;
            $scope.promise = $scope.oni.searchOnions(
                function (data) {
                    $scope.$broadcast('startloading');
                    success(data);
                    $scope.total = data.data._meta['total'];
                    $scope.$broadcast('finishloading');
                },
                function (error) {
                    console.log(error);
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

    $scope.getPaginateRe();
}]);