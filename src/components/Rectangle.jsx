import React from 'react';
import PropTypes from 'prop-types';

export default class Rectangle extends React.Component {	
	constructor() {
		super();
	}

	render() {
		const cn = (this.props.activeRect == this.props.rect) ? 'active-rectangle' : 'rectangle'
		return(
			<button className={cn} style={this.props.rect} 
			onMouseDown={(e) => this.props.onMouseDown(e, this.props.rect)}
			onMouseUp={this.props.onMouseUp}
			onMouseMove={this.props.onMouseMove}
			>
				<div className="ne resize" 
				onMouseDown={(e) => this.props.onMouseDownNE(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveNE}
				/>
				<div className="se resize"
				onMouseDown={(e) => this.props.onMouseDownSE(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveSE}
				/>
				<div className="sw resize"
				onMouseDown={(e) => this.props.onMouseDownSW(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveSW}
				/>
				<div className="nw resize"
				onMouseDown={(e) => this.props.onMouseDownNW(e, this.props.rect)}
				onMouseUp={this.props.onMouseUp}
				onMouseMove={this.props.onMouseMoveNW}
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
	rect: PropTypes.object,
	activeRect: PropTypes.object
}