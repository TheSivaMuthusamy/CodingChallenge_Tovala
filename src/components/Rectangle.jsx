import React from 'react';
import PropTypes from 'prop-types';

export default class Rectangle extends React.Component {	
	constructor() {
		super();
	}

	render() {
		return(
			<button className='rectangle' style={this.props.rect} 
			onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
			onMouseUp={this.props.onMouseUp}
			onMouseMove={this.props.onMouseMove}
			onMouseLeave={this.props.onMouseLeave}
			>
				<div className="ne resize" 
				onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveNE}
				onMouseLeave={this.props.onMouseLeave}
				/>
				<div className="se resize"
				onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveSE}
				onMouseLeave={this.props.onMouseLeave}
				/>
				<div className="sw resize"
				onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveSW}
				onMouseLeave={this.props.onMouseLeave}
				/>
				<div className="nw resize"
				onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveNW}
				onMouseLeave={this.props.onMouseLeave}
				/>
			</button>
		)
	}
}

Rectangle.propTypes = {
	onMouseDown: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseMoveNW: PropTypes.func,
	onMouseMoveNE: PropTypes.func,
	onMouseMoveSW: PropTypes.func,
	onMouseMoveSE: PropTypes.func,
	onMouseUp: PropTypes.func,
	rect: PropTypes.object
}