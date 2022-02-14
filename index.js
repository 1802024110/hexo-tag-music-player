/* global hexo */
'use strict';
const path = require('path');
// 为list模式的处理函数
const listMode = require('./util/list-mode');
hexo.extend.tag.register('musicPlay', function (args) {
  const source_dir = hexo.source_dir;
  switch (args[0]) {
    case 'list': return listMode(args, source_dir); break;
    case 'singe': console.log('singe'); break;
    default: return '模式(mode)参数错误';
  }
}, { async: true });  