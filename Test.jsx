'use strict';

/* global Promise */
var React = require('react'),
    Form = require('./lib/Form'),
    Input = require('./lib/Input'),
    Top = React.createClass({
    submit: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    render: function () {
        return (
            <div>
                <Form name='Hi123' onSubmit={this.submit}>
                    <Input regForm='Hi123' name='hahaha' validators={[function (val) {console.log(val); return val.toString() === '345' ? {res: true} : {res: false, msg: 'yayaya345'}}]}/>
                    <span> HiHiHI</span>
                    <input type='submit' />
                </Form>
            </div>
        );
    }
    });

React.render(
            <Top />,
            document.getElementById('container')
);
