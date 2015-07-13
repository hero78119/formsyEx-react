'use strict';
var ErrorMsgLabel = require('./ErrorMsgLabel.jsx');

module.exports = React.createClass({
    render () {
        return (
            <div style={this.props.style}>
                {this.props.children}
                <ErrorMsgLabel msg={this.props.errorMsg} ref='input' />
            </div>
        );
    }
});
