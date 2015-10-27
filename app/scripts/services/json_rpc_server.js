'use strict';

/**
 * @ngdoc service
 * @name sdnMpiConsoleApp.jsonRpcServer
 * @description
 * # jsonRpcServer
 * Factory in the sdnMpiConsoleApp.
 */
angular.module('sdnMpiConsoleApp')
  .factory('jsonRpcServer', function ($websocket, WS_RPC_URL) {
    var socket = $websocket(WS_RPC_URL);
    var methods = {};

    socket.onOpen(function() {
      console.log("[websocket] socket opened");
    });

    socket.onClose(function() {
      console.log("[websocket] socket closed");
    });

    socket.onError(function() {
      console.log("[websocket] socket error");
    });

    socket.onMessage(function(e) {
      console.log("[websocket] socket received message: ", e.data);
      var message;
      try {
        message = JSON.parse(e.data);
      }
      catch(err) {
        socket.send(JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32700,
            message: "request parse error"
          },
          id: null
        }));
        return;
      }

      if (message.jsonrpc !== "2.0" || typeof message.method !== "string" ||
        (typeof message.id !== "number" && typeof message.id !== "string" &&
        typeof message.id !== "undefined" && message.id !== null)) {
          socket.send(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32600,
              message: "bad request format"
            },
            id: message.id
          }));
          return;
       }

      if (!(message.method in methods)) {
        socket.send(JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32601,
            message: "method not found"
          },
          id: message.id
        }));
        return;
      }

      methods[message.method](message.params, function(result) {
        socket.send(JSON.stringify({
          jsonrpc: "2.0",
          id: message.id,
          result: result
        }));
      }, function(code, msg) {
        socket.send(JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: code,
            message: msg
          },
          id: message.id
        }));
      });
    });

    return {
      register: function(name, method) {
        methods[name] = method;
      }
    };
  });
