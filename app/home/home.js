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

app.factory('Skills', ['Restangular', function (Restangular) {
    return Restangular.service('skills');
}]);


app.controller('HomeCtrl', ['$scope', 'Peoples', '$window', 'Restangular', '$timeout', '$filter', 'Skills',
    function ($scope, Peoples, $window, Restangular, $timeout, $filter, Skills) {

    if (!$window.sessionStorage.access_token) {
        $scope.isAuthenticated = false;
    }
    else {
        $scope.isAuthenticated = true;
    }
    $scope.showModal = false;
    $scope.showModale = false;
    $scope.success_modal = false;

    $scope.toggleModal = function () {
        $scope.showModal = !$scope.showModal;
    };
    $scope.toggleModale = function () {
        $scope.showModale = !$scope.showModale;
    };
    var item = {};
    $scope.users = {};


    $scope.statuses = [
        {value: Boolean(true), text: 'oui'},
        {value: Boolean(false), text: 'non'}
    ];

    $scope.showStatus = function (element) {
        var selected = $filter('filter')($scope.statuses, {value: element});
        console.log($scope.users.works.actual);
        return (element && selected.length) ? selected[0].text : 'Not set';
    };

    var refresh = function () {
        Peoples.getList().then(function (peoples) {
            var userWithId = _.find(peoples, function (people) {
                return people.lastname === 'Trébuchet';
            });
            $scope.users = userWithId;
            //sort works array by date -1
            var originalWorksArray = $scope.users.works;
            var sortedWorksArray = originalWorksArray.sort(sortWorksArray);
            var originalEductionArray = $scope.users.education;
            var sortedEducationArray = originalEductionArray.sort(sortEducationArray);
            $scope.users.$resolved = true;
            $scope.update_success = false;
            $scope.success_modal = false;
        });
    };

        function refresh_skills() {
            var m = [];
            Skills.getList().then(function(skills){
                var skillWhithId = _.find(skills, function(skill){
                    if (skill.owner === $scope.users._id){
                        m.push(skill);
                    }
                });
                $scope.skills = m;
                console.log( $scope.skills);
            });

    };
    var successmodal = function () {
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

    $scope.addWork = function (myForm) {
        if (typeof($scope.users.works) === "undefined") {
            $scope.users.works = [];
        }

        if (typeof($scope.actual) === "undefined") {
            $scope.actual = Boolean(true);
        }

        var myWork = myForm;
        work.company_name = $scope.company_name;
        work.title = $scope.title;
        work.area = $scope.area;
        work.start = new Date($scope.start);
        work.end = new Date($scope.end);
        work.actual = $scope.actual;
        console.log($scope.actual);
        work.description = $scope.description;
        $scope.users.works.push(work);
        var mData = Restangular.copy($scope.users);
        purge(mData);
        $scope.users.patch(mData);
        console.log(myForm);
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

        var purgeSkills = function (mData) {
            var lgt = mData.length;
            for (var i = 0; i < lgt; i++){
                delete mData[i]._latest_version;
                delete mData[i]._id;
                delete mData[i]._updated;
                delete mData[i]._version;
                delete mData[i]._deleted;
                delete mData[i]._links;
                delete mData[i]._created;
                delete mData[i]._etag;
            }
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

    var work = {
        'company_name': "",
        'title': "",
        'area': "",
        'start': new Date(),
        'end': new Date(),
        'actual': false,
        'description': ""
    };

    $scope.removeEducation = function (start, end) {
        console.log(start);
        console.log(end);
        var newScopeEdu = remove_embedded_education($scope.users.education, start, end);
        delete $scope.users.education;
        $scope.users.education = newScopeEdu;
        $scope.updateAny();

    };

    $scope.removeWorks = function (start, end) {
        console.log(start);
        console.log(end);
        var newScopeEdu = remove_embedded_works($scope.users.works, start, end);
        delete $scope.users.works;
        $scope.users.works = newScopeEdu;
        $scope.updateAny();

    };

    var remove_embedded_works = function (embeddedWorksArray, start, end) {

        return embeddedWorksArray.filter(function (obj) {
            return obj.start != start && obj.end != end;
        });
    };
    var remove_embedded_education = function (embeddedEducationArray, cursus_date_start, cursus_date_end) {

        return embeddedEducationArray.filter(function (obj) {
            return obj.cursus_date_start != cursus_date_start && obj.cursus_date_end != cursus_date_end;
        });
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
        //purgeSkills(mData.skills)
        try {
            $scope.users.patch(mData);
            //$scope.users = refresh();
            $scope.update_success = true;
            successmodal();
            $timeout(function () {
                $scope.users = refresh();
            }, 3000, false);


        } catch (e) {
            console.log('update error.... : ' + e);
        }

    };

        //$scope.updateSkillsIMG = function(id, data){
        //     var arr = Restangular.one('skills', id);
        //     var a = arr.get();
        //    a.then(function(aa){
        //        console.log(aa);
        //    })
        //
        //
        //
        //}


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
// sorting 1 ( ? -1 : 1)
// sorting -1 (? 1 : -1)
function sortWorksArray(a, b) {
    var dateA = new Date(a.start).getTime();
    var dateB = new Date(b.start).getTime();
    return dateA > dateB ? -1 : 1;

};
function sortEducationArray(a, b) {
    var dateA = new Date(a.cursus_date_start).getTime();
    var dateB = new Date(b.cursus_date_start).getTime();
    return dateA > dateB ? -1 : 1;

};





