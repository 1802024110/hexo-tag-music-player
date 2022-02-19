/* global hexo */
'use strict';
const path = require('path');
const fs = require('hexo-fs');
const source_dir = hexo.source_dir;
const base_dir = hexo.base_dir;

/* 
  hexo-tag
*/
const listMode = require('./util/list-mode');
const { log } = require('console');
hexo.extend.tag.register('musicPlay', function (args) {
  switch (args[0]) {
    case 'list': return listMode(args, source_dir); break;
    case 'singe': console.log('singe'); break;
    default: return '模式(mode)参数错误';
  }

}, { async: true });  