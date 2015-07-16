var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    FormsyEx = require('./../lib/main.js'),
    Input = require('./../lib/Input.jsx'),
    _ = require('underscore');

describe ('FormsyEx', function () {

    describe ('form component registration', function () {
         var form;
         afterEach(function () {
             form.componentWillUnmount();
         });

         it('should render form into document', function () {
             form = TestUtils.renderIntoDocument(<FormsyEx.Form></FormsyEx.Form>);
             expect(form.getDOMNode().tagName).toEqual('FORM');
         })

         it('should register first level components into the form', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form>
                    <Input />
                    <Input name='test' />
                 </FormsyEx.Form>
             );
             expect(form.getDOMNode().tagName).toEqual('FORM');
             expect(_.values(form.inputs).length).toEqual(1);
         })

         it('should register first level components into the form with child name', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form>
                    <Input name='test' />
                 </FormsyEx.Form>
             );
             expect(_.values(form.inputs).length).toEqual(1);
         })


         it('should register first level components into the form even giving form name but child not', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form name='testform3'>
                    <Input />
                 </FormsyEx.Form>
             );
             expect(_.values(form.inputs).length).toEqual(0);
         })

         it('should register first level components into the form even giving form name and so as for child', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form name='foo'>
                    <Input regForm='foo' name='input1' />
                 </FormsyEx.Form>
             );
             expect(_.values(form.inputs).length).toEqual(1);
         })

         it('should NOT register first level components into the form even giving form name and so as for child', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form name='foo'>
                    <Input regForm='ffoo' name='bar1' />
                 </FormsyEx.Form>
             );
             expect(_.values(form.inputs).length).toEqual(0);
         })

         it('should register nested components into the form', function () {
             form = TestUtils.renderIntoDocument(
                 <FormsyEx.Form name='foo'>
                    <div>
                        <Input name='bar1' />
                    </div>
                    <Input name='bar2' />
                    <Input/>
                 </FormsyEx.Form>
             );
             expect(_.values(form.inputs).length).toEqual(2);
         })
    });
});

