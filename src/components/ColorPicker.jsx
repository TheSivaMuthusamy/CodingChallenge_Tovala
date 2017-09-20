import React from 'react';
import PropTypes from 'prop-types';

export default class ColorPicker extends React.Component {
	constructor() {
		super()
		this.state = {
			value: ''
		}
		this.rgb2hex = this.rgb2hex.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onClick = this.onClick.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		// Sets the value of the color picker input to the active rect
		if (!Object.getOwnPropertyNames(nextProps.activeRect).length === 0) {
			const nValue = (nextProps.activeRect.backgroundColor[0] == '#') 
							? nextProps.activeRect.backgroundColor.slice(1, (nextProps.activeRect.backgroundColor).length) 
							: this.rgb2hex(nextProps.activeRect.backgroundColor)
			this.setState({
				value: nValue
			})
		} else {
			this.setState({
				value: ''
			})
		}
	}

	rgb2hex(rgb) {
		// Helper function that converts rgb values to hex. Returns hex in string
 		rgb = rgb.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 		return (rgb) ? 
  				("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  				("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  				("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	onClick(e){
		// Prevents parent onClick from firing
		e.stopPropagation();
		e.preventDefault();
	}

	onChange(value) {
		// Handles changes in the color picker input
		this.setState({
             value: value
        });
	}

	render() {
		const style = (this.props.colorMenuVisible) ? {} : {visibility: 'hidden'}
		return (
			<div className='picker' style={style} onClick={this.onClick}>
				<div style={{padding: '15px 9px 9px 15px'}}>
					{this.props.colors.map((color, key) => {
						const background = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
						return (
							<span key={key}>
								<div className="swatch" style={{backgroundColor: background}} 
								onClick={(e) => this.props.onClick(background, e)}/>
							</span>
						)
					})}
					<div className="placeholder">#</div>
					<div className="input-wrapper">
						<input className="color-input" value={this.state.value}
						onClick = {this.onClick}
						placeholder="Enter Hex Value..." 
						onChange={(e) => this.onChange(e.target.value)} 
						onKeyDown={this.props.onKeyDown}/>
					</div>
				</div>
			</div>
		)
	}
}

ColorPicker.propTypes = {
	activeRect: PropTypes.object,
	colorMenuVisible: PropTypes.bool,
	colors: PropTypes.array,
	onClick: PropTypes.func,
	onKeyDown: PropTypes.func
}