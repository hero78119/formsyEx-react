var jsdom = require('jsdom').jsdom;

global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator = {userAgent: 'node.js'};
global.window.document  = global.document;

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    FormsyEx = require('./../lib/main.js'),
    Form = FormsyEx.Form,
    Block = FormsyEx.Block,
    sinon = require('sinon'),
    Input = require('./../lib/Input.jsx'),
    _ = require('underscore'),
    Testlib = {
        initEnvironment: function () {
            global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
            global.window = document.parentWindow;
            global.navigator = {userAgent: 'node.js'};
            global.window.document  = global.document;
        },
        renderJSX: function (jsx, context) {
            return Testlib.renderComponent(React.createClass({
                displayName: 'TestJSX',
                render: function () {return jsx;}
            }), undefined, context);
        },
        renderComponent: function (react, props, context) {
            var rendered;
            rendered = TestUtils.renderIntoDocument(React.createElement(react, props));
            return TestUtils.findRenderedComponentWithType(rendered, react);
        }
    };

require('react/lib/ExecutionEnvironment').canUseDOM = true;

describe ('FormsyEx', function () {

    describe ('form component registration', function () {
         var form;
         afterEach(function () {
             try {
                form.componentWillUnmount();
             } catch (e) {
                React.unmountComponentAtNode(React.findDOMNode(form).parentNode);
             }
         });

         it('should render form into document', function () {
             form = Testlib.renderJSX(<Form onSubmit={function () {}}></Form>);
             expect(form.getDOMNode().tagName).toEqual('FORM');
         })

         it('should register first level components into the form', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}}>
                    <Input />
                    <Input name='test' />
                 </Form>
             );
             expect(form.getDOMNode().tagName).toEqual('FORM');
             expect(_.values(form.inputs).length).toEqual(1);
         })

         it('should register first level components into the form with child name', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}}>
                    <Input name='test' />
                 </Form>
             );
             expect(_.values(form.inputs).length).toEqual(1);
         })


         it('should register first level components into the form even giving form name but child not', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}} name='testform3'>
                    <Input />
                 </Form>
             );
             expect(_.values(form.inputs).length).toEqual(0);
         })

         it('should register first level components into the form even giving form name and so as for child', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}} name='foo'>
                    <Input regForm='foo' name='input1' />
                 </Form>
             );
             expect(_.values(form.inputs).length).toEqual(1);
         })

         it('should NOT register first level components into the form even giving form name and so as for child', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}} name='foo'>
                    <Input regForm='ffoo' name='bar1' />
                 </Form>
             );
             expect(_.values(form.inputs).length).toEqual(0);
         })

         it('should register nested components into the form', function () {
             form = TestUtils.renderIntoDocument(
                 <Form onSubmit={function () {}} name='foo'>
                    <div>
                        <Input name='bar1' />
                    </div>
                    <Input name='bar2' />
                    <Input/>
                 </Form>
             );
             expect(_.values(form.inputs).length).toEqual(2);
         })

         it('should register components outside into the default form', function () {
             var Component = React.createClass({
                 render: function () {
                     return (
                         <div>
                             <Form onSubmit={function () {}} ref='foo'>
                             </Form>
                             <div>
                                 <Input name='bar1' />
                             </div>
                             <Input name='bar2' />
                             <Input/>
                         </div>
                     );
                 }
             });
             form = TestUtils.renderIntoDocument(
                 <Component />
             );
             expect(_.values(form.refs.foo.inputs).length).toEqual(2);
         })

         it('should register components outside into the default form with form appearing behind them', function () {
             var Component = React.createClass({
                 render: function () {
                     return (
                         <div>
                             <div>
                                 <Input name='bar1' />
                             </div>
                             <Input name='bar2' />
                             <Input/>
                             <Form onSubmit={function () {}} ref='foo'>
                             </Form>
                         </div>
                     );
                 }
             });
             form = TestUtils.renderIntoDocument(
                 <Component />
             );
             expect(_.values(form.refs.foo.inputs).length).toEqual(2);
         })

         it('should register components outside into the form respectively with forms appearing behind them', function () {
             var Component = React.createClass({
                 render: function () {
                     return (
                         <div>
                             <div>
                                 <Input regForm='foo1' name='bar1' />
                             </div>
                             <Input regForm='foo2' name='bar2' />
                             <Input name='bar3' />
                             <Input/>
                             <Form onSubmit={function () {}} ref='foo1' name='foo1' />
                             <Form onSubmit={function () {}} ref='foo2' name='foo2' />
                             <Form onSubmit={function () {}} ref='foo3' />
                         </div>
                     );
                 }
             });
             form = TestUtils.renderIntoDocument(
                 <Component />
             );
             expect(_.values(form.refs.foo1.inputs).length).toEqual(1);
             expect(_.values(form.refs.foo2.inputs).length).toEqual(1);
             expect(_.values(form.refs.foo3.inputs).length).toEqual(1);
         })

         it('should validate form when submit', function () {
             var MockInput = Input;
             var stubInput = sinon.stub(MockInput.type.prototype.__reactAutoBindMap, "validate");
             var MockBlock = Block;
             var stubBlockValidate = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "validate");
             var Component = React.createClass({
                 render: function () {
                     return (
                         <Form onSubmit={function () {}} ref='foo' name='foo' >
                            <MockBlock name='block'>
                                <MockInput regForm='foo' name='bar1' value='123'/>
                            </MockBlock>
                         </Form>
                     );
                 }
             });
             form = Testlib.renderJSX(
                 <Component />
             );
             TestUtils.Simulate.submit(form.getDOMNode());
             TestUtils.Simulate.click(React.findDOMNode(form).childNodes[0].childNodes[0]);
             sinon.assert.calledOnce(stubInput);
             sinon.assert.calledOnce(stubBlockValidate);
             stubBlockValidate.restore();
             stubInput.restore();
         })

         it('should validate form when submit and focus on first validation error component', function () {
             var MockBlock = Block;
             var MockInput = Input;
             var stubInput = sinon.stub(MockInput.type.prototype.__reactAutoBindMap, "validate");
             var stubBlockValidate = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "validate").returns(false);
             var stubBlockFocus = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "focus");
             var Component = React.createClass({
                 render: function () {
                     return (
                         <Form onSubmit={function () {}} ref='foo' name='foo' >
                            <MockBlock name='block'>
                                <MockInput regForm='foo' name='bar1' value='123'/>
                            </MockBlock>
                            <MockInput regForm='foo' name='bar2' value='234'/>
                         </Form>
                     );
                 }
             });
             form = Testlib.renderJSX(
                 <Component />
             );
             TestUtils.Simulate.submit(form.getDOMNode());
             sinon.assert.calledTwice(stubInput);
             sinon.assert.calledOnce(stubBlockValidate);
             sinon.assert.calledOnce(stubBlockFocus);
             stubInput.restore();
             stubBlockValidate.restore();
             stubBlockFocus.restore();
         })

         it('should validate form if call validate function directly and focus on first validation error component', function () {
             var MockInput = Input;
             var stubInput = sinon.stub(MockInput.type.prototype.__reactAutoBindMap, "validate");
             var MockBlock = Block;
             var stubBlockValidate = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "validate").returns(false);
             var stubBlockFocus = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "focus");
             var Component = React.createClass({
                 render: function () {
                     return (
                         <Form onSubmit={function () {}} ref='foo' name='foo' >
                            <MockBlock name='block'>
                                <MockInput regForm='foo' name='bar1' value='123'/>
                            </MockBlock>
                            <input onClick={function () {
                                this.refs.foo.validate();
                            }} />
                         </Form>
                     );
                 }
             });
             form = Testlib.renderJSX(
                 <Component />
             );
             TestUtils.Simulate.submit(form.getDOMNode().childNodes[1]);
             sinon.assert.calledOnce(stubInput);
             sinon.assert.calledOnce(stubBlockValidate);
             sinon.assert.calledOnce(stubBlockFocus);
             stubBlockValidate.restore();
             stubInput.restore();
             stubBlockFocus.restore();
         })


         it('should trigger onClick on Block element ', function () {
             var MockBlock = Block;
             var stubBlockOnClick = sinon.stub(MockBlock.type.prototype.__reactAutoBindMap, "onClick");
             var onClickCallBack = sinon.spy();
             var Component = React.createClass({
                 render: function () {
                     return (
                         <Form onSubmit={function () {}} ref='foo' name='foo' >
                            <MockBlock name='block'>
                                <Input regForm='foo' name='bar1' value='123' onClick={onClickCallBack}/>
                            </MockBlock>
                         </Form>
                     );
                 }
             });
             form = Testlib.renderJSX(
                 <Component />
             );
             TestUtils.Simulate.click(React.findDOMNode(form).childNodes[0].childNodes[0]);
             sinon.assert.calledOnce(stubBlockOnClick);
             sinon.assert.calledOnce(onClickCallBack);
         })

         it('should not prompt error event onClick is not defined', function () {
             var Component = React.createClass({
                 render: function () {
                     return (
                         <Form onSubmit={function () {}} ref='foo' name='foo' >
                            <Block name='block'>
                                <Input regForm='foo' name='bar1' value='123' onClick={undefined}/>
                            </Block>
                         </Form>
                     );
                 }
             });
             form = Testlib.renderJSX(
                 <Component />
             );
             TestUtils.Simulate.click(React.findDOMNode(form).childNodes[0].childNodes[0]);
         })

    });
});

