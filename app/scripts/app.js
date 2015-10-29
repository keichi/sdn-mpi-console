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
    'ui.router',
    'ngWebSocket',
    'ngVis'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      });
  })
  .constant('WS_RPC_URL', 'ws://133.1.134.79:8080/v1.0/sdnmpi/ws');

