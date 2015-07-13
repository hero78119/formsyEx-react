var React = require('react'),
    _ = require('underscore'),
    regForms = {},
    defaultForm = '_DEFAULT_FORM',
    id = 0;

module.exports = {
    focus () {
        if (!this.refs.input) {
            throw new Error('should have a child component with ref name `input`, most of the case ref is set on ErrorMsgLabel');
        }
        React.findDOMNode(this.refs.input) &&
            React.findDOMNode(this.refs.input).focus();
    },
    getInitialState () {
        return {
            _formsyExValue: '',
            _formsyExErrorMsgs: []
        };
    },
    componentWillMount () {
        var component = this;
        if (component.isInit === true) {
            return undefined;
        }
        if (component.isForm) { // form
            // form object
            var formName = component.props.name ? component.props.name : defaultForm;
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
            regForms[regToFormName] ? regForms[regToFormName].register(component) : console.log('can not find any form to register component') ;
        }
        component.isInit = true;
    },
    componentWillUnmount () {
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
            regToFormName = child.props.regForm ? child.props.regForm : defaultForm;
            regForms[regToFormName] ? (regForms[regToFormName].unregister(component)) : undefined ;
        }
    },
    setValue (value) {
        var formsyExErrorMsgs,
            res,
            validators = this.getValidators();

        validators &&
            (formsyExErrorMsgs = _.map(validators,
                function (validator) {
                    res = validator(value);
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
                _formValue: value,
                _formsyExErrorMsgs: formsyExErrorMsgs
            }
        );
    },
    getValue () {
        return this.state._formValue;
    },
    getErrorMsg () {
        return this.state._formsyExErrorMsgs.length === 1 ?
                this.state._formsyExErrorMsgs[0] : this.state._formsyExErrorMsgs;
    },
    getValidators () {
        var validators = (this.validators || []).concat(this.props.validators || []);
        return validators;
    }
}
