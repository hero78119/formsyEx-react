'use strict';
var React = global.React || require('react'),
    objectAssign = require('object-assign');
module.exports = React.createClass(objectAssign({mixins: [require('./Mixin')]}, require('./form')()));

