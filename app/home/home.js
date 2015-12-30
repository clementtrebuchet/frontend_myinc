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


app.controller('HomeCtrl', ['$scope', 'Peoples', '$window', 'Restangular', '$timeout', function ($scope, Peoples, $window, Restangular, $timeout) {

    if (!$window.sessionStorage.access_token) {
        $scope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
    }
    $scope.showModal = false;
    $scope.success_modal = false;

    $scope.toggleModal = function () {
        $scope.showModal = !$scope.showModal;
    };
    var item = {};
    $scope.users = {};


    var refresh = function () {
        Peoples.getList().then(function (peoples) {
            var userWithId = _.find(peoples, function (people) {
                return people.lastname === 'Trébuchet';
            });
            $scope.users = userWithId;
            $scope.users.$resolved = true;
            $scope.update_success = false;
            $scope.success_modal = false;
        });
    };

    var successmodal = function(){
        $scope.success_modal = true;
    };
    $scope.form = {};
    $scope.users = refresh();
    $scope.addEducation = function (myForm) {
        var myEdu = myForm;
        console.log(myEdu);
        edu.cursus_title = $scope.cursus_title;
        console.log($scope.cursus_title);
        edu.cursus_location.school_name = $scope.school_name;
        console.log($scope.school_name);
        edu.cursus_location.school_address = $scope.school_address;
        console.log($scope.school_address);
        edu.cursus_location.school_city = $scope.school_city;
        console.log($scope.school_city);
        edu.cursus_location.school_link = $scope.school_link;
        console.log($scope.school_link);
        edu.cursus_date_start = new Date($scope.cursus_date_start);
        console.log($scope.cursus_date_start);
        edu.cursus_date_end = new Date($scope.cursus_date_end);
        console.log($scope.cursus_date_end);
        edu.cursus_status = $scope.cursus_status;
        console.log($scope.cursus_status);
        console.log(edu);
        $scope.users.education.push(edu);
        console.log($scope.users);
        var mData = Restangular.copy($scope.users);
        purge(mData);
        $scope.users.patch(mData);
        $scope.users = refresh();
    };

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
        delete mData.$update_success;
        delete mData.success_modal;
    };
    var edu = {
        "cursus_date_end": new Date("2009-07-10T00:00:00Z"),
        "cursus_title": "Technicien supérieur en réseaux et télécommunication",
        "cursus_date_start": new Date("2009-01-10T00:00:00Z"),
        "cursus_location": {
            "school_address": "32 Avenue Marcel Dassault",
            "school_link": "http://cefim.eu",
            "school_name": "CEFIM",
            "school_geoloc": {
                "type": "Point",
                "coordinates": [
                    47.363303,
                    0.681484
                ]
            },
            "school_city": "TOURS",
            "school_postal_code": "37200"
        },
        "cursus_status": "validate"
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
        try {
            $scope.users.patch(mData);
            $scope.users = refresh();
            $scope.update_success = true;
            successmodal();
            $timeout(function(){
               $scope.users = refresh();
            }, 3000, false);


        } catch (e){
            console.log('update error.... : '+ e);
        }

    };
}]);
app.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<br /><br /><h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});
//.directive('datepickerPopup', function (){
//    return {
//        restrict: 'EAC',
//        require: 'ngModel',
//        link: function(scope, element, attr, controller) {
//      //remove the default formatter from the input directive to prevent conflict
//      controller.$formatters.shift();
//  }
//}
//});




