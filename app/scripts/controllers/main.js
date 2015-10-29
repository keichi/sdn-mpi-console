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
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -1000
        }
      },
      groups: {
        switch: {
          color: 'rgba(51, 122, 183, 255)',
          font: {
            size: 16,
            color: 'rgba(255, 255, 255, 255)'
          },
          shape: 'box'
        },
        host: {
          color: 'rgba(92, 184, 92, 255)',
          font: {
            size: 16,
            color: 'rgba(255, 255, 255, 255)'
          },
          shape: 'box'
        },
        process: {
          color: 'rgba(217, 83, 79, 255)',
          font: {
            size: 16,
            color: 'rgba(255, 255, 255, 255)'
          },
          shape: 'ellipse'
        }
      },
      interaction: {
        selectConnectedEdges: false,
        tooltipDelay: 100,
      }
    };

    jsonRpcServer.register('update_fdb', function(params, success) {
      var dpid = '0x' + params[0].toString(16);
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
            dpid: '0x' + parseInt(dpid, 10).toString(16),
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
      nodes.update({
        id: rank,
        label: 'Process',
        title: 'Rank: ' + rank,
        group: 'process'
      });
      edges.update({
        id: mac + rank,
        from: mac,
        to: rank,
        dashes: true,
        color: 'black'
      });

      success(null);
    });

    jsonRpcServer.register('init_rankdb', function(params, success) {
      _.forEach(params[0], function(mac, rank) {
        $scope.rankdb.push({rank: parseInt(rank, 10), mac: mac});

        nodes.update({
          id: rank,
          label: 'Process',
          title: 'Rank: ' + rank,
          group: 'process'
        });
        edges.update({
          id: mac + rank,
          from: mac,
          to: rank,
          dashes: true,
          color: 'black'
        });
      });

      success(null);
    });

    jsonRpcServer.register('init_topologydb', function(params, success) {
      var topology = params[0];
      nodes.update(_.map(topology.switches, function(sw) {
        return {
          id: sw.dpid,
          label: 'Switch',
          title: 'DPID: ' + sw.dpid,
          group: 'switch'
        };
      }));
      nodes.update(_.map(topology.hosts, function(host) {
        return {
          id: host.mac,
          label: 'Host',
          title: 'MAC: ' + host.mac + '<br>' + 'IP: ' + (host.ipv4[0] || ''),
          group: 'host'
        };
      }));
      edges.update(_.map(topology.hosts, function(host) {
        return {
          id: host.port.dpid + host.mac,
          from: host.port.dpid,
          to: host.mac,
          color: 'black'
        };
      }));
      edges.update(_.map(topology.links, function(link) {
        return {
          id: link.src.dpid + link.dst.dpid,
          from: link.src.dpid,
          to: link.dst.dpid,
          color: 'black'
        };
      }));

      success(null);
    });

    jsonRpcServer.register('add_switch', function(params, success) {
      var sw = params[0];
      nodes.update({
        id: sw.dpid,
        label: 'Switch',
        title: 'DPID: ' + sw.dpid,
        group: 'switch'
      });
      success(null);
    });

    jsonRpcServer.register('delete_switch', function(params, success) {
      var sw = params[0];
      nodes.remove(sw.dpid);
      success(null);
    });

    jsonRpcServer.register('add_link', function(params, success) {
      var link = params[0];
      edges.update({
        id: link.src.dpid + link.dst.dpid,
        from: link.src.dpid,
        to: link.dst.dpid,
        color: 'black'
      });
      success(null);
    });

    jsonRpcServer.register('delete_link', function(params, success) {
      success(null);
    });

    jsonRpcServer.register('add_host', function(params, success) {
      var host = params[0];
      nodes.update({
        id: host.mac,
        label: 'Host',
        title: 'MAC: ' + host.mac + '<br>' + 'IP: ' + (host.ipv4[0] || ''),
        group: 'host'
      });
      edges.update({
        id: host.port.dpid + host.mac,
        from: host.port.dpid,
        to: host.mac,
        color: 'black'
      });
      success(null);
    });

  });
