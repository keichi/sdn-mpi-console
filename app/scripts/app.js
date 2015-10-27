'use strict';

/**
 * @ngdoc overview
 * @name sdnMpiConsoleApp
 * @description
 * # sdnMpiConsoleApp
 *
 * Main module of the application.
 */
angular
  .module('sdnMpiConsoleApp', [
    'ngAnimate',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      });
  });

