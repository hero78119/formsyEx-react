var React = global.React || require('react'),
    _ = require('underscore');
module.exports = function () {
    return {
        isForm: true,
        register: function (child) {
            this.inputs = this.inputs || {};
            this.childId = this.childId || 0;
            child.regId = child.props.name || this.childId++;
            this.inputs[child.regId] = child;
        },
        unregister: function (child) {
            delete this.inputs[child.regId];
        },
        submit: function (event) {
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
        render: function () {
            return (
                <form onSubmit={this.submit}>
                    {this.props.children}
                </form>
            );
        }
    };
};
