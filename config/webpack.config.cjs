'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.cjs');
const PATHS = require('./paths.cjs');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.js',
    options: PATHS.src + '/options.js',
    background: PATHS.src + '/background.js',
  },
});

module.exports = config;
