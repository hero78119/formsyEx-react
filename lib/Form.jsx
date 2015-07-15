'use strict';
var React = global.React || require('react'),
    form = require('./form')();

form['mixins'] = [require('./Mixin')];
module.exports = React.createClass(form);

