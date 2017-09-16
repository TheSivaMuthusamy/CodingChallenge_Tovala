import React from 'react';
import Rectangle from './Rectangle.jsx'

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			rects: [],
			activeRect: null
		}
		this.colors = this.colors.bind(this);
		this.remove = this.remove.bind(this);
		this.addRectangle = this.addRectangle.bind(this);
		this.removeRectangle = this.removeRectangle.bind(this);
		this.selectRect = this.selectRect.bind(this);
		this.deselectRect = this.deselectRect.bind(this)
		this.getRandomInt = this.getRandomInt.bind(this);
	}

	colors() {
		const colorArray = [];    

		for(let i =0; i < 3 ; i++){
		  colorArray.push(this.getRandomInt(0,255));
		}

		return "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")";
	}

	getRandomInt(min, max) {
  		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	addRectangle() {
		const rwidth = this.getRandomInt(2, 20);
		const rheight = this.getRandomInt(2, 20);
		const rleft = this.getRandomInt(0, (75-rwidth));
		const rbottom = this.getRandomInt(0, (40-rheight));
		const rbackgroundColor = this.colors();
		const rzIndex = this.state.rects.length + 1;
		const rect = {
			width: rwidth + 'rem', height: rheight + 'rem', left: rleft + 'rem', bottom: rbottom + 'rem', backgroundColor: rbackgroundColor, zIndex: rzIndex
		}
		const newState = this.state.rects.concat(rect);
		this.setState({
			rects: newState
		})
	}

	removeRectangle() {
		if(this.state.activeRect == null) {
			return
		}
		const newState = this.remove(this.state.rects, this.state.activeRect)
		this.setState({
			rects: newState,
			activeRect: null
		})
	}

	remove(array, element) {
		const index = array.indexOf(element);
    	if (index !== -1) {
        	array.splice(index, 1);
    	}
    	return array	
	}

	selectRect(rect) {
		this.setState({
			activeRect: rect
		})
	}

	deselectRect() {
		setTimeout(function() {
			this.setState({
				activeRect: null
			})}.bind(this), 1000)
	}

	render() {
		return (
			<div>
				<div className="controls">
					<button className="button" onClick={this.addRectangle}>
						Add Rectangle
					</button>
					<button className="button" onClick={this.removeRectangle}>
						Remove Rectangle
					</button>
				</div>
				<div className="dragspace">
					{this.state.rects.map((rect, key) => {
						return (
							<Rectangle key={key}
							rect={rect}
							selectRect ={this.selectRect}
							deselectRect={this.deselectRect}/>
						)
					})}
				</div>
			</div>
		)
	}
}