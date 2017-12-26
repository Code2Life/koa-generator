const colors = require( "colors");
const util = require('./lib/utils');
const KoaBuilder = require('./lib/KoaBuilder');

const validDatabase = ["none", "mongodb", "mysql"];
const validTemplate = ["none", "ejs", "pug", "jade"];

async function valid(options) {
  let res = true;
  if(typeof options.port !== 'number' || options.port <= 0 || options.port > 65535) {
    util.err('Port is not vailid, please input a number in (0, 65536) ');
    res = false;
  }

  if(validDatabase.indexOf(options.database.trim()) == -1) {
    util.err('Database type is not vailid, please input "mongodb", "mysql" or "none"');
    res = false;
  }

  if(validTemplate.indexOf(options.template.trim()) == -1) {
    util.err('Template Engine type is not vailid, please input "ejs", "pug", "jade" or "none"');
    res = false;
  }

  let plugins = options.addons instanceof Array ? options.addons : 
    typeof options.addons == 'string' ? options.addons.trim().split(',') : 
    (util.err('addons input is not legal') && (res = false));
  if(plugins.length > 0) {
    for(let plugin of plugins) {
      if(plugin.trim() == '') continue;
      let pmodule = require(plugin.trim());
      if(!pmodule || typeof pmodule.build != 'function') {
        util.err(`The custom addon/plugin: ${plugin} is not legal!`);
        res = false;
      }
    }
  }

  if(options['unit-test'].trim() == 'true') {
    options.uniTest = true;
  } else {
    options.uniTest = false;
  }

  let target = process.cwd();
  let targetSub = require('fs').readdirSync(target);
  if(targetSub.length > 0) {
    util.err(`Current directory is NOT EMPTY, please run generator in a empty directory. `);
    res = false;
  }
  return res;
};

async function build(options) {
  util.log(`start generate code with config: Database: ${options.database} Port: ${options.port} TemplateEngine ${options.template} Plugins: ${options.addons || 'none'}`);
  if(await valid(options)) {
    try {
      let builder = new KoaBuilder(options);
      await builder.run();
    } catch(ex) {
      util.err(ex);
      process.exit(1);
    }
  } else {
    //参数校验不通过
    util.log('error happened, stop generate');
    process.exit(1);
  }
  let resStr =  (options.template == '' ||  options.template == 'none') ? 
  `Check status at: http://localhost:${options.port}/test`: `Check status at: http://localhost:${options.port}`;
  resStr = 'Generate FINISHED. \r\n\tPlease modify config.js if needed. \r\n\tThen RUN "npm install && npm start"\r\n\t' + resStr;
  util.log(resStr.yellow);
}

exports.build = build;
exports.util = util;
