/**
 * Created by clement on 12/13/15.
 */
'use strict';

var app = angular.module('myApp.home', ['ngRoute', 'ngResource', "ui.bootstrap"]);

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

app.factory('Peoples', ['Restangular', function (Restangular) {
    return Restangular.service('peoples');
}]);


app.controller('HomeCtrl', ['$scope', 'Peoples', '$window', 'Restangular', function ($scope, Peoples, $window, Restangular) {

    if (!$window.sessionStorage.access_token) {
        $scope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
    }
    var item = {};
    var refresh = function () {
        Peoples.getList().then(function (peoples) {
            var userWithId = _.find(peoples, function (people) {
                return people.lastname === 'Trébuchet';
            });
            $scope.users = userWithId;
            $scope.users.$resolved = true;
        });
    };

    $scope.users = refresh();

    var purge = function (mData) {
        delete mData._latest_version;
        delete mData._id;
        delete mData._updated;
        delete mData._version;
        delete mData._deleted;
        delete mData._links;
        delete mData._created;
        delete mData._etag;
        delete mData.$resolved;
    };
    /*    $scope.updateCursusTitle = function (data) {
     var mData = Restangular.copy($scope.users)
     purge(mData);
     mData.education[0].cursus_title = data;
     console.log('mData: '+ mData.education[0].cursus_title);
     console.log('$scope: '+ $scope.users.education[0].cursus_title);
     $scope.users.patch(mData);
     $scope.users = refresh();
     }*/
    $scope.updateAny = function () {
        var mData = Restangular.copy($scope.users);
        purge(mData);
        $scope.users.patch(mData);
        $scope.users = refresh();
    };
}]);

