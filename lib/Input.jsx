'use strict';
var React = require('react');

module.exports = React.createClass({
    mixins: [
        require('./FormsyExMixin.jsx')
    ],

    onChange (event) {
        this.setValue(event.target.value);
    },

validators: [
    function (val) {return val.toString() === '123' ? {res: true} : {res: false, msg: 'yayaya123'}},
    function (val) {return val.toString() === '234' ? {res: true} : {res: false, msg: 'yayaya234'}}
    ]
    ,

    render () {
        var errorMsg = this.getErrorMsg(),
            value = this.getValue();

        return (
            <div>
                <input name={this.props.name} ref='input' onChange={this.onChange} onBlur={this.onChange} value={value} placeholder={this.props.placeholder} />
                {errorMsg ? <div><label style={{color: 'red'}}>{errorMsg}</label></div>: ''}
            </div>
        );
    }
});
