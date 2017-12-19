const http = require('http');
const fs = require('fs');
const path = require('path');

const CDN_BASE = "http://p15bkgqdj.bkt.clouddn.com/koa";

function log(msg, withoutColor) {
  if(msg === null || msg === undefined) return;
  if(typeof msg === 'string') {
    console.log('Koa-generator pro: '.green + (withoutColor ? msg : msg.magenta));
  } else {
    console.log('Koa-generator pro: '.green + msg.toString().magenta);
  }
}

function err(err) {
  if(err === null || err === undefined) return;
  if(err instanceof Error) {
    console.log('Koa-generator pro: '.green + 'error happens.'.red);
    console.log(err.message.red);
    console.log(err.stack);
  } else if(typeof err === 'string') {
    console.log('Koa-generator pro: '.green + err.red);
  } else {
    console.log('Koa-generator pro: '.green + err.toString().red);
  }
}

function getUrl(url) {
  if(typeof url !== 'string' || url.length <= 0) return '';
  if(url.search(/^http[s]?:/) == -1) {
    url = CDN_BASE + (url[0] == '/' ? '' : '/') + url;
  }
  return new Promise((resolve, reject) => {
    http.get(url, function(res) {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
    
      if (statusCode !== 200) {
        reject(new Error(`获取到非200状态码: ${statusCode}`));
        res.resume();
        return;
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        resolve(rawData.toString());
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

module.exports = {
  getUrl,

  log,

  err,

  async getUrl2File(url, path) {
    let data = await(getUrl(url));
    fs.writeFileSync(path, data);
    log('generate file:' + path);
  },

  combilePath() {
    return path.resolve(process.cwd(), ...arguments);
  },

  combineAndMakeDir() {
    let resPath = path.resolve(process.cwd(), ...arguments);
    if(!fs.existsSync(resPath)) {
      fs.mkdirSync(resPath);
      log('generate dir:' + resPath);
    }
    return resPath;
  },

  write2Path(data, pathStr) {
    let resPath = path.resolve(process.cwd(), pathStr);
    fs.writeFileSync(resPath, data);
    log('generate file:' + resPath);
  },

  replaceStrInFile(pathStr, replaceSrc, replaceTarget) {
    let targetPath = path.resolve(process.cwd(), pathStr);
    let fileContent = fs.readFileSync(targetPath).toString();
    fileContent = fileContent.replace(replaceSrc, replaceTarget);
    fs.writeFileSync(targetPath, fileContent);
  },

  insertStrToFile(pathStr, str2Insert, condition) {
    let predicate = false, lineNumber = Number.MAX_SAFE_INTEGER;
    if(typeof condition === 'function') {
      predicate = true;
    } else if(typeof condition === 'number') {
      lineNumber = condition;
    } else {
      return false;
    }
    let split = '\n';
    let targetPath = path.resolve(process.cwd(), pathStr);
    let fileContent = fs.readFileSync(targetPath).toString();
    let prev = fileContent.split(split);
    let after = [];
    //传入函数, 执行函数至return true, 则为正确的lineNumber
    if(predicate) {
      for(let i = 0;i< prev.length;i++) {
        if(condition.call(prev, prev[i])) {
          lineNumber = i + 1;
          break;
        }
      }
    }
    after = prev.splice(lineNumber);
    str2Insert instanceof Array ? prev.concat(str2Insert) : prev.push(str2Insert);
    let result = prev.concat(after);
    fs.writeFileSync(targetPath, result.join(split));
  }
}