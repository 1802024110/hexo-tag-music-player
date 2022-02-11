/* global hexo */
'use strict';
var path = require('path');
var ejs = require('ejs');
hexo.extend.tag.register('myTag', function (args, content) {
  return ejs.renderFile(path.join(__dirname, 'template/bangumi.ejs'), {
  }, { async: true })
}, { async: true });