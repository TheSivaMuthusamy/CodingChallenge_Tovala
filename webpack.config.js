const path = require('path');

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.jsx*$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader', 
			  	query: {
					presets: ['env','react']
			  	}
			},
			{
				test: /\.(css)$/,
				loader: 'style-loader!css-loader'
			},
			{
	      		test: /\.(png|jpg|)$/,
	      		loader: 'url-loader?limit=200000'
	    	},
	    	{
	    		test: /\.svg$/,
	    		loaders: [
				    {
				    	loader: 'babel-loader',
				      	query: {
				        	presets: ['env', 'react']
				      	}
				    },
				    {
				      	loader: 'react-svg-loader',
				    }
				]
	    	}
	  	]
	},
	devServer : {
		contentBase: './dist'
	}
};