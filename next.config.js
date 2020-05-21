const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const withTypescript = require('@zeit/next-typescript');
const tsImportPluginFactory = require('ts-import-plugin');
const withLessExcludeAntd = require('./next-less.config.js');
const fs = require('fs');
const path = require('path');
const dotenv_1 = require('dotenv');
const { theme } = require('./package.json');

const dotenvFile = path.resolve('.env');
let envConfig;
if (fs.existsSync(dotenvFile)) {
  envConfig = {
    ...dotenv_1.parse(fs.readFileSync(dotenvFile)),
    SP_ENV: process.env.SP_ENV 
  };
}

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {};
}

let assetPrefix ={};
// SP_ENV

if(process.env.NODE_ENV === 'development'){
  assetPrefix = {
    dev: '//localhost:4000',
    test: '//localhost:4000',
    uat: '//localhost:4000',
    master: '//localhost:4000'
  };
} else {
  assetPrefix = {
    dev: '//localhost:4000',
    test: '//test-service-platform-rce.sunmi.com',
    uat: '//uat-service-platform-rce.sunmi.com',
    master: '//service-platform-rce.sunmi.com'
  };
}


const config = withTypescript(
  withCss(
    withLessExcludeAntd({
      cssModules: true,
      distDir: 'build',
      env: envConfig,
      assetPrefix: assetPrefix[process.env.SP_ENV || 'master'],
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]'
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: theme
      },
      // crossOrigin: "http://localhost:3001",
      crossOrigin: 'anonymous'
    })
  )
);

// README: next-typescript 始终格式化成 ['ts','tsx']
config.pageExtensions = ['tsx'];

module.exports = config;
