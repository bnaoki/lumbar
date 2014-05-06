var Lumbar = {};

// Current version. Keep in sync with `package.json`.
Lumbar.VERSION = '0.0.1';

// Lumbar classes
Lumbar.Base = require('./base');
Lumbar.Model = require('./model');

// Expose Backbone/Underscore to give the user direct access
Lumbar.Backbone = require('backbone');
Lumbar._ = require('underscore');

module.exports = Lumbar;
