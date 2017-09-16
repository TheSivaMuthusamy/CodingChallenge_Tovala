import React from 'react';

export default class Rectangle extends React.Component {	
	constructor() {
		super();
		this.state = {
			resizing: false,
			dragging: false
		}
	}

	render() {
		return(
			<button className='rectangle' style={this.props.rect} 
			onFocus={() => this.props.selectRect(this.props.rect)}
			onBlur={this.props.deselectRect}>
			<div>derp</div>
			<div>derp</div>
			<div>derp</div>
			<div>derp</div>
			</button>
		)
	}
}