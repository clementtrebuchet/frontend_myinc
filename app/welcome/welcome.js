'use strict';

angular.module('myApp.welcome', ['ngRoute', 'ngSanitize', 'angular-carousel-3d'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/welcome', {
            templateUrl: '/welcome.html',
            controller: 'View1Ctrl',
            public: true
        });
    }])

    .controller('WelcomeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        var vm = this;

        vm.slides = [
            {"src": "img/python-logo.png", "caption": "Python Developement"},
            {"src": "img/Red_Hat_RGB.jpg", "caption": "System administration"},
            {"src": "img/teamcity3.png", "caption": "Continuous delivery"},
            {"src": "img/Openstack.png", "caption": "Virtualisation"},
            {"src": "img/mongodb-logo.png", "caption": "Document Oriented"},
            {"src": "img/jenkins_new_0.jpg", "caption": "Continuous integration"},
            {"src": "img/google-kubernetes.png", "caption": "App Cluster Management"},
            {"src": "img/docker.png", "caption": "Building Containers"},
            {"src": "img/distribution-linux.jpg", "caption": "Linux Expertise"},
            {"src": "img/elk.png", "caption": "Elasticsearch"},
            {"src": "img/gitlab-logo.png", "caption": "GitLab Integration"},
            {"src": "img/what-is-java-used-for.jpg", "caption": "Java Developement"},
            {"src": "img/Git-Icon-Black.png", "caption": "Version Control"},
            {"src": "img/rpm-package.png", "caption": "RedHat Packaging"},
            {"src": "img/Apache-logo.png", "caption": "Web Server Administration"},
            {"src": "img/angular.png", "caption": "Javascript Developement"}

        ];
        vm.options = {
            visible: 6,
            perspective: 45,
            startSlide: 0,
            border: 0,
            dir: 'ltr',
            width: 200,
            height: 200,
            space: 320,
            loop: true,
            animationSpeed: 500,
            controls: true,
            clicking: true
        };


        $timeout(function () {
            $scope.htmlReady();
        }, 2000)


    }]);