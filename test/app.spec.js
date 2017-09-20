import React from 'react';
import ReactDOM from 'react-dom'
import {shallow, mount} from 'enzyme';
import chai from 'chai';
import App from '../src/components/App';
import Rectangle from '../src/components/Rectangle' 



const expect = chai.expect

describe('App', () => {
	it('renders', () => {
		const wrapper = shallow(<App/>);
		expect(wrapper.find('.App').length).to.equal(1)
	});
	it('renders add button', () => {
		const wrapper = shallow(<App/>);
		expect(wrapper.find('.add').length).to.equal(1)
	})
	it('adds rectangle', () => {
		const wrapper = shallow(<App/>);
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		expect(wrapper.find(Rectangle).length).to.equal(1)
	})
	it('renders remove button', () => {
		const wrapper = shallow(<App/>);
		expect(wrapper.find('.remove').length).to.equal(1)
	})
	it('removes rectangle', () => {
		const wrapper = shallow(<App/>);
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find(Rectangle).simulate('mouseDown', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find('.remove').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		expect(wrapper.find(Rectangle).length).to.equal(0)
	})
	it('render clear button', () => {
		const wrapper = shallow(<App />);
		expect(wrapper.find('.clear').length).to.equal(1)
	})
	it('clears space', () => {
		const wrapper = shallow(<App/>);
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find('.clear').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		expect(wrapper.find(Rectangle).length).to.equal(0)
	})
	it('drags + resizes', () => {
		const wrapper = shallow(<App/>);
		wrapper.find('.add').simulate('click', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		const ptop = wrapper.state().rects[0].top
		const pleft = wrapper.state().rects[0].left
		wrapper.find(Rectangle).simulate('mouseDown', { stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		wrapper.find(Rectangle).simulate('mouseMove', {pageX: 200, pageY: 300, stopPropagation: ()=> undefined, preventDefault: ()=> undefined});
		expect(wrapper.state().activeRect.top).to.not.equal(ptop)
		expect(wrapper.state().activeRect.left).to.not.equal(pleft)
	})
});