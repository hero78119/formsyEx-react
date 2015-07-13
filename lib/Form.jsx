'use strict';
var React = require('react');

module.exports = React.createClass({
    mixins: [
        require('./FormsyExMixin.jsx')
    ],
    isForm: true,
    register (child) {
        this.inputs = this.inputs || {};
        this.childId = this.childId || 0;
        child.regId = child.props.name || this.childId++;
        this.inputs[child.regId] = child;
    },
    unregister (child) {
        delete this.inputs[child.regId];
    },
    render () {
        return (
            <form onSubmit={
                function () {
                    console.log(this.inputs);
                    return this.props.onSubmit.apply(this, arguments)
                }.bind(this)
            }>
                {this.props.children}
            </form>
        );
    }
});
