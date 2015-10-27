'use strict';

/**
 * @ngdoc function
 * @name sdnMpiConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sdnMpiConsoleApp
 */
angular.module('sdnMpiConsoleApp')
  .controller('MainCtrl', function (jsonRpcServer) {
    jsonRpcServer.register('event_switch_enter', function(params, success) {
      console.log(params);
      success(null);
    });
    jsonRpcServer.register('event_switch_leave', function(params, success) {
      console.log(params);
      success(null);
    });

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
