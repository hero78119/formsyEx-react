'use strict';

/* global Promise */
var React = require('react'),
    FormsyEx = require('../lib/main'),
    Input = require('../lib/Input.jsx'),
    Block = require('../lib/Block.jsx'),
    Top = React.createClass({
    submit: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    render: function () {
        return (
            <div>
                <FormsyEx.Form name='Hi123' onSubmit={this.submit}>
                    <div>
                        <Block regForm='Hi123' validators={[function (val) {console.log('Orzz'); return {res: false, msg: 'QQOO'};}]}>
                            <Input regForm='Hi123' name='hahaha' validators={[function (val) {return val.toString() === '345' ? {res: true} : {res: false, msg: 'yayaya345'}}]} onChange={this.onChange} />
                            <span>HiHiHI</span>
                        </Block>
                    </div>
                    <input type='submit' />
                </FormsyEx.Form>
            </div>
        );
    }
    });

React.render(
            <Top />,
            document.getElementById('container')
);
