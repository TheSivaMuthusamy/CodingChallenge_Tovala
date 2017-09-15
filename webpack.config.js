const path = require('path');

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		loaders: [
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
	  	]
	},
	devServer : {
		contentBase: './dist'
	}
};