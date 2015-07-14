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
                    <div>
                        <Block validators={[function (val) {console.log('Orzz'); return {res: false, msg: 'QQOO'};}]}>
                            <Input name='hahaha' validators={[function (val) {return val.toString() === '345' ? {res: true} : {res: false, msg: 'yayaya345'}}]} onChange={this.onChange} />
                            <span>HiHiHI</span>
                        </Block>
                    </div>
                <FormsyEx.Form onSubmit={this.submit}>
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
