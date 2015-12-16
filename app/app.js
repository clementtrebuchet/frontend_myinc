'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngCookies',
    'ngRoute',
    'angular-jwt',
    'ngResource',
    'myApp.home',
    'myApp.version'

]);
var client_id = 'SBAuSotGA6lBS3Yckqny3oyg8zfiEXyns3cHy10A'

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


app.controller('MenuCtrl', function ($scope, $location) {
    $scope.go = function (target) {
        $location.path(target);
    };
});

app.controller('UserCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    if (!$window.sessionStorage.token) {
        $scope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
    }
    $scope.user = {username: 'messagebot', password: 'messagebot'};

    $scope.submit = function (user) {
        var grant = "&grant_type=password";
        var client_id = "client_id=SBAuSotGA6lBS3Yckqny3oyg8zfiEXyns3cHy10A";
        var us = user.username;
        var pass = user.password;
        var data = client_id + grant + '&username=' + us + '&password=' + pass
        $http({
            url: 'http://127.0.0.1:5000/oauth/token?' + data,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
            }
        })
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.access_token;
                $scope.isAuthenticated = true;
                console.log(data);
                return;
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
                $scope.isAuthenticated = false;

                // Handle login errors here
                $scope.error = 'Error: Invalid user or password';
            });
    };

    $scope.logout = function () {
        $scope.welcome = '';
        $scope.message = '';
        $scope.isAuthenticated = false;
        delete $window.sessionStorage.token;
    };

    $scope.callRestricted = function () {
        $http({url: '/home', method: 'GET'})
            .success(function (data, status, headers, config) {
                console.log(data);
                $scope.message = data; // Should log 'foo'
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
    };

}]);

app.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {

    request: function (config) {
        console.log('intercept this config: ' + config);
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
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
})
;

app.config(function ($routeProvider, $httpProvider) {


    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'

    });

    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        requiresLogin: true


    });
});