var React = global.React || require('react'),
    _ = require('underscore'),
    regForms = {},
    mockForm = require('./form'),
    defaultForm = '_DEFAULT_FORM';

module.exports = {
    focus: function () {
        // if (!this.refs.focus) {
        //    throw new Error('should have a child component with ref name `input`, most of the case ref is set on ErrorMsgLabel');
        // }
        React.findDOMNode(this.refs.focus) &&
            React.findDOMNode(this.refs.focus).focus();
    },
    getInitialState: function () {
        return {
            _formsyExValue: '',
            _formsyExErrorMsgs: []
        };
    },
    componentWillMount: function () {
        var component = this;
        if (component.isInit === true) {
            return undefined;
        }
        if (component.isForm) { // form
            // form object
            var formName = component.props.name ? component.props.name : defaultForm;
            if (regForms[formName]) {
                component.inputs = regForms[formName].inputs;
                component.childId = regForms[formName].childId;
            }
            regForms[formName] = component;
            React.Children.forEach(
                component.children,
                function (child) {
                    if (
                        child.props.regForm !== undefined &&
                        child.props.regForm !== formName
                       ) {
                        // components are registered to another form
                        return undefined;
                    }
                    component.register(child);
                    child.isInit = true;
                }
            );
        }
        else { // elements in form
            var regToFormName;
            // if (!this.validator || !this.validator.call) {
            //    throw new Error('should implement `focus` and `validator` function');
            // }
            regToFormName = component.props.regForm ? component.props.regForm : defaultForm;
            if (regForms[regToFormName] === undefined) {
                regForms[regToFormName] = mockForm();
            }
            regForms[regToFormName].register(component);
        }
        component.isInit = true;
    },
    componentWillUnmount: function () {
        var component = this;
        if (!component.isInit) {
            return undefined;
        }
        if (component.isForm) { // form
            // form object
            var formName = component.props.name ? component.props.name : defaultForm;
            delete regForms[formName];
            component.isInit = false;
        }
        else { // elements in form
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
        )
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
    getValidators: function () {
        var propertyValidator =  this.validators && this.validators.call ?
            [this.validators] :
            (this.validators || []),
            validators = propertyValidator.concat(this.props.validators || []);
        return validators;
    }
}
