'use strict';
var React = require('react'),
    _ = require('underscore');

module.exports = React.createClass({
    mixins: [
        require('./Mixin.js')
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
    submit (event) {
        event.stopPropagation();
        event.preventDefault();
        var firstErrorComponent = undefined;
            _.each(
                this.inputs,
                    function (component) {
                        firstErrorComponent = (firstErrorComponent === undefined && component.validate() === false ) ? component: firstErrorComponent;
                    }
                );
        firstErrorComponent === undefined ?
            this.props.onSubmit.apply(this, arguments) :
            firstErrorComponent.focus && firstErrorComponent.focus();
    },
    render () {
        return (
            <form onSubmit={this.submit}>
                {this.props.children}
            </form>
        );
    }
});
