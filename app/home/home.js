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


app.controller('HomeCtrl', ['$scope', 'Peoples', '$window', 'Restangular', '$timeout', '$filter',
    function ($scope, Peoples, $window, Restangular, $timeout, $filter) {

        //check for cred
        if (!$window.sessionStorage.access_token) {

            $scope.isAuthenticated = false;
        } else {
            $scope.isAuthenticated = true;
        }
        //refresh
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
        // init scope
        $scope.users = {};
        $scope.showModal = false;
        $scope.showModale = false;
        $scope.success_modal = false;
        $scope.showModalsk = false;
        $scope.form = {};
        $scope.users = refresh();

        $scope.toggleModal = function () {
            $scope.showModal = !$scope.showModal;
        };
        $scope.toggleModale = function () {
            $scope.showModale = !$scope.showModale;
        };
        $scope.toggleModalsk = function(){
            $scope.showModalsk = !$scope.showModalsk;
        };


        $scope.statuses = [
            {value: Boolean(true), text: 'oui'},
            {value: Boolean(false), text: 'non'}
        ];

        $scope.showStatus = function (element) {
            var selected = $filter('filter')($scope.statuses, {value: element});
            console.log($scope.users.works.actual);
            return (element && selected.length) ? selected[0].text : 'Not set';
        };


        var successmodal = function () {
            $scope.success_modal = true;
        };


        $scope.addEducation = function (myForm) {
            var myEdu = myForm;
            edu.cursus_title = $scope.cursus_title;
            edu.cursus_location.school_name = $scope.school_name;
            edu.cursus_location.school_address = $scope.school_address;
            edu.cursus_location.school_city = $scope.school_city;
            edu.cursus_location.school_link = $scope.school_link;
            edu.cursus_date_start = new Date($scope.cursus_date_start);
            edu.cursus_date_end = new Date($scope.cursus_date_end);
            edu.cursus_status = $scope.cursus_status;
            $scope.users.education.push(edu);
            var mData = Restangular.copy($scope.users);
            purge(mData);
            $scope.users.patch(mData);
            $scope.users = refresh();
        };

        $scope.addWork = function (myForm) {
            if (typeof($scope.users) === "undefined") {
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
            work.description = $scope.description;
            $scope.users.works.push(work);
            var mData = Restangular.copy($scope.users);
            purge(mData);
            $scope.users.patch(mData);
            $scope.users = refresh();


        };

        $scope.addSkill = function (myForm) {
          if (typeof($scope.users.skills) === "undefined") {
                $scope.users.skills = [];
            }
            var mySkill = myForm;
            mSkill.skill_title = $scope.skill_title;
            mSkill.skill_level = $scope.skill_level;
            mSkill.skill_image = $scope.skill_image;
            mySkill.skill_tag = $scope.skill_tag;
            $scope.users.skills.push(mSkill);
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
        $scope.tobedone = function () {
            
            swal('Sorry', 'This is under redaction and will be available soon !!')
        };
        var edu = {
            "cursus_date_end": new Date(),
            "cursus_title": "",
            "cursus_date_start": new Date(),
            "cursus_location": {
                "school_address": "",
                "school_link": "",
                "school_name": "",
                "school_geoloc": {
                    "type": "Point",
                    "coordinates": [
                        47.363303,
                        0.681484
                    ]
                },
                "school_city": "",
                "school_postal_code": ""
            },
            "cursus_status": ""
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

        var mSkill = {
            'skill_title': "",
            'skill_level': "",
            'skill_image': "",
            'skill_tag': ""
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

        $scope.removeSkill = function(title) {
            var newScopeSkill = remove_embedded_skill($scope.users.skills, title);
            delete $scope.users.skills;
            $scope.users.skills = newScopeSkill;
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
        var remove_embedded_skill = function(embeddedSkillArray, title){
            return embeddedSkillArray.filter(function(obj){
                return obj.title !=  title;
            });
        };

        $scope.updateAny = function () {
            var mData = Restangular.copy($scope.users);
            purge(mData);
            try {
                $scope.users.patch(mData);
                //$scope.users = refresh();
                $scope.update_success = true;
                successmodal();
                $timeout(function () {
                    $scope.users = refresh();
                }, 3000, false);


            } catch (e) {

                alert('update error.... : ' + e);
            }

        };

    }]);
//modal directive
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





