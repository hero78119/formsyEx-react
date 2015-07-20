var React = global.React || require('react'),
    _ = require('underscore');
module.exports = function () {
    return {
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
        }
    };
};
