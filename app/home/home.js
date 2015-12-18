/**
 * Created by clement on 12/13/15.
 */
'use strict';

var app = angular.module('myApp.home', ['ngRoute', 'ngResource']);

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

var userFactory = function ($resource) {
    var user_factory = {

        all_users: "",

        resource_users: function () {
            var users = $resource('http://localhost:5000/peoples', {}, {
                query: {method: 'GET'}
            });
            var mUsers = users.query();
            user_factory.all_users = mUsers;
            console.log(this.all_users);
            return user_factory.all_users;
        },
        resource_user: function () {
            var user = $resource('http://localhost:5000/eve/users/:username', {username:'@id'});


            return user;
        }

    };
    return user_factory;

};

app.factory('User', ['$resource', userFactory]);

app.controller('HomeCtrl', ['$scope', 'User', '$window', function ($scope, User, $window) {

    if (!$window.sessionStorage.access_token) {
        $scope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
    }

    $scope.users = {};
    //Perform "GET http://mydomain.com/api/user/"
    if (User.all_users.length <= 0) {
        var user = User.resource_user();
        user.get({username:$window.sessionStorage.user}).
                $promise.then(function(user){
                $scope.users = user
            });
    } else {
        $scope.users = User.all_users;
    }


}]);

