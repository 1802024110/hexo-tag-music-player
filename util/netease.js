const qs = require('qs');
const axios = require('axios');
// 获得播放链接
async function getNeteaseMusicUrl(id) {
  const url = await axios.post(`http://music.163.com/api/song/enhance/player/url?id=${id}&ids=%5B${id}%5D&br=3200000`).then(res => {
    if (res.data.data[0].code == -100 || res.data.data[0].url == null) {
      return 'https://cdn.jsdelivr.net/gh/1802024110/GitHub_Oss@main/music/hexo插件vip歌曲提示.mp3'
    } else {
      return res.data.data[0].url
    }
  }).catch(err => {
    console.log('[tag-music-play]歌曲播放链接获取失败')
  })
  return url
}
// 获得歌词
/**
 * @param {string} id 歌曲id
 * @param {string} lrc_type 歌词类型
 */
async function getNeteaseMusicLrc(id, type) {
  const lrc = await axios.get(`http://music.163.com/api/song/lyric?os=pc&id=${id}&lv=-1&kv=-1&tv=-1`).then(res => {
    switch (type) {
      case 'lrc': return res.data.lrc.lyric; break;
      case 'tlrc': return res.data.tlyric.lyric; break;
      default: return res.data.lrc.lyric; break;
    }
  }).catch(err => {
    return ''
  })
  return lrc
}
// 获得mv链接
async function getNeteaseMvUrl(id) {
  const url = await axios.get(`http://music.163.com/api/mv/detail?id=${id}`).then(res => {
    if (res.data.code == 200) {
      // const mv_url = res.data.data.brs[']
      // 获得最后一个
      const mv_url = res.data.data.brs[Object.keys(res.data.data.brs)[Object.keys(res.data.data.brs).length - 1]]
      return mv_url
    } else {
      return ''
    }
  })
  return url
}
// 获得歌单歌曲信息
async function getNeteaseMusicList(id, limit = 10, offset = 1) {
  // 获得歌单的所有歌曲id
  const list_id = await axios.post('https://music.163.com/api/v6/playlist/detail', qs.stringify({
    id: id,
    n: '1'
  })).then(res => {
    if (res.data.code === 200) {
      console.log('[tag-music-play]获取网易云歌单成功')
      // 将res.data转换为数组
      const data = Array.from(res.data.playlist.trackIds)
      // 将data中的id存入data_id
      const data_id = data.map(item => item.id)
      return data_id
    } else {
      console.log('[tag-music-play]获取网易云歌单失败,检查id是否正确，或者换个id试试')
      return []
    }
  })
  let ids = []
  // 若offset超出最大偏移量则重置为最大偏移量
  let allOffset = list_id.length / limit - 1
  if (offset > allOffset) {
    offset = allOffset
  }
  // 偏移量处理后的歌曲id
  list_id.forEach((item, index) => {
    if (index >= limit * offset && index < limit * (offset + 1)) {
      ids.push(item)
    }
  })
  idsData = '[' + ids.map((id) => '{id:' + id + '}').join(',') + ']'
  const songs = await axios.post(`https://music.163.com/api/v3/song/detail?c=${idsData}`).then(res => {
    if (res.data.code === 200) {
      console.log('[tag-music-play]获取歌曲信息成功');
      return res.data.songs
    } else {
      console.log('[tag-music-play]获取歌曲信息失败')
      return []
    }
  })
  let play_list = []
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i]
    play_list.push({
      songid: song.id,
      title: song.name,
      author: song.ar.map(item => item.name).join('/'),
      album: song.al.name,
      pic: song.al.picUrl,
      duration: song.dt / 1000,
      url: await getNeteaseMusicUrl(song.id),
      lrc: await getNeteaseMusicLrc(song.id, 'lrc'),
      tlrc: await getNeteaseMusicLrc(song.id, 'tlrc'),
      mv: await getNeteaseMvUrl(song.mv),
      link: `https://music.163.com/#/song?id=${song.id}`,
      type: 'netease'
    })
  }
  return play_list
}
module.exports = {
  getNeteaseMusicUrl,
  getNeteaseMusicLrc,
  getNeteaseMvUrl,
  getNeteaseMusicList
}