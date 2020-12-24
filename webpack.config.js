const webpack = require('webpack');
const {ModuleFederationPlugin} = webpack.container;

const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const deps = require('./package.json').dependencies;

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

/** @type {import('webpack').Configuration} */
module.exports = {
	entry: './src/index.js',
	output: {
		publicPath: 'auto',
		path: path.join(__dirname, 'build'),
		chunkFilename: '[id].[contenthash].js'
	},
	mode,
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		port: Number.parseInt(process.env.PORT, 10) || 3000,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
		}
	},
	resolve: {
		extensions: ['.js', '.mjs', '.jsx', '.css'],
		alias: {
			events: 'events'
		}
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				type: 'javascript/auto',
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['@babel/preset-react']
				}
			}
		]
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'my_app',
			filename: 'remoteEntry.js',
			remotes: {
				'my-app': 'my_app@http://localhost:3000/remoteEntry.js'
			},
			exposes: {
			},
			shared: [
				{
					...deps,
					react: {
						singleton: true,
						requiredVersion: deps.react
					},
					'react-dom': {
						singleton: true,
						requiredVersion: deps['react-dom']
					}
				}
			]
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		})
	]
};
