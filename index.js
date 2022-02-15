/* global hexo */
'use strict';
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
/* 
  反代理
*/
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://music.163.com/api/',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/', // rewrite path 将链接中的 /api/ 替换为 '/'
  },
});
hexo.extend.filter.register('server_middleware', function (app) {
  // 表示以 api 开头的请求将被转发
  app.use('/api', apiProxy);
});

/* 
  hexo-tag
*/
const listMode = require('./util/list-mode');
hexo.extend.tag.register('musicPlay', function (args) {
  const source_dir = hexo.source_dir;
  switch (args[0]) {
    case 'list': return listMode(args, source_dir); break;
    case 'singe': console.log('singe'); break;
    default: return '模式(mode)参数错误';
  }
}, { async: true });  