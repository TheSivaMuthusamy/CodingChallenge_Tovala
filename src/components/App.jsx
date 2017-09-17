import React from 'react';
import Rectangle from './Rectangle.jsx';
import ColorPicker from './ColorPicker.jsx'
import ReactDOM from 'react-dom';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			rects: [],
			activeRect: null,
			resizing: false,
			dragging: false,
			rel : {
				x: null,
				y: null
			},
			initWidth: null,
			initHeight: null,
			initTop: null,
			initLeft: null,
			colors: [[255, 105, 0],[252, 185, 0],[123, 220, 181], [0, 208, 132], [142, 209, 252], 
					[6, 147, 227], [171, 184, 195], [235, 20, 76], [247, 141, 167], [153, 0, 239]]
		}
		this.colors = this.colors.bind(this);
		this.remove = this.remove.bind(this);
		this.checkXBounds = this.checkXBounds.bind(this);
		this.checkYBounds = this.checkYBounds.bind(this);
		this.addRectangle = this.addRectangle.bind(this);
		this.deselectRect = this.deselectRect.bind(this);
		this.removeRectangle = this.removeRectangle.bind(this);
		this.getRandomInt = this.getRandomInt.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMoveNE = this.onMouseMoveNE.bind(this);
		this.onMouseMoveSE = this.onMouseMoveSE.bind(this);
		this.onMouseMoveSW = this.onMouseMoveSW.bind(this);
		this.onMouseMoveNW = this.onMouseMoveNW.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this)
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
		const rwidth = this.getRandomInt(32, 320);
		const rheight = this.getRandomInt(32, 320);
		const rleft = this.getRandomInt(0, (1200-rwidth));
		const rtop = this.getRandomInt(0, (640-rheight));
		const rbackgroundColor = this.colors();
		const rzIndex = this.state.rects.length + 1;
		const rect = {
			width: rwidth + 'px', height: rheight + 'px', left: rleft + 'px', top: rtop + 'px', 
			backgroundColor: rbackgroundColor, zIndex: rzIndex
		}
		const newState = this.state.rects.concat(rect);
		this.setState({
			rects: newState
		})
	}

	deselectRect() {
		setTimeout(function() {
			this.setState({
				activeRect: null
			})}.bind(this), 1000)
	}

	removeRectangle() {
		if(this.state.activeRect == null) return
		
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

	checkXBounds(x, rect) {
		if (x + parseInt(rect.width, 10) > 1200) {
			return 1200 - parseInt(rect.width,10)
		} else if (x < 0) {
			return 0
		}

		return x
	}

	checkYBounds(y, rect) {
		if (y + parseInt(rect.height, 10) > 640) {
			return 640 - parseInt(rect.height,10)
		} else if (y < 0) {
			return 0
		}

		return y
	}

	onClick(color) {
		if (this.state.activeRect == null) return
		console.log('derp')
		const rect = Object.assign({},this.state.activeRect)
		const clone = (this.state.rects).slice(0)
	  	const index = clone.indexOf(this.state.activeRect)
	  	rect.backgroundColor = color
	  	clone[index] = rect
	  	this.setState({
	  		rects: clone,
	  		activeRect: rect
	  	})
	}

	onMouseDown(rect, e) {
		this.setState({
			resizing: true,
			dragging: true,
			rel: {
				x: e.pageX,
				y: e.pageY,
			},
			initWidth: rect.width,
			initHeight: rect.height,
			initTop: rect.top,
			initLeft: rect.left,
			activeRect: rect
		})
		
		e.stopPropagation()
		e.preventDefault();
  	}

  	onMouseLeave() {
  		this.setState({
  			resizing: false,
  			dragging: false
  		})
  	}

  	onMouseMove(e) {
  		if(!this.state.dragging) return
  			
  			const rect = Object.assign({},this.state.activeRect)
	  		const clone = (this.state.rects).slice(0)
	  		const index = clone.indexOf(this.state.activeRect)
	  		const nX = (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
	  		const nY = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		rect.left = this.checkXBounds(nX, this.state.activeRect) + 'px'
	  		rect.top = this.checkYBounds(nY, this.state.activeRect) + 'px'
	  		clone[index] = rect
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveNE(e) {
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect)
	  		const nWidth = (parseInt(this.state.initWidth,10) + e.pageX - this.state.rel.x);											
	  		const nHeight = (parseInt(this.state.initHeight,10) - e.pageY + this.state.rel.y);
	  		const nTop = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0)
	  		const index = clone.indexOf(this.state.activeRect)
	  		rect.width = (nWidth + parseInt(this.state.activeRect.left,10) > 1200) ? 
	  													(1200 - parseInt(this.state.activeRect.left,10) + 'px') 
	  													: (nWidth + 'px')
	 
	  		rect.top = (nTop < 0) ? (0 + 'px') : (nTop + 'px')
	  		rect.height = (nTop < 0)? this.state.activeRect.height : (nHeight + 'px')
	  		clone[index] = rect
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveSE(e) {
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect)
  			const nWidth = (parseInt(this.state.initWidth,10) + e.pageX - this.state.rel.x);
	  		const nHeight = (parseInt(this.state.initHeight,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0)
	  		const index = clone.indexOf(this.state.activeRect)
	  		rect.width = (nWidth + parseInt(this.state.activeRect.left,10) > 1200) ? 
	  													(1200 - parseInt(this.state.activeRect.left,10) + 'px') 
	  													: (nWidth + 'px')
	  		rect.height = (nHeight + parseInt(this.state.activeRect.top,10) > 640) ?
	  													(640 - parseInt(this.state.activeRect.top,10) + 'px') 
	  													: (nHeight + 'px')								  	
	  		clone[index] = rect
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveSW(e) {
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect)
  			const nWidth = parseInt(this.state.initWidth,10) - e.pageX + this.state.rel.x;
  			const nLeft = (parseInt(rect.left,10) < 0) ? 0 
  									: (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
  			const nHeight = (parseInt(this.state.initHeight,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0)
	  		const index = clone.indexOf(this.state.activeRect)
	  		rect.height = (nHeight + parseInt(this.state.activeRect.top,10) > 640) ?
	  													(640 - parseInt(this.state.activeRect.top,10) + 'px') 
	  													: (nHeight + 'px')
	  		rect.left = (nLeft < 0) ? (0 + 'px') : (nLeft + 'px')
	  		rect.width = (nLeft < 0) ? this.state.activeRect.width : (nWidth + 'px')
	  		clone[index] = rect
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveNW(e) {
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect)
  			const nWidth = (parseInt(this.state.initWidth,10) - e.pageX + this.state.rel.x);
  			const nLeft = (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
  			const nHeight = (parseInt(this.state.initHeight,10) - e.pageY + this.state.rel.y);
	  		const nTop = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0)
	  		const index = clone.indexOf(this.state.activeRect)
	  		rect.top = (nTop < 0) ? (0 + 'px') : (nTop + 'px')
	  		rect.height = (nTop < 0)? this.state.activeRect.height : (nHeight + 'px')
	  		rect.left = (nLeft < 0) ? (0 + 'px') : (nLeft + 'px')
	  		rect.width = (nLeft < 0) ? this.state.activeRect.width : (nWidth + 'px')
	  		clone[index] = rect
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseUp(e) {
  		this.setState({
  			resizing: false,
  			dragging: false
  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onKeyDown(e) {
  		if(e.keyCode === 13 && this.state.activeRect !== null) {
	  		const rect = Object.assign({},this.state.activeRect)
			const clone = (this.state.rects).slice(0)
		  	const index = clone.indexOf(this.state.activeRect)
		  	rect.backgroundColor = '#' + e.target.value
		  	clone[index] = rect
		  	this.setState({
		  		rects: clone,
		  		activeRect: rect
		  	})
  		}
  	}


	render() {
		return (
			<div>
				<div className="controls" >
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
							selectRect={this.selectRect}
							deselectRect={this.deselectRect}
							onMouseDown={this.onMouseDown.bind(this, rect)}
							onMouseUp={this.onMouseUp}
							onMouseMoveNE={this.onMouseMoveNE}
							onMouseMoveSE={this.onMouseMoveSE}
							onMouseMoveSW={this.onMouseMoveSW}
							onMouseMoveNW={this.onMouseMoveNW}
							onMouseMove={this.onMouseMove}
							onMouseLeave={this.onMouseLeave.bind(this)}
							/>
						)
					})}
				</div>
				<ColorPicker colors={this.state.colors} 
				activeRect={this.state.activeRect} 
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}/>
			</div>
		)
	}
}