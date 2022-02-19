class Netease {
  constructor() {
  }
  async get_playlist(id) {
    return await fetch(`https://api.007666.xyz/music/netease/playlist?id=${id}`).then(res => res.json()).then(res => {
      if (res.code === 200) {
        const ids = res.playlist.trackIds.map(item => item.id)
        return ids
      } else {
        return 500
      }
    })
  }
  async get_music_detail(ids) {
    return await fetch(`https://api.007666.xyz/music/netease/song/detail?ids=${ids}`).then(res => res.json()).then(res => {
      if (res.code === 200) {
        return res.songs.map(item => {
          return {
            name: item.name,
            id: item.id,
            artists: item.ar[0].name,
            album: item.al.name,
            pic: item.al.picUrl,
            mv: item.mv
          }
        })
      } else {
        return 500
      }
    }
    )
  }
  async get_music_url(ids) {
    return await fetch(`https://api.007666.xyz/music/netease/song/url?ids=[${ids}]&br=3200000`).then(res => res.json()).then(res => {
      if (res.code === 200) {
        return res.data.map(item => {
          return {
            id: item.id,
            url: item.url
          }
        })
      } else {
        return 500
      }
    })
  }
  async get_music_lrc(id) {
    return await fetch(`https://api.007666.xyz/music/netease/lyric?id=${id}`).then(res => res.json()).then(res => {
      if (res.code === 200) {
        return res
      } else {
        return 500
      }
    })
  }
  async get_music_mv(id) {
    return await fetch(`https://api.007666.xyz/music/netease/mv?id=${id}`).then(res => res.json()).then(res => {
      if (res.code === 200) {
        // 返回最后一个
        return res.data.brs[Object.keys(res.data.brs)[Object.keys(res.data.brs).length - 1]]
      } else {
        return 500
      }
    })
  }
  async get_format_playlist(id, limit = 3, offset = 0) {
    const ids = await this.get_playlist(id)
    const maxOffset = Math.ceil(ids.length / limit)
    if (offset > maxOffset) {
      offset = maxOffset
    }
    // 分页
    const start = limit * offset
    const end = limit * (offset + 1)
    const ids_page = ids.slice(start, end)
    const music_detail = await this.get_music_detail(ids)
    const music_url = await this.get_music_url(ids)
    // 根据id拼接数组
    let playList = []
    for (const id of ids_page) {
      const lrc = (await this.get_music_lrc(id)).lrc.lyric
      const tlrc = (await this.get_music_lrc(id)).tlyric.lyric
      const music = music_detail.find(item => item.id === id)
      const url = (music_url.find(item => item.id === id))
      const mv = await this.get_music_mv(music_detail.find(item => item.id === id).mv)
      playList.push({
        songid: id,
        title: music.name,
        author: music.artists,
        album: music.album,
        pic: music.pic,
        url: url.url,
        lrc: lrc,
        tlrc: tlrc,
        link: `https://music.163.com/#/song?id=${id}`,
        mv: mv,
        type: "netease"
      })
    }
    return playList
  }
}