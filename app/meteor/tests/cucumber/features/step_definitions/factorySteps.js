(function () {
  'use strict';
  var _ = require('underscore');

  module.exports = function () {

    this.Before(function() {
      server.call('fixtures/resetDatabase');
    });

    this.After(function() {
      server.call('fixtures/resetDatabase');
    });

    this.Given('this user belongs to the group \'$groupName\'', function(groupName) {
      server.call('fixtures/assignLastCreatedUserToGroup', groupName);
    });

    this.Given(/^an? '([^']*)' with the following attributes:?$/, function (collection, attributes) {
      var _this = this;

      if (collection.match(/^Users?$/i))
        var method = 'fixtures/users/create';
      else
        var method = 'fixtures/createRecord';

      _.each(attributes.hashes(), function(row) {
        _this.server.call(method, {
          collection: collection,
          attributes: row
        });
      });
    });

  };
})();
