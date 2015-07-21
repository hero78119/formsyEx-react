var React = global.React || require('react'),
    _ = require('underscore'),
    regForms = {},
    mockForm = require('./form'),
    defaultForm = '_DEFAULT_FORM',
    objectAssign = require('./utils').objectAssign,

Mixin = {
    focus: function () {
        React.findDOMNode(this.refs.focus) &&
            React.findDOMNode(this.refs.focus).focus();
    },
    getInitialState: function () {
        return {
            _formsyExValue: '',
            _formsyExErrorMsgs: []
        };
    },
    onClick : function (event) {
        this.resetErrorMsg();
        this.props.onClick && this.props.onClick.apply(this, arguments);
    },
    componentWillMount: function () {
        var component = this,
            regToFormName;
        if (component.props.isAttached === true ||
            component.props.name === undefined ) {
            return undefined;
        }
        if (component.props.attachToForm) {
            component.props.attachToForm(component);
        } else {
            regToFormName = component.props.regForm ? component.props.regForm : defaultForm;
            if (regForms[regToFormName] === undefined) {
                regForms[regToFormName] = mockForm();
            }
            regForms[regToFormName].register(component);
        }
    },
    componentWillUnmount: function () {
        var component = this;
        if (component.props.isAttached === false) {
            return undefined;
        }
        if (component.props.detachFromForm) {
            component.props.detachFromForm(component);
        } else {
            var regToFormName = component.props.regForm ? component.props.regForm : defaultForm;
            regForms[regToFormName] ? (regForms[regToFormName].unregister(component)) : undefined ;
        }
    },
    validate: function (value) {
        var _value = value !== undefined ? value : this.state._formValue,
            validators = this.getValidators(),
            formsyExErrorMsgs,
            isContinue = true,
            res;
        validators &&
            (formsyExErrorMsgs = _.map(validators,
                function (validator) {
                    if (isContinue === false) {
                        return '';
                    }
                    res = validator(_value) || {};
                    if (res.continue === false) {
                        isContinue = false;
                    }
                    if (res.res === false) {
                        return res.msg;
                    }
                    return '';
                }
            ));
        formsyExErrorMsgs = _.filter(
            formsyExErrorMsgs,
            function (formsyExErrorMsg) {
                return true && formsyExErrorMsg;
            }
        );
        this.setState(
            {
                _formValue: _value,
                _formsyExErrorMsgs: formsyExErrorMsgs
            }
        );
        return formsyExErrorMsgs.length === 0;
    },
    getValue: function () {
        return this.state._formValue;
    },
    getErrorMsg: function () {
        return this.state._formsyExErrorMsgs.length === 1 ?
                this.state._formsyExErrorMsgs[0] : this.state._formsyExErrorMsgs;
    },
    resetErrorMsg: function () {
        this.setState({_formsyExErrorMsgs: []});
    },
    getValidators: function () {
        var propertyValidator =  this.validators && this.validators.call ?
            [this.validators] :
            (this.validators || []),
            validators = propertyValidator.concat(this.props.validators || []);
        return validators;
    }
},
FormMixin = objectAssign({}, Mixin, {
    attachToForm: function (component) {
        this.register(component);
    },
    detachFromForm: function (component) {
        this.unregister(component);
    },
    validate: function () {
        var firstErrorComponent = undefined;
        _.each(
            this.inputs,
                function (component) {
                    if (component.props.isAttached === false) { // tmp fix: DO NOT validate component if it already umount
                        return undefined;
                    }
                    var res = component.validate();
                    firstErrorComponent = (firstErrorComponent === undefined && res === false) ? component: firstErrorComponent;
                }
            );
        firstErrorComponent !== undefined ?
            firstErrorComponent.focus && firstErrorComponent.focus() : undefined;
        return firstErrorComponent;
    },
    regInputs: function (formName, children) {
         React.Children.forEach(
            children,
            function (child) {
                if (
                    child.props.regForm !== undefined &&
                    child.props.regForm !== formName
                   ) {
                    // components are registered to another form
                    return undefined;
                }

                if (child.props.children) { // DFS to explore child first
                    this.regInputs(formName, child.props.children);
                }

                if (child.props.name === undefined) {
                    return undefined;
                }

                child.props.attachToForm = this.attachToForm;
                child.props.detachFromForm = this.detachFromForm;

            }.bind(this)
        );
    },
    componentWillMount: function () {
        var component = this;
        var formName = component.props.name ? component.props.name : defaultForm;
        if (!component.props.onSubmit || !component.props.onSubmit.apply ) {
            throw 'should define onSubmit and pass as `props` to FormsyEx.Form';
        }
        if (regForms[formName]) {
            component.inputs = regForms[formName].inputs;
            component.childId = regForms[formName].childId;
        }
        regForms[formName] = component;
        this.regInputs(formName, component.props.children);
    },
    componentWillUnmount: function () {
        var component = this;
        // form object
        var formName = component.props.name ? component.props.name : defaultForm;
        delete regForms[formName];
    },
    submit: function (event) {
            event.stopPropagation() || event.preventDefault();
            var firstErrorComponent = this.validate();
            firstErrorComponent === undefined ?
                this.props.onSubmit.apply(this, arguments) :
                undefined;
    },
    render: function () {
            return React.createElement('form',
                {onSubmit: this.submit, style: this.props.style, className: this.props.className},
                this.props.children
            );
    }
});
module.exports = Mixin;
module.exports.FormMixin = FormMixin;
