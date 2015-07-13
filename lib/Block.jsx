'use strict';
var React = global.React || require('react');

module.exports = React.createClass({
    mixins: [
       require('./Mixin.js')
    ],
    render () {
        var errorMsg = this.getErrorMsg();
        console.log('HaHaHa');
        console.log(errorMsg);
        return (
            <div style={this.props.style}>
                {this.props.children}
                <label style={{color: 'red'}}>{errorMsg}<input ref='focus' style={{opacity: '0'}}/></label>
            </div>
        );
    }
});
