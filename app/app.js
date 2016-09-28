'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngMaterial',
    'md.data.table',
    'angular-carousel-3d',
    'gettext',
    'ngCookies',
    'ngRoute',
    'angular-jwt',
    'ngResource',
    'restangular',
    "xeditable",
    "ui.bootstrap",
    'ngAnimate',
    'ngSanitize',
    'myApp.welcome',
    'myApp.home',
    'myApp.admin',
    'myApp.login',
    'myApp.onions',
    'myApp.version',
    'seo'


]);
var client_id = 'YM5Qe9Ho6YfecEKQaMXZtbw9edPS6KhT0iKZ6FUf';

function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}


/*app.controller('UserCtrl', ['$scope', '$http', '$window', '$location', function ($scope, $http, $window, $location) {
 var us = '';
 var pass = '';
 if (!$window.sessionStorage.access_token) {
 $scope.isAuthenticated = false;
 }
 else {
 $scope.isAuthenticated = true;
 }
 $scope.go = function (target) {
 $location.path(target);
 };
 $scope.user = {username: 'messagebot', password: 'messagebot'};

 $scope.submit = function (user) {
 var grant = "&grant_type=password";
 var client_id = "client_id=hnwWIfbrYuInJB0G5NrhT1ULXkwfsZ8J6fZHZOQB";
 us = user.username;
 pass = user.password;
 var data = client_id + grant + '&username=' + us + '&password=' + pass
 $http({
 url: 'http://127.0.0.1:5000/oauth/token?' + data,
 method: 'POST',
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
 }
 })
 .success(function (data, status, headers, config) {
 $window.sessionStorage.access_token = data.access_token;
 $window.sessionStorage.user = us;
 $scope.isAuthenticated = true;
 $scope.user.username = us;
 console.log(data);
 })
 .error(function (data, status, headers, config) {
 // Erase the token if the user fails to log in
 delete $window.sessionStorage.access_token;
 $scope.isAuthenticated = false;

 // Handle login errors here
 $scope.error = 'Error: Invalid user or password';
 });
 };

 $scope.logout = function () {
 $scope.welcome = '';
 $scope.message = '';
 $scope.isAuthenticated = false;
 delete $window.sessionStorage.access_token;
 delete $window.sessionStorage.user;
 $location.path('/');

 };

 }]);*/

app.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {

        request: function (config) {
            //console.log('intercept this config: ' + config);
            config.headers = config.headers || {};
            if ($window.sessionStorage.access_token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.access_token;
            }
            return config;
        }
        ,
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
        }
    };
});
function _redirectIfNotAuthenticated($rootScope, $window, $location) {
    if (!$window.sessionStorage.access_token) {
        $rootScope.isAuthenticated = false;
        $location.path('/login')

    }
    else {
        $rootScope.isAuthenticated = true;
    }
}

app.config(function ($routeProvider, $httpProvider, RestangularProvider, $locationProvider) {


    $locationProvider.hashPrefix('!');
    RestangularProvider.setBaseUrl('https://curriculum.trebuchetclement.fr:5055/');
    RestangularProvider.setRestangularFields({
        id: "_id",
        etag: '_etag'
    });

    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred, $timeout) {

        if (response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 404) {
            console.log(response);

        }
        try {
            var extractedData;
            // .. to look for getList operations
            if (operation === "getList") {
                // .. and handle the data and meta data
                extractedData = data._items;
                extractedData._links = data._links;
                extractedData._meta = data._meta;
            } else {
                extractedData = data._items;
            }
            return extractedData;
        } catch (e) {
            console.log(e);
            return data;
        }

    });
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider.when('/home', {
        templateUrl: 'home/home.html'

    });

    $routeProvider.when('/login', {
        templateUrl: 'login/login.html'

    });

    $routeProvider.when('/admin', {
        templateUrl: 'admin/admin.html',
        resolve: {
            redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        }
    });

    $routeProvider.when('/welcome', {
        templateUrl: 'welcome/welcome.html'

    });

    $routeProvider.when('/onions', {
        templateUrl: 'onions/onions.html',
         resolve: {
            redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        }

    });

    $routeProvider.otherwise('/home');

});