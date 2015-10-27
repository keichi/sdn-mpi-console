'use strict';

describe('Service: jsonRpcServer', function () {

  // load the service's module
  beforeEach(module('sdnMpiConsoleApp'));

  // instantiate service
  var jsonRpcServer;
  beforeEach(inject(function (_jsonRpcServer_) {
    jsonRpcServer = _jsonRpcServer_;
  }));

  it('should do something', function () {
    expect(!!jsonRpcServer).toBe(true);
  });

});
