/**
 * Created by clement on 12/13/15.
 */
'use strict';

var app = angular.module('myApp.home', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}]);
app.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var userFactory = function($resource){
    var user_factory = {

        all_users: "",

        resource_users: function() {
            var users = $resource('http://localhost:5000/peoples', {},{
                query: {method: 'GET'}
            });
            var mUsers = users.query();
            user_factory.all_users = mUsers;
            console.log(this.all_users);
            return user_factory.all_users;
        },
        resource_user: function(id){
            var user = $resource('http://localhost:5000/peoples/:userId', {},{
                query: {method: 'GET', params: {userId: 'userid'}}
            });

            return user;
        }

    };
    return user_factory;

};

app.factory('User', ['$resource', userFactory ]);

app.controller('HomeCtrl', ['$scope', 'User',function($scope, User) {
    $scope.users = {};
        //Perform "GET http://mydomain.com/api/user/"
    if (User.all_users.length <= 0){
        $scope.users =  User.resource_users();
    } else {
        $scope.users = User.all_users;
    }


    }]);

