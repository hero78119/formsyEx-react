var FormsyEx = {},
    React = global.React || require('react'),
    Block = require('./Block.jsx'),
    Mixin = require('./Mixin'),
    form = require('./form')();

form['mixins'] = [Mixin.FormMixin];

FormsyEx.Mixin = Mixin;
FormsyEx.Form = React.createClass(form);
FormsyEx.Block = Block;

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.FormsyEx = FormsyEx;
}

module.exports = FormsyEx;
