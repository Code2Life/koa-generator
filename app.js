const Koa = require('koa');
const session = require("koa-session2");
const cors = require('koa2-cors');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const koaStatic = require('koa-static');

const route = require('./routes');
const responseLogger = require('./common/responseLogger');
const sessionFilter = require('./common/sessionFilter');

const app = new Koa();
const render = require('koa-ejs');

// 错误处理
onerror(app);

// 应用集成中间件
app.use(session({ key: "SESSIONID" }));
app.use(cors({ credentials: true }));
app.use(bodyparser({ enableTypes:['json', 'form', 'text'] }));
app.use(json());
app.use(koaStatic(__dirname + '/public'));

// 自定义日志中间件(此中间件包括一个全局的try catch, 能够对请求处理过程的任何抛出错误进行记录)
app.use(responseLogger); //logResponse logError 
// 自定义会话及授权中间件
app.use(sessionFilter); //ctx.session.user

// 路由组件
route(app);

module.exports = app;
