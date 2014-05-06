var Backbone = require('backbone');

// Base
// ---------------

// Base is a simple class that can be extended in the same way as Backbone classes (e.g.
// `Backbone.Model.extend({})`). Use `Base.extend(properties, [classProperties])` whenever you need
// to define a class that doesn't belong under any of the Backbone classes (Model, Collection,
// View, Router). Like with Backbone classes, the `initialize` function will be invoked on
// instantiation if you define one.
var Base = function() {
  this.initialize.apply(this, arguments);
};

// Define a default empty `initialize` in cases where a subclass didn't define one
Base.prototype.initialize = function() {};

// Steal `extend` from `Backbone.Model` (could also have taken from Collection, View, or Router
// since it's all the same).
Base.extend = Backbone.Model.extend;

module.exports = Base;
