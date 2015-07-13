var React = global.React || require('react'),
    FormsyEx = {},
    Form = require('./Form.jsx'),
    Mixin = require('./Mixin.js');

FormsyEx.Mixin = Mixin;
FormsyEx.Form = Form;

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.FormsyEx = FormsyEx;
}

module.exports = FormsyEx;
