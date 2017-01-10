const webpack = require('webpack');
const path = require('path');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const ExternalsPlugin = webpack.ExternalsPlugin;

const DEBUG = !process.argv.includes('--release');

const Scripts = [
  { key: 'app', file: './app.jsx' },
];

const entryForScripts = {};

Scripts.forEach(script => Object.assign(entryForScripts, { [script.key]: [script.file] }));

const config = {
  cache: DEBUG,
  context: `${__dirname}/app/components`,
  entry: entryForScripts,
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
  },
  target: 'electron',
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: [
      `${__dirname}/node_modules`,
      path.resolve('./app'),
    ],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
    ],
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExternalsPlugin('commonjs', [
      'app',
      'auto-updater',
      'browser-window',
      'content-tracing',
      'dialog',
      'global-shortcut',
      'ipc',
      'menu',
      'menu-item',
      'power-monitor',
      'protocol',
      'tray',
      'remote',
      'web-frame',
      'clipboard',
      'crash-reporter',
      'screen',
      'shell',
    ]),
    new NodeTargetPlugin(),
  ],
  eslint: {
    configFile: './.eslintrc.json',
    fix: DEBUG,
  },
  watch: DEBUG,
};

module.exports = config;
