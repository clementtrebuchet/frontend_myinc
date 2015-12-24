'use strict';

angular.module('myApp.welcome', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/welcome', {
            templateUrl: '/welcome.html',
            controller: 'View1Ctrl',
            public: true,
        });
    }])

    .controller('WelcomeCtrl', [function () {

    }]);