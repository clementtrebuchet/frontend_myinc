/**
 * Created by clement on 12/14/15.
 */
'use strict';

/*var app = angular.module('myApp.login', ['auth0', 'ngCookies', 'ngRoute', 'angular-storage', 'angular-jwt', 'ngResource'])

 .config(['$routeProvider', function ($routeProvider) {
 $routeProvider.when('/login', {
 templateUrl: 'login/login.html',
 controller: 'LoginCtrl'
 });
 }]);*/
var app = angular.module('myApp.login', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', '$resourceProvider', '$httpProvider', function ($routeProvider, $resourceProvider, $httpProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'UserCtrl'
    });
}]);

app.directive('showErrors', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, el) {
            scope.show = function () {
                console.log(el[0]);
                var errorDiv = angular.element(document.querySelector('#error'));
                console.log(errorDiv);
                errorDiv.toggleClass('alert alert-danger collapse');
                errorDiv.toggleClass('alert alert-danger');
                $timeout(
                    function () {
                        errorDiv.toggleClass('alert alert-danger');
                        errorDiv.toggleClass('alert alert-danger collapse');
                    },
                    2000);

            };

        }
    };
});
app.controller('UserCtrl', ['$rootScope', '$scope', '$http', '$window', '$location', '$route', '$timeout', function ($rootScope, $scope, $http, $window, $location, $route, showErrors, $timeout) {
    var us = '';
    var pass = '';
    if (!$window.sessionStorage.access_token) {
        $scope.isAuthenticated = false;
        $rootScope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
        $rootScope.isAuthenticated = true;
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
            url: 'http://192.168.0.2:5000/oauth/token?' + data,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
            }
        })
            .success(function (data, status, headers, config) {
                $window.sessionStorage.access_token = data.access_token;
                $window.sessionStorage.user = us;
                $scope.isAuthenticated = true;
                $rootScope.isAuthenticated = true;
                $scope.user.username = us;
                console.log(data);
                $window.location.reload();
                $location.path('/home');
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.access_token;
                $scope.isAuthenticated = false;
                $rootScope.isAuthenticated = false;

                // Handle login errors here
                $scope.show();
                $scope.error = 'Error: Invalid user or password';
            });
    };

    $scope.logout = function () {
        $scope.welcome = '';
        $scope.message = '';
        $scope.isAuthenticated = false;
        $rootScope.isAuthenticated = false;
        delete $window.sessionStorage.access_token;
        delete $window.sessionStorage.user;
        $location.path('/');

    };

}]);


