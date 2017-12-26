const fs = require('fs');
const util = require('./utils');

/**
 * @description 代码生成插件: 单元测试生成器 
 * 
 * @param {String} path 需要写入的根目录 process.cwd()
 * @param {KoaBuilder} root 核心构建器, 能够取得配置信息
 * @param {Object} package package.json数据, 会在所有生成器完成后, 写入目录中
 */
async function build(path, root, package) {
  if(root.uniTest) {
    package.devDependencies.mocha = '^4.0.1';
    package.devDependencies.should = '^13.1.3';
    util.combineAndMakeDir('test');

    if(root.database == 'mongodb') {
      util.combineAndMakeDir('test/resources');
      await util.getUrl2File('test/mongo.test.js', util.combilePath('test/mongo.test.js'));
      await util.getUrl2File('test/resources/gridfs.test.txt', util.combilePath('test/resources/gridfs.test.txt'));
    }
    await util.getUrl2File('test/service.test.js', util.combilePath('test/service.test.js'));
  }
}
exports.build = build;