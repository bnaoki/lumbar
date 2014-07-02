var Backbone = require('backbone');
var _ = require('underscore');

// Model
// ---------------

// Model is an extension of `Backbone.Model` with the addition of basic features. To use it, call
// `Model.extend()` as you would with Backbone.Model.

var Model = Backbone.Model.extend({

  // Default is empty. Override this to specify a list of attributes that will automatically get
  // converted to/from Models on `parse` and `toJSON` calls. Example config for a Book class (given
  // an additional Author and Publisher model classes):
  //
  //     modelAttributes: { author: Author, publisher: Publisher }
  //
  modelAttributes: {},

  // Extends `Backbone.Model` 's `get` with support for nested attributes. Attempts a deep get when
  // passed in an `attr` string that contains the `.` delimeter. Example:
  //
  //     var attr = model.get('firstLevel.secondLevel');
  //
  // The deep `get` calls will work so long as the attributes at each level is either an instance
  // of a `Lumbar.Model` or `Backbone.Model`, or if it's a plain object map whose keys match to the
  // corresponding attributes. Returns `undefined` if an attribute is not found at any level.
  get: function(attr) {
    var fields = attr.split('.');
    var result = this;
    for (var i = 0; result && i < fields.length; i++) {
      if (result instanceof Backbone.Model) {
        result = Model.__super__.get.call(result, fields[i]);
      } else {
        result = result[fields[i]];
      }
    }
    return result;
  },

  // Extends `Backbone.Model` 's `set` with support for deep sets, but only on single
  // key/value set calls, not {} set calls. The following would attempt a nested set call:
  //
  //     model.set('attr1.attr2', value);
  //
  // But the following wouldn't and would result in value getting set on model as `attr1.attr2` :
  //
  //     model.set({ 'attr1.attr2': value });
  //
  // The deep `set` calls will work so long as the key attributes at each level is either an
  // instance of a `Lumbar.Model` or `Backbone.Model`, or if it's a plain object map whose keys
  // match the corresponding key attributes. Triggers a `lumbar:invalid:set` event and returns
  // false for invalid key calls.
  set: function(key, val, options) {

    // Proxy back to Backbone if it's not a single key/val
    if (!key || _.isObject(key)) {
      return Model.__super__.set.apply(this, arguments);
    }

    options || (options = {});

    var fields = key.split('.');
    var result = this;
    for (var i = 0; result && i < fields.length; i++) {
      var isLast = (i === fields.length - 1);
      if (result instanceof Backbone.Model) {
        if (isLast) {
          Model.__super__.set.call(result, fields[i], val, options);
        } else {
          result = result.get(fields[i]);
        }
      } else {
        if (isLast) {
          result[fields[i]] = val;
        } else {
          result = result[fields[i]];
        }
      }
    }

    // Trigger an error event if unable to evaluate nested key
    if (!result) {
      var error = 'Unable to do nested set for invalid key: ' + key;
      this.trigger('lumbar:invalid:set', this, error, _.extend(options, { setError: error }));
      return false;
    }

    return this;
  },

  // Overrides `Backbone.Model` 's default `parse` . Expands attributes as Model instances for
  // attributes configured in `modelAttributes` .
  parse: function(resp) {
    var parsed = _.clone(resp);
    _.each(this.modelAttributes, function(model, attr) {
      if (parsed[attr]) {
        parsed[attr] = new model(parsed[attr], { parse: true });
      }
    });
    return parsed;
  },

  // Extends `Backbone.Model` 's `toJSON` by also further calling toJSON on Model attributes as
  // specified in `modelAttributes`
  toJSON: function(options) {
    var json = Model.__super__.toJSON.apply(this, arguments);
    _.each(this.modelAttributes, function(model, attr) {
      if (this.get(attr)) {
        json[attr] = this.get(attr).toJSON(options);
      }
    }, this);
    return json;
  }

});

module.exports = Model;
