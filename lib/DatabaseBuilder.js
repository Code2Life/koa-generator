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
      await modifyConfigJs4Mysql();
      break;
    case 'mongodb':
      package.dependencies['mongodb'] = '^2.2.33';
      await addMongoFiles();
      await modifyConfigJs4Mongo();
      break;
    default: //none nor not support
      await addMockFiles();
      break;
  }
}

async function addMysqlFiles() {
  await util.getUrl2File('common/sequelize.js', util.combilePath('common/sequelize.js'));
  await util.getUrl2File('business/rawSql.js', util.combilePath('business/rawSql.js'));
  await util.getUrl2File('business/userService-mysql.js', util.combilePath('business/userService.js'));
  await util.getUrl2File('model/index-mysql.js', util.combilePath('model/index.js'));
  await util.getUrl2File('model/user-mysql.js', util.combilePath('model/user.js'));
}

async function modifyConfigJs4Mysql() {
  const dbconfig = `\nconst
  /* 数据库配置 */
  database = 'test',
  username = 'root',
  password = '',
  host = 'localhost';

const 
  MYSQL_PORT = 3306;\n`;
  const dbattr = `$1\n\n  /* 数据库配置 */
  db: {
    database,
    username,
    password,
    host,
    port: MYSQL_PORT,
    poolSize: 20
  },`;
  //添加到第5行之后
  await util.insertStrToFile('config.js', dbconfig, 5);
  await util.replaceStrInFile('config.js', /(app\s*:\s*\{\s*port\s*\},)/, dbattr);
}

async function addMongoFiles() {
  await util.getUrl2File('common/mongoDao.js', util.combilePath('common/mongoDao.js'));
  await util.getUrl2File('business/userService-mongo.js', util.combilePath('business/userService.js'));
}

async function modifyConfigJs4Mongo() {
  const dbconfig = `\nconst
  /* 数据库连接字符串配置 */
  MONGO_URL = 'mongodb://localhost:27017/test',
  MONGO_OPTION = {
    poolSize: 50,
    autoReconnect: true
  }\n`;

  const dbattr = `$1\n\n    /* 数据库配置 */
  MONGO_URL,
  MONGO_OPTION,`;
  //添加到第5行之后
  await util.insertStrToFile('config.js', dbconfig, 5);
  await util.replaceStrInFile('config.js', /(app\s*:\s*\{\s*port\s*\},)/, dbattr);
}

async function addMockFiles() {
  await util.getUrl2File('business/userService-mock.js', util.combilePath('business/userService.js'));
}

exports.build = build;