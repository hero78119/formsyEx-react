var React = global.React || require('react'),
    FormsyEx = {},
    Form = require('./Form.jsx'),
    Block = require('./Block.jsx'),
    Mixin = require('./Mixin.js');

FormsyEx.Mixin = Mixin;
FormsyEx.Form = Form;
FormsyEx.Block = Block;

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.FormsyEx = FormsyEx;
}

module.exports = FormsyEx;
