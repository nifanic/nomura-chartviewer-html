/**
 * Created by nnifadef on 7/11/16.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATH_TO = require('./paths');

module.exports = {
	mode: 'development',
	context: PATH_TO.src,
	entry: './entry.js',
	output: {
		path: PATH_TO.public,
		publicPath: '/',
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'windows.jQuery': 'jquery'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			filename: 'assets/styles/[name].css',
			chunkFilename: 'assets/styles/[id].css'
		}),
		new HtmlWebpackPlugin({
			template: path.join(PATH_TO.src, 'App', 'index.tmpl.html'),
			filename: path.join(PATH_TO.public, 'index.html')
		})
	],
	module: {
		rules: [
			{
				test: /\.(sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						}
					},
					{
						loader: 'sass-loader',
						options: {
							includePaths: [ path.resolve(PATH_TO.appDir, 'node_modules') ],
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(ttf|eot|otf|woff|woff2|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: {
					loader: 'file-loader',
					options: {
						name(file) {
							return 'assets/fonts/[name].[ext]';
						}
					}
				}
			},
			{
				test: /\.(gif|png|mov|mp4)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				]
			}
		]
	},
	devtool: 'inline-source-map',
	watch: true,
	devServer: {
		contentBase: PATH_TO.public,
		publicPath: '/',
		hot: true,
		inline: true,
		port: 3005,
		historyApiFallback: true,
		quiet: false,
		watchOptions: {
			ignored: [ 'node_modules' ],
			poll: true
		},
		proxy: {
			'/api': 'http://localhost:8085'
		},
		progress: false
	},
	resolve: {
		alias: {
			'jquery': 'jquery/src/jquery'
		},
	}
};