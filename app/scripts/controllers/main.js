'use strict';

/**
 * @ngdoc function
 * @name sdnMpiConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sdnMpiConsoleApp
 */
angular.module('sdnMpiConsoleApp')
  .controller('MainCtrl', function (jsonRpcServer, $scope, VisDataSet) {
    $scope.fdb = [];
    $scope.rankdb = [];

    var nodes = VisDataSet([]);
    var edges = VisDataSet([]);
    $scope.topology = {nodes: nodes, edges: edges};
    $scope.topologyOptions = {
      physics: {
        solver: 'barnesHut'
      }
    };

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
      nodes.add({id: rank, label: "Rank " + rank});
      edges.add({from: mac, to: rank});

      success(null);
    });

    jsonRpcServer.register('init_rankdb', function(params, success) {
      _.forEach(params[0], function(mac, rank) {
        $scope.rankdb.push({rank: parseInt(rank, 10), mac: mac});

        nodes.add({id: rank, label: "Rank " + rank});
        edges.add({from: mac, to: rank});
      });

      success(null);
    });

    jsonRpcServer.register('init_topologydb', function(params, success) {
      var topology = params[0];
      nodes.add(_.map(topology.switches, function(sw) {
        return {id: sw.dpid, label: sw.dpid};
      }));
      nodes.add(_.map(topology.hosts, function(host) {
        return {id: host.mac, label: host.mac};
      }));
      edges.add(_.map(topology.hosts, function(host) {
        return {from: host.port.dpid, to: host.mac};
      }));
      edges.add(_.map(topology.links, function(link) {
        return {from: link.src.dpid, to: link.dst.dpid};
      }));

      success(null);
    });

    jsonRpcServer.register('add_switch', function(params, success) {
      var sw = params[0];
      nodes.add({id: sw.dpid, label: sw.dpid});
      success(null);
    });

    jsonRpcServer.register('delete_switch', function(params, success) {
      var sw = params[0];
      nodes.remove(sw.dpid);
      success(null);
    });

    jsonRpcServer.register('add_link', function(params, success) {
      var link = params[0];
      edges.add({from: link.src.dpid, to: link.dst.dpid});
      success(null);
    });

    jsonRpcServer.register('delete_link', function(params, success) {
      success(null);
    });

    jsonRpcServer.register('add_host', function(params, success) {
      var host = params[0];
      nodes.add({id: host.mac, label: host.mac});
      edges.add({from: host.port.dpid, to: host.mac});
      success(null);
    });

  });
