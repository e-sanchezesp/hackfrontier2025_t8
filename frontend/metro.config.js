const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const nodeModulesPath = path.join(__dirname, 'node_modules');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [nodeModulesPath];

module.exports = config;