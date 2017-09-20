import React from 'react';
import Rectangle from './Rectangle.jsx';
import ColorPicker from './ColorPicker.jsx'
import ReactDOM from 'react-dom';
import Add from '../../images/add.svg';
import Remove from '../../images/remove.svg';
import Clear from '../../images/clear.svg';
import Color from '../../images/color.svg';
import Save from '../../images/save.svg';
import Load from '../../images/load.svg';

export default class App extends React.Component {
	constructor() {
		super();
		const initialState = {
			rects: [],
			activeRect: {},
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
					[6, 147, 227], [171, 184, 195], [235, 20, 76], [247, 141, 167], [153, 0, 239]],
			history: [],
			saveName: '',
			colorMenuVisible: false,
			loadMenuVisible: false,
			errorMsg: false,
			mfired: false
		};
		this.state = this.getFromStorage(initialState);
		this.colors = this.colors.bind(this);
		this.getRandomInt = this.getRandomInt.bind(this);
		this.remove = this.remove.bind(this);
		this.checkHex = this.checkHex.bind(this);
		this.checkXBounds = this.checkXBounds.bind(this);
		this.checkYBounds = this.checkYBounds.bind(this);
		this.addRectangle = this.addRectangle.bind(this);
		this.removeRectangle = this.removeRectangle.bind(this);
		this.deselectRect = this.deselectRect.bind(this);
		this.clearField = this.clearField.bind(this);
		this.onSelectColor = this.onSelectColor.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseMoveNE = this.onMouseMoveNE.bind(this);
		this.onMouseMoveSE = this.onMouseMoveSE.bind(this);
		this.onMouseMoveSW = this.onMouseMoveSW.bind(this);
		this.onMouseMoveNW = this.onMouseMoveNW.bind(this);
		this.onColorEnter = this.onColorEnter.bind(this);
		this.saveLayout = this.saveLayout.bind(this);
		this.loadLayout = this.loadLayout.bind(this);
		this.onSaveChange = this.onSaveChange.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this)
		this.onSaveEnter = this.onSaveEnter.bind(this);
		this.toggleColorMenu = this.toggleColorMenu.bind(this);
		this.deselectColorMenu = this.deselectColorMenu.bind(this);
		this.toggleLoadMenu = this.toggleLoadMenu.bind(this);
		this.deselectLoadMenu = this.deselectLoadMenu.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.checkIfSaveNameExists = this.checkIfSaveNameExists.bind(this);
	}

	componentDidMount() {
		this.setState({
			activeRect: {},
			loadMenuVisible: false,
			colorMenuVisible: false
		})
	}

	componentDidUpdate(prevProps, prevState) {
		// Writes  current state to local storage after an update
	  	this.writeToStorage(this.state)
	}

	getFromStorage(state) {
		// Returns state from local storage or returns intial state
		try {
			const persistantState = localStorage.getItem('state');
			if(persistantState === null) {
				return state;
			}
			return JSON.parse(persistantState);
		} catch(err) {
			return state;
		}
	}

	writeToStorage(state) {
		// Writes a state to local storage
		try {
			const persistantState = JSON.stringify(state);
			localStorage.setItem('state', persistantState)
		} catch(err) {

		}
	}

	colors() {
		// Helper function for chosing random color. Returns rgb value in string format
		const colorArray = [];    

		for(let i =0; i < 3 ; i++){
		  colorArray.push(this.getRandomInt(0,255));
		}

		return "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")";
	}

	getRandomInt(min, max) {
		// Helper function for gettin a random integer between two values. Returns an int
  		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	remove(array, element) {
		// Helper function for removing a specific element from an array
		const index = array.indexOf(element);
    	
    	if (index !== -1) {
        	array.splice(index, 1);
    	}

    	return array;	
	}

	checkHex(color) {
		// Helper function for checking if hex is valid color: Return boolean
    	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
	}

	checkXBounds(x, rect) {
		// Helper function that checks to make sure rectangle is within bounds in the x-axis.
		// Returns an int
		if (x + parseInt(rect.width, 10) > 1200) {
			return 1200 - parseInt(rect.width,10);
		} else if (x < 0) {
			return 0;
		}

		return x;
	}

	checkYBounds(y, rect) {
		// Helper function that checks to make sure rectangle is within bounds in the y-axis.
		// Returns an int
		if (y + parseInt(rect.height, 10) > 640) {
			return 640 - parseInt(rect.height,10);
		} else if (y < 0) {
			return 0;
		}

		return y;
	}

	addRectangle(e) {
		// Adds rectangle to dragspace with a random state
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
		});
		e.stopPropagation()
		e.preventDefault()
	}

	removeRectangle(e) {
		// Removes selected rectangle from the dragspace
		if(Object.getOwnPropertyNames(this.state.activeRect).length == 0) return

		const newState = this.remove(this.state.rects.slice(0), this.state.activeRect);

		this.setState({
			rects: newState,
			activeRect: {}
		});
		e.stopPropagation()
		e.preventDefault()
	}

	deselectRect(e) {
		if (!this.state.mfired) {
			this.setState({
				activeRect: {}
			});
		
		} else {
			this.setState({
				mfired: false
			});
		}
	}


	clearField(e) {
		// Clears all rectangles from the dragspace
		this.setState({
			rects: [],
			activeRect: {}
		});
		e.stopPropagation()
		e.preventDefault()
	}	

	onSelectColor(color, e) {
		// Changes color of selected rectangle
		if (Object.getOwnPropertyNames(this.state.activeRect).length == 0) return
		const rect = Object.assign({},this.state.activeRect);
		const clone = (this.state.rects).slice(0);
	  	const index = clone.indexOf(this.state.activeRect);
	  	rect.backgroundColor = color;
	  	clone[index] = rect;
	  	
	  	this.setState({
	  		rects: clone,
	  		activeRect: rect
	  	});

	  	e.stopPropagation()
		e.preventDefault();
	}

	onMouseDown(rect, e) {
		// Sets initial mouse positioning and parameters before mouse transforming
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
			activeRect: rect,
			mfired: true,
		});
		
		e.stopPropagation()
		e.preventDefault();
  	}

  	onMouseLeave() {
  		// Sets certain values to false so resizing can't happen after mouse leaves the area
  		this.setState({
  			resizing: false,
  			dragging: false,
  			mfired: false,
  		});
  	}

  	onMouseMove(e) {
  		// Handles dragging logic on mouse movement
  		if(!this.state.dragging) return
  			
  			const rect = Object.assign({},this.state.activeRect);
	  		const clone = (this.state.rects).slice(0);
	  		const index = clone.indexOf(this.state.activeRect);
	  		const nX = (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
	  		const nY = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		rect.left = this.checkXBounds(nX, this.state.activeRect) + 'px';
	  		rect.top = this.checkYBounds(nY, this.state.activeRect) + 'px';
	  		clone[index] = rect;
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		});
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveNE(e) {
  		// Handler for top right corner of rectangle. Handles reisizing logic
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect);
	  		const nWidth = (parseInt(this.state.initWidth,10) + e.pageX - this.state.rel.x);											
	  		const nHeight = (parseInt(this.state.initHeight,10) - e.pageY + this.state.rel.y);
	  		const nTop = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0);
	  		const index = clone.indexOf(this.state.activeRect);
	  		rect.width = (nWidth + parseInt(this.state.activeRect.left,10) > 1200) ? 
	  											(1200 - parseInt(this.state.activeRect.left,10) + 'px') 
	  											: (nWidth + 'px');
	 
	  		rect.top = (nTop < 0) ? (0 + 'px') : (nTop + 'px');
	  		rect.height = (nTop < 0)? this.state.activeRect.height : (nHeight + 'px');
	  		clone[index] = rect;
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		});
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveSE(e) {
  		// Handler for bottom right corner of rectangle. Handles reisizing logic
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect);
  			const nWidth = (parseInt(this.state.initWidth,10) + e.pageX - this.state.rel.x);
	  		const nHeight = (parseInt(this.state.initHeight,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0);
	  		const index = clone.indexOf(this.state.activeRect);
	  		rect.width = (nWidth + parseInt(this.state.activeRect.left,10) > 1200) ? 
	  												(1200 - parseInt(this.state.activeRect.left,10) + 'px') 
	  												: (nWidth + 'px');
	  		rect.height = (nHeight + parseInt(this.state.activeRect.top,10) > 640) ?
	  												(640 - parseInt(this.state.activeRect.top,10) + 'px') 
	  												: (nHeight + 'px');								  	
	  		clone[index] = rect;
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		});
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveSW(e) {
  		// Handler for bottom left corner of rectangle. Handles reisizing logic
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect);
  			const nWidth = parseInt(this.state.initWidth,10) - e.pageX + this.state.rel.x;
  			const nLeft = (parseInt(rect.left,10) < 0) ? 0 
  									: (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
  			const nHeight = (parseInt(this.state.initHeight,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0);
	  		const index = clone.indexOf(this.state.activeRect);
	  		rect.height = (nHeight + parseInt(this.state.activeRect.top,10) > 640) ?
	  												(640 - parseInt(this.state.activeRect.top,10) + 'px') 
	  												: (nHeight + 'px');
	  		rect.left = (nLeft < 0) ? (0 + 'px') : (nLeft + 'px');
	  		rect.width = (nLeft < 0) ? this.state.activeRect.width : (nWidth + 'px');
	  		clone[index] = rect;
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		})
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseMoveNW(e) {
  		// Handler for top right corner of rectangle. Handles reisizing logic
  		if (!this.state.resizing) return
  			
  			const rect = Object.assign({},this.state.activeRect);
  			const nWidth = (parseInt(this.state.initWidth,10) - e.pageX + this.state.rel.x);
  			const nLeft = (parseInt(this.state.initLeft,10) + e.pageX - this.state.rel.x);
  			const nHeight = (parseInt(this.state.initHeight,10) - e.pageY + this.state.rel.y);
	  		const nTop = (parseInt(this.state.initTop,10) + e.pageY - this.state.rel.y);
	  		const clone = (this.state.rects).slice(0);
	  		const index = clone.indexOf(this.state.activeRect);
	  		rect.top = (nTop < 0) ? (0 + 'px') : (nTop + 'px');
	  		rect.height = (nTop < 0)? this.state.activeRect.height : (nHeight + 'px');
	  		rect.left = (nLeft < 0) ? (0 + 'px') : (nLeft + 'px');
	  		rect.width = (nLeft < 0) ? this.state.activeRect.width : (nWidth + 'px');
	  		clone[index] = rect;
	  		
	  		this.setState({
	  			rects: clone,
	  			activeRect: rect
	  		});
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onMouseUp(e) {
  		// Sets certain state values to false after mouse up event
  		this.setState({
  			resizing: false,
  			dragging: false,
  		});
  		
  		e.stopPropagation()
    	e.preventDefault()
  	}

  	onColorEnter(e) {
  		// Allows enter to key to set background of rectangle
  		if(e.keyCode === 13 && this.state.activeRect !== null && this.checkHex('#' + e.target.value)) {
	  		
	  		const rect = Object.assign({},this.state.activeRect);
			const clone = (this.state.rects).slice(0);
		  	const index = clone.indexOf(this.state.activeRect);
		  	rect.backgroundColor = '#' + e.target.value;
		  	clone[index] = rect;
		  	
		  	this.setState({
		  		rects: clone,
		  		activeRect: rect
		  	});

  		}
  	}

  	saveLayout(e) {
  		// Saves current layout to state
  		if(this.state.saveName == '') return
  		
  		const nHist = {[this.state.saveName] : this.state.rects};
  		const clone = this.state.history.slice(0);
  		clone.push(nHist);
  		if(!this.checkIfSaveNameExists(this.state.saveName)) {
	  		this.setState({
	  			history: clone,
	  			saveName: '',
	  			errorMsg: false
	  		});
	  	} else {
	  		this.setState({
	  			saveName:'',
	  			errorMsg: true
	  		});
	  	}
  		
  		e.stopPropagation()
		e.preventDefault()
  	}

  	loadLayout(layout, e) {
  		// Loads a layout from state
  		this.setState({
  			rects: Object.values(layout)[0],
  			activeRect: {}
  		});
  		
  		e.stopPropagation()
		e.preventDefault()
  	}

  	removeLayout(layout, e) {
  		// Removes a saved layout from state
  		const nHist = this.remove(this.state.history.slice(0), layout);

  		if (nHist.length == 0) {
			this.setState({
				loadMenuVisible: false
			});
		}
		

		this.setState({
			history: nHist
		});
		
		e.stopPropagation()
		e.preventDefault()
  	}

  	onSaveChange(e) {
  		// Handler for value change in
  		this.setState({
  			saveName: e.target.value
  		});
  		
  		e.stopPropagation()
		e.preventDefault()
  	}

  	onSaveClick(e) {
  		// Prevents deselect rect from firing
  		e.stopPropagation()
		e.preventDefault()
  	}

  	onSaveEnter(e) {
  		// Allows enter key to set name of saved layout
  		if(e.keyCode === 13) this.saveLayout(e)
  	}

  	toggleColorMenu(e) {
  		// Toggles visiblity of color picker
  		const menuVisible = !this.state.colorMenuVisible;

  		this.setState({
  			colorMenuVisible: menuVisible
  		});

  		e.stopPropagation()
		e.preventDefault()
  	}

  	deselectColorMenu(e) {
  		if (Object.getOwnPropertyNames(this.state.activeRect).length <= 0) {
	  		this.setState({
	  			colorMenuVisible: false
	  		});
	  	}
  		e.stopPropagation()
		e.preventDefault()
  	}

  	toggleLoadMenu(e) {
  		// Toggles visiblity of saved layouts
  		if (!this.state.history.length > 0) return
 
  		const menuVisible = !this.state.loadMenuVisible;

  		this.setState({
  			loadMenuVisible: menuVisible
  		});

  		e.stopPropagation()
		e.preventDefault()
  	}

  	deselectLoadMenu(e) {
  		if (Object.getOwnPropertyNames(this.state.activeRect).length <= 0) {
	  		this.setState({
	  			loadMenuVisible: false
	  		});
	  	}
  		e.stopPropagation()
  		e.preventDefault()
  	}

  	handleOutsideClick(e) {
  		// Handles clicksoutside selected components
  		this.deselectRect(e)
  		this.deselectColorMenu(e)
  		this.deselectLoadMenu(e)
  	}

  	checkIfSaveNameExists(savename) {
  		// Checks to see if a savename exists within an object of the history array. Returns a boolean
  		for (let i=0; i < this.state.history.length; i++) {
  			if (savename in (this.state.history[i])) {
  				return true
  			}
  		}
  		return false
  	}

	render() {
		const loadMenuStyle = (this.state.loadMenuVisible) ? {} : {visibility: 'hidden'}
		const errorMsgStyle = (this.state.errorMsg) ? {visibility: 'visible'} : {}
		const inputStyle = (this.state.errorMsg) ? {borderColor: 'red'} : {}
		return (
			<div onClick={this.handleOutsideClick} className="App">
				<div className="dragspace">
					{this.state.rects.map((rect, key) => {
						return (
							<Rectangle key={key}
							activeRect = {this.state.activeRect}
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
							onMouseLeave={this.onMouseLeave}
							/>
						)
					})}
				</div>
				<div className="new-controls">
					<div className="control-container" >
						<Add className="actions add" onClick={this.addRectangle}/>
						<div className="tooltip">Add Rectangle</div>
					</div>
					<div className="control-container">
						<Remove className="actions remove" onClick={this.removeRectangle}/>
						<div className="tooltip">Remove Rectangle</div>
					</div>
					<div className="control-container alternate" >
						<Clear className="actions clear nonsvg"onClick={this.clearField}/>
						<div className="tooltip">Clear</div>
					</div>
					<div className="control-container alternate">
						<ColorPicker colors={this.state.colors} 
							activeRect={this.state.activeRect} 
							onClick={this.onSelectColor}
							onKeyDown={this.onColorEnter}
							colorMenuVisible={this.state.colorMenuVisible}/>
						<div>
							<Color className="actions color nonsvg" onClick={this.toggleColorMenu}/>
							<div className="tooltip">Change Color</div>
						</div>
					</div>
					<div className="control-container alternate">
						<div style={{display: 'inline-block', position: 'relative'}}>
							<input className="save-input"
							placeholder="Enter Layout Name..."
							onClick={this.onSaveClick}
							onChange={this.onSaveChange} 
							value={this.state.saveName} 
							onKeyDown={this.onSaveEnter}
							style={inputStyle}/>
							<div className="error-message" style={errorMsgStyle}>
							Layout already exists with that name. Please choose another or remove that layout.
							</div>
						</div>
						<div onClick={this.saveLayout} style={{display: 'inline-block', position: 'relative'}}>
							<Save className="actions save nonsvg"/>
							<div className="tooltip">Save Layout</div>
						</div>
					</div>
					<div className="control-container alternate">
						<div className="load-menu" style={loadMenuStyle}>
								{this.state.history.map((layout, key) => {
									return (
										<div key={key} className="load-wrapper" 
										onClick={(e) => this.loadLayout(layout, e)}>
											<li className="layout">
												{Object.keys(layout)[0]}
											</li>
											<Clear className="remove-layout" 
											onClick={(e) => this.removeLayout(layout, e)}/>
										</div>
									)
								})}
							</div>
							<div className='pointer' style={loadMenuStyle}/>
						<div onClick={this.toggleLoadMenu}>
							<Load className="actions load nonsvg"/>
							<div className="tooltip">Load Layout</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}