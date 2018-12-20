# Koa-generator-pro

A flexible code generator for koa2. Koa-generator-pro can generate a MVC node.js project with koa@2.x+, mongodb or mysql data access, ejs or pug template engine, mocha + should.js unit test examples and so on.

# Install 
```
npm install koa-generator-pro -g
```

## Basic Usages
```
/* open command line or shell in a empty directory */

/* lookup usage and default options */
koa2 --help 

/* create a project at port 3000, pug + koa2 + sequelize + mysql + mocha ... */
koa2 -p 3000 -d mysql -t pug -u true

/* create a resutful api project with mongodb */
koa2 -d mongodb
```

## Options
1. -p --port : default 3000, any number between 0~65535
2. -d --database: default none, support mysql and mongodb currently
3. -t --template: default none, support ejs and jade/pug
4. -u --unit-test: default true, set false if you don't want to write unit test
5. -a --addons: default "", define your custom plugins by set this option

## Notice

Generated project can only run by node which version is above 7.6.0

## Plugin example
```
# add-custom-util-plugin.js

const fs = require('fs');
const path = require('path');
/**
 * @param {pathStr} generator work directory, equals to process.cwd()
 * @param {root} instance of KoaBuilder, 
 *               options can be found in root, like root.port
 * @param {package} the object would be wrote to package.json
 */
async function build(pathStr, root, package) {
  //await some asynchronizaed business
  let codeToWrite = '... function(){} ... module.export = ...';
  let writePath = path.resolve(pathStr, 'common/my-util.js');
  fs.writeFileSync(writePath, codeToWrite);
}

/* save this file in ../plugin & use like following */
// koa2 -p 3001 -a ../plugin/add-custom-util-plugin.js
```

## License
MIT License

## Contact
email joey.yang@zoom.us


