'use strict';
var React = require('react');

module.exports = React.createClass({
    mixins: [
        require('./Mixin.js')
    ],

    onChange: function (event) {
        this.validate(event.target.value);
        this.props.onChange && this.props.onChange(evnet);
    },

    validators: [
        function (val) {return val && val.toString() === '123' ? {res: true} : {res: false, msg: 'yayaya123'}},
        function (val) {return val && val.toString() === '234' ? {res: true} : {res: false, msg: 'yayaya234'}}
    ],

    render: function () {
        var errorMsg = this.getErrorMsg(),
            value = this.getValue();

        return (
            <div onClick={this.onClick}>
                <input name={this.props.name} ref='focus' onChange={this.onChange} onBlur={this.onChange} value={value} placeholder={this.props.placeholder} />
                {errorMsg ? <div><label style={{color: 'red'}}>{errorMsg}</label></div>: ''}
            </div>
        );
    }
});
