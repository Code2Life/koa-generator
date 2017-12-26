const fs = require('fs');
const util = require('./utils');

/**
 * @description 代码生成插件: 生成package.json 修改config.js配置
 * 
 * @param {String} path 需要写入的根目录 process.cwd()
 * @param {KoaBuilder} root 核心构建器, 能够取得配置信息
 * @param {Object} package package.json数据, 会在所有生成器完成后, 写入目录中
 */
async function build(path, root, package) {
  if(root.uniTest) package.scripts.test = "mocha";
  generatePackageJson(path, package);
  modifyConfigJs(path, root);
}

function generatePackageJson(path, package) {
  let dir = path.split(/[\/\\]/).filter(p => p != '');
  let appName = dir[dir.length -1];
  package.name = appName;
  util.write2Path(JSON.stringify(package, null, 2), 'package.json');
}

function modifyConfigJs(path, root) {
  //匹配第一个port=xx的替换为配置的端口
  util.replaceStrInFile('config.js', /(\s+port\s*=\s*)(\d+)/, '$1' + root.port);
}


exports.build = build;