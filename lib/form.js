var React = global.React || require('react'),
    _ = require('underscore');
module.exports = function () {
    return {
        isForm: true,
        register: function (child) {
            this.inputs = this.inputs || {};
            this.childId = this.childId || 0;
            child.props.regId = child.props.name ||
                (child._store && child._store.props.name) ||
                this.childId++;
            this.inputs[child.props.regId] = child;
            child.props.isAttached = true;
        },
        unregister: function (child) {
            delete this.inputs[child.props.regId];
            child.props.isAttached = false;
        },
        submit: function (event) {
            event.stopPropagation() || event.preventDefault();
            var firstErrorComponent = undefined;
            _.each(
                this.inputs,
                    function (component) {
                        var res = component.validate();
                        firstErrorComponent = (firstErrorComponent === undefined && res === false) ? component: firstErrorComponent;
                    }
                );
            firstErrorComponent === undefined ?
                this.props.onSubmit.apply(this, arguments) :
                firstErrorComponent.focus && firstErrorComponent.focus();
        },
        render: function () {
            return React.createElement('form',
                {onSubmit: this.submit, style: this.props.style, className: this.props.className},
                this.props.children
            );
        }
    };
};
