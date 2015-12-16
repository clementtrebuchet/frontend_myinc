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
var app = angular.module('myApp');

app.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var loginFactory = function ($resource) {

    var mLoginFactory = {
        authenticate: function () {
            return $resource('http://localhost:5000/authenticate/:username/:password', {}, {
                query: {method: 'POST', params: {username: 'login', password: 'password', }}
            });

        }

    }
    return mLoginFactory;
};

app.controller('LoginCtrl',  function (auth, $scope, $location, store) {
     $scope.username = "";
     $scope.password = "";


  function onLoginSuccess(profile, token) {
    $scope.message.text = '';
    store.set('profile', profile);
    store.set('token', token);
    $location.path('/home');
    $scope.loading = false;
  }

  function onLoginFailed() {
    $scope.message.text = 'invalid credentials';
    $scope.loading = false;
  }

  $scope.reset = function() {
    auth.reset({
      email: 'hello@bye.com',
      password: 'hello',
      connection: 'Username-Password-Authentication'
    });
  }

  $scope.submit = function () {
      //$scope.message.text = 'loading...';
      $scope.loading = true;
      auth.signin({
          connection: 'Username-Password-Authentication',
          username: $scope.username,
          password: $scope.password,
          authParams: {
              scope: 'oauth'
          }
      }, onLoginSuccess, onLoginFailed);
  };

});
