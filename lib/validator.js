var renderUtil = require ('./renderUtil.js');

module.exports = {
    isLength: function (min, max) {
        var lengthLimit = this.props.lengthLimit ? this.props.lengthLimit : {},
            lengthLimitMin = lengthLimit[0] ? lengthLimit[0] : undefined,
            lengthLimitMax = lengthLimit[1] ? lengthLimit[1] : (!isNaN(lengthLimit) ? lengthLimit : undefined),
            val = this.state.value,
            valLength,
            validateSuccess = true,
            errorMsg = '',
            res = {};

        if (this.props.validator) {
            res = this.props.validator(val) || {};
        }

        if (res.res === false) { // res.res is boolean value, false means validation false
            errorMsg = res.msg || 'error!';
            validateSuccess = false;
        }
        else {
            res = validator.STRING(lengthLimitMin, lengthLimitMax).execute(val);

            if (res.res === false) {
                errorMsg = res.msg || 'error!';
                validateSuccess = false;
            }
            else {
            }
        }
        this.setState({errorMsg: errorMsg, validateSuccess: validateSuccess});
        return validateSuccess;

    },
    NUM: function (min, max) {
        var validator = function (preBindArgs, num) {
            var num = num ? _.toNumber(num) : preBindArgs,
                res = {res: true, msg: ''};
            if (isNaN(num)) {
                res.res = false;
                res.msg = 'should be number';
            }
            else if (min !== undefined && num < min) {
                res.res = false;
                res.msg = 'should be larger or equal than ' + min;
            }
            else if (max !== undefined && num > max) {
                res.res = false;
                res.msg = 'should be less or equal to ' + max;
            }
            return res;
        },
        chain = function (funToDecorator) {
                return {
                    execute: function (preBindArgs, num) {
                        var res = validator(preBindArgs, num);
                        if (res.res === false) {
                            return res;
                        }
                        else if (funToDecorator && funToDecorator.call) {
                            return funToDecorator.call(this, preBindArgs, num);
                        }
                        return res;
                    }
                };
        };
        return {
            chain: chain,
            execute: validator
        };
    },
    STRING: function (min, max) {
        var validator = function (preBindArgs, val) {

            var res = {res: true, msg: ''},
                val = renderUtil.convertUtf8String(val ? val.toString() : preBindArgs.toString()),
                valLength = val.length();
            if (min === undefined && max === undefined) {
                return res;
            }

            if (min !== undefined && valLength < min) {
                res.res = false;
                res.msg = 'should be larger or equal than ' + min;
            }
            else if (max !== undefined && valLength > max) {
                res.res = false;
                res.msg = 'should be less or equal to ' + max;
            }
            return res;
        },
        chain = function (funToDecorator) {
                return {
                    execute: function (preBindArgs, str) {
                        var res = validator(preBindArgs, str);
                        if (res.res === false) {
                            return res;
                        }
                        else if (funToDecorator && funToDecorator.call) {
                            return funToDecorator.call(this, preBindArgs, str);

                        }
                        return res;
                    }
                };
        };
        return {
            chain: chain,
            execute: validator
        };
    }

}
