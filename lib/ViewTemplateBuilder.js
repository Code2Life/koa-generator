const fs = require('fs');
const util = require('./utils');

/**
 * @description 代码生成插件: 模板引擎生成器 
 * 
 * @param {String} path 需要写入的根目录 process.cwd()
 * @param {KoaBuilder} root 核心构建器, 能够取得配置信息
 * @param {Object} package package.json数据, 会在所有生成器完成后, 写入目录中
 */
async function build(path, root, package) {
  switch (root.template) {
    case 'ejs':
      package.dependencies['koa-ejs'] = '^4.1.0';
      util.combineAndMakeDir('views');
      util.combineAndMakeDir('public/css');
      await addEjsTemplateFiles();
      await modifyCurrentFiles4Ejs();
      break;
    case 'pug':
    case 'jade':
      package.dependencies['koa-pug'] = '^3.0.0-2';
      util.combineAndMakeDir('views');
      util.combineAndMakeDir('public/css');
      await addPugTemplateFiles();
      await modifyCurrentFiles4Pug();
      break;
    default: //none
      break;
  }
}

async function addEjsTemplateFiles() {  
  const commonFiles = [
    'views/index.ejs',
    'views/header.ejs',
    'views/footer.ejs',
    'views/layout.ejs',
    'views/error.ejs',
    'routes/viewExampleRoute.js',
    'public/css/style.css'
  ];
  for(let file of commonFiles) {
    await util.getUrl2File(file, util.combilePath(file));
  }
}

async function modifyCurrentFiles4Ejs() {
  let renderStr = `render(app, {
  root: require('path').join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: false //设置为true可以看到ejs编译的详细日志
});`;

  util.insertStrToFile('app.js', `const render = require('koa-ejs');`, (val) => val.indexOf(`require('koa-static');`) != -1);
  util.insertStrToFile('app.js', renderStr, (val) => val.indexOf(`new Koa();`) != -1);
  util.log('modify app.js for EJS. Middlewares already been added.');
  util.insertStrToFile('routes/index.js', `const viewExampleRoute = require('./viewExampleRoute');`, 
    (val) => val.indexOf(`require('./uploadRoute');`) != -1);
  util.insertStrToFile('routes/index.js', `  app.use(viewExampleRoute.routes(), viewExampleRoute.allowedMethods());`, 
    (val) => val.indexOf(`uploadRoute.allowedMethods`) != -1);
  util.log('modify routes/index.js for EJS. Example routes already been added [/, /error].');
}

async function addPugTemplateFiles() {  
  const commonFiles = [
    'views/index.pug',
    'views/header.pug',
    'views/footer.pug',
    'views/layout.pug',
    'views/error.pug',
    'routes/viewExampleRoute.js',
    'public/css/style.css'
  ];
  for(let file of commonFiles) {
    await util.getUrl2File(file, util.combilePath(file));
  }
}

async function modifyCurrentFiles4Pug() {
  let renderStr = `const pug = new Pug({
  viewPath: './views',
  debug: false,
  app
});`;

  util.insertStrToFile('app.js', `const Pug = require('koa-pug');`, (val) => val.indexOf(`require('koa-static');`) != -1);
  util.insertStrToFile('app.js', renderStr, (val) => val.indexOf(`new Koa();`) != -1);
  util.log('modify app.js for Jade/Pug. Middlewares already been added.');
  util.insertStrToFile('routes/index.js', `const viewExampleRoute = require('./viewExampleRoute');`, 
    (val) => val.indexOf(`require('./uploadRoute');`) != -1);
  util.insertStrToFile('routes/index.js', `  app.use(viewExampleRoute.routes(), viewExampleRoute.allowedMethods());`, 
    (val) => val.indexOf(`uploadRoute.allowedMethods`) != -1);
  util.log('modify routes/index.js for Jade/Pug. Example routes already been added [/, /error].');
}

exports.build = build;