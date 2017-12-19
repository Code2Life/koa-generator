const fs = require('fs');
const util = require('./utils');

/**
 * @description 代码生成插件: 主目录生成器
 * 
 * @param {String} path 需要写入的根目录 process.cwd()
 * @param {KoaBuilder} root 核心构建器, 能够取得配置信息
 * @param {Object} package package.json数据, 会在所有生成器完成后, 写入目录中
 */
async function build(path, root, package) {
  mkdir();
  await copyFixedFiles();
}

function mkdir(path) {
  util.combineAndMakeDir('bin');
  util.combineAndMakeDir('business');
  util.combineAndMakeDir('common');
  util.combineAndMakeDir('data');
  util.combineAndMakeDir('dto');
  util.combineAndMakeDir('public');
  util.combineAndMakeDir('routes');
  util.combineAndMakeDir('model');
}

async function copyFixedFiles(path) {
  const commonFiles = [
    'bin/www',
    'common/constant.js',
    'common/logger.js',
    'common/responseLogger.js',
    'common/sessionFilter.js',
    'common/util.js',
    'dto/resultJson.js',
    'routes/index.js',
    'routes/uploadRoute.js',
    'routes/userRoute.js',
    'app.js', 
    'config.js',
    '.editorconfig'
  ];
  for(let file of commonFiles) {
    await util.getUrl2File(file, util.combilePath(file));
  }
}

exports.build = build;