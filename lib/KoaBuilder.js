const MainBuilder = require('./MainBuilder');
const DatabaseBuilder = require('./DatabaseBuilder');
const ViewTemplateBuilder = require('./ViewTemplateBuilder');
const PackageConfigBuilder = require('./PackageConfigBuilder');
const UnitTestBuilder = require('./UnitTestBuilder');

let package = {
  "name": "koa-start-kit",
  "version": "1.0.0",
  "author": {
    "name": "Joey Yang",
    "email": "wbyang3@iflytek.com"
  },
  "private": true,
  "scripts": {
    "start": "node bin/www",
    "prd": "pm2 start bin/www",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "lodash": "^4.17.4",
    "koa": "^2.2.0",
    "koa-bodyparser": "^3.2.0",
    "koa-json": "^2.0.2",
    "koa-multer": "^1.0.2",
    "koa-onerror": "^1.2.1",
    "koa-router": "^7.1.1",
    "koa-session2": "^2.2.5",
    "koa-static": "^3.0.0",
    "koa2-cors": "^2.0.3",
    "log4js": "^2.3.8",
    "request": "^2.83.0"
  },
  "devDependencies": {}
}


/**
 * @description Koa框架构建器
 * 
 * @param {Number} option.port 端口号
 * @param {String} option.database 数据库类型
 * @param {String} option.template 模板引擎类型
 * @param {Array} options.addons 插件列表
 * @param {Boolean} options.uniTest 是否添加单元测试用例
 * 
 */
function KoaBuilder(options) {
  this.builders = [];
  this.port = options.port;
  this.database = options.database;
  this.template = options.template;
  this.uniTest = options.uniTest;
  if(typeof options.addons == 'string') {
    this.plugins = options.addons.trim().split(',');
  } else {
    this.plugins = options.addons;
  }
  this.initBuilders();
}
KoaBuilder.prototype.initBuilders = function() {
  this.builders.push(MainBuilder);
  this.builders.push(DatabaseBuilder);
  this.builders.push(ViewTemplateBuilder);
  this.builders.push(UnitTestBuilder);
  
  this.builders.push(PackageConfigBuilder);

  for(let plugin of this.plugins) {
    if(plugin.trim() == '') continue;
    this.builders.push(require(plugin.trim()));
  }
}

/**
 * 所有的插件需要实现一个build函数, 接收参数为: 
 * 1. 写入目标文件夹路径, 2. 当前构建器的引用, 3. 当前package.json字符串
 */
KoaBuilder.prototype.run = async function() {
  let target = process.cwd();
  for(let builder of this.builders) {
    await builder.build(target, this, package);
  }
}

module.exports = KoaBuilder;