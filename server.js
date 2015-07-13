'use strict';

// manhattan fix
process.chdir(__dirname);

var port = process.env.port || 12345,
    express = require('express'),
    React = require('react'),
    app = express();

var middleware = function (req, res) {
    var result = '<html><body> <div id="container"> </div> <script src="/js/main.js"></script></body></html>';
    res.send(result);
};

app.listen(port, '0.0.0.0');
app.use(express.static('static'));
app.use('/', middleware);
console.log('Mock server started on port ' + port);
