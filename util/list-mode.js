const fs = require('hexo-fs')
const path = require('path');
const ejs = require('ejs');
const netease = require('./netease')
// 返回网易云歌单里面的所有歌曲信息

module.exports = async function (list, source_dir) {
  // 获得歌单id
  const id = list[1]
  // 获得歌单歌曲信息
  const netease_play_list = await netease.getNeteaseMusicList(id, 2, 165465)
  // 检查_data/play_list.json文件是否存在
  let div_list = []
  if (fs.existsSync(path.join(source_dir, '_data/play_list.json'))) {
    console.log('[tag-music-play]检测到_data/play_list.json文件，将使用该文件')
    // 读取_data/play_list.json文件
    div_list = JSON.parse(fs.readFileSync(path.join(source_dir, '_data/play_list.json')))
  } else {
    console.log('[tag-music-play]未检测到_data/play_list.json文件，将创建该文件')
    // 检查_data目录是否存在,不存在则创建
    if (!fs.existsSync(path.join(source_dir, '_data'))) {
      fs.mkdirSync(path.join(source_dir, '_data'));
    }
    // 检查play_list.json是否存在,不存在则创建
    if (!fs.existsSync(path.join(source_dir, '_data/play_list.json'))) {
      fs.writeFileSync(path.join(source_dir, '_data/play_list.json'), '[{}]');
    }
  }
  // 读取_data/play_list.json文件
  const content = await ejs.renderFile(path.join(__dirname, '../template/bangumi.ejs'), {
  }, { async: true })
  return content;
}