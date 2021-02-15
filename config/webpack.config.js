'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.js',
    options: PATHS.src + '/options.js',
    background: PATHS.src + '/background.js',
    jsonEditor: PATHS.src + '/jsoneditor.js',
  },
});

module.exports = config;
