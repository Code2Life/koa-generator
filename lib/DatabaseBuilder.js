const fs = require('fs');
const util = require('./utils');

/**
 * @description 代码生成插件: 数据访问层生成器
 * 
 * @param {String} path 需要写入的根目录 process.cwd()
 * @param {KoaBuilder} root 核心构建器, 能够取得配置信息
 * @param {Object} package package.json数据, 会在所有生成器完成后, 写入目录中
 */
async function build(path, root, package) {
  switch (root.database) {
    case 'mysql':
      package.dependencies['mysql2'] = '^1.4.2';
      package.dependencies['sequelize'] = '^4.17.0';
      await addMysqlFiles();
      break;
    case 'mongodb':
      package.dependencies['mongodb'] = '^2.2.33';
      await addMongoFiles();
      break;
    default: //none nor not support
      await addMockFiles();
      break;
  }
}

async function addMysqlFiles() {
  await util.getUrl2File('config-mysql.js', util.combilePath('config.js'));
  await util.getUrl2File('common/sequelize.js', util.combilePath('common/sequelize.js'));
  await util.getUrl2File('business/rawSql.js', util.combilePath('business/rawSql.js'));
  await util.getUrl2File('business/userService-mysql.js', util.combilePath('business/userService.js'));
  await util.getUrl2File('model/index-mysql.js', util.combilePath('model/index.js'));
  await util.getUrl2File('model/user-mysql.js', util.combilePath('model/user.js'));
}

async function addMongoFiles() {
  //util.getUrl2File() 
}

async function addMockFiles() {
  //util.getUrl2File() 
}

exports.build = build;