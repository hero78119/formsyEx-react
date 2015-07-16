require('babel/register');

var path = require('path');
var jsdom = require('jsdom').jsdom;
var jasmine = require('jasmine-node');

global.document = jsdom();
global.window = document.defaultView;
global.navigator = global.window.navigator;

var jasmineOptions = {
  specFolders: [path.resolve(__dirname, 'test')],
  //onComplete: onComplete,
  isVerbose: true,
  showColors: true,
  teamcity: false,
  useRequireJs: false,
  regExpSpec: /\.js$/,
  junitreport: true,
  includeStackTrace: true,
};

jasmine.executeSpecsInFolder(jasmineOptions);
