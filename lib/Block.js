'use strict';
var React = global.React || require('react');


module.exports = React.createClass({displayName: "a",
    mixins: [
       require('./Mixin')
    ],
    render: function () {
        var errorMsg = this.getErrorMsg();
        return (
            React.createElement("div", {style: this.props.style, onClick: this.onClick},
                this.props.children,
                React.createElement("label", {style: {color: 'red'}}, errorMsg, React.createElement("input", {ref: "focus", style: {opacity: '0'}}))
            )
        );
    }
});
