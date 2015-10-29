'use strict';

/**
 * @ngdoc function
 * @name sdnMpiConsoleApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the sdnMpiConsoleApp
 */
angular.module('sdnMpiConsoleApp')
  .controller('HeaderCtrl', function ($scope, jsonRpcServer) {
    $scope.jsonRpcServer = jsonRpcServer;
    $scope.$watch('jsonRpcServer.isConnected()', function() {
      $scope.isConnected = jsonRpcServer.isConnected();
    });
  });
