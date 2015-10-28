'use strict';

/* global _ */
/**
 * @ngdoc function
 * @name sdnMpiConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sdnMpiConsoleApp
 */
angular.module('sdnMpiConsoleApp')
  .controller('MainCtrl', function (jsonRpcServer, $scope) {
    $scope.fdb = [];
    $scope.rankdb = [];

    jsonRpcServer.register('update_fdb', function(params, success) {
      var dpid = "0x" + params[0].toString(16);
      var mac = params[1];
      var port = params[2];

      _.remove($scope.fdb, function(entry) {
        return entry.dpid === dpid && entry.mac === mac;
      });
      $scope.fdb.push({dpid: dpid, mac: mac, port: port});

      success(null);
    });

    jsonRpcServer.register('init_fdb', function(params, success) {
      _.forEach(params[0], function(table, dpid) {
        _.forEach(table, function(port, mac) {
          $scope.fdb.push({
            dpid: "0x" + parseInt(dpid, 10).toString(16),
            mac: mac,
            port: port
          });
        });
      });
      success(null);
    });

    jsonRpcServer.register('update_rankdb', function(params, success) {
      var rank = params[0];
      var mac = params[1];

      _.remove($scope.rankdb, function(entry) {
        return entry.rank === rank;
      });
      $scope.rankdb.push({rank: rank, mac: mac});

      success(null);
    });

    jsonRpcServer.register('init_rankdb', function(params, success) {
      _.forEach(params[0], function(rank, port) {
        $scope.rankdb.push({rank: rank, port: port});
      });
      success(null);
    });

  });
