'use strict';
var app = angular.module('myApp.admin', ['ngRoute', 'ngResource']);

    app.config(['$routeProvider', '$httpProvider', '$resourceProvider', function ($routeProvider, $httpProvider, $resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('authInterceptor');
        $routeProvider.when('/admin', {
            templateUrl: 'admin.html',
            controller: 'AdminCtrl'
        });
    }]);

    app.controller('AdminCtrl', [function () {

    }]);