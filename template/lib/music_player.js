class MusicPlayer {
  constructor(playList, playIndex = 0, cover, songName, lrcs, range, nowPlay, totalPlay, play, prev, next, translation, mv, sort, list, listOverlay, close, music_list, music_count, video, list2) {
    //#region 
    /* 
    playInfo:歌曲信息格式如下
        {
      author: 作者  例: '张三'
      link: 原音乐网站 例: 'https://music.163.com/#/song?id=123456789'
      lrc: 歌词 例: "[00:00.000] 作词 : ilem ..."
      mv: mv地址 例: 'https://xxx.com/xxx.mp4'
      pic: 封面 例: 'https://xxx.com/xxx.jpg'
      songid: 音乐id 例: '123456789'
      title: "音乐标题" 例: '群青'
      tlrc: 音乐歌词翻译 例: "[00:00.000] 作词 : ilem ..."
      type: "音乐平台，只有网易或者哔哩哔哩" 例: 'netease/bilibili'
      url: "mp3地址" 例: 'https://xxx.com/xxx.mp3'
    }
    playIndex: 歌曲索引
    cover: 封面img的document对象
    songName: 歌曲名的document对象
    lrcs: 歌词的document对象
    range: 拖动块的document对象
    nowPlay: 当前播放时间的document对象
    totalPlay: 总时间的document对象
    play: 播放按钮的document对象
    prev: 上一首按钮的document对象
    next: 下一首按钮的document对象
    translation: 翻译按钮的document对象
    mv: 翻译旁边的mv按钮的document对象
    sort: 排序按钮的document对象  
    list: 歌曲列表按钮的document对象
    listOverlay: 歌曲列表的document对象
    close: 歌曲列表的关闭按钮的document对象
    music_list: 歌曲列表的document对象
    music_count: 歌曲列表的数量
    video: 视频的document对象
    */
    //#endregion
    this.playList = playList;
    this.playIndex = playIndex;
    this.audio = document.getElementById('audio1');
    this.cover = cover;
    this.songName = songName;
    this.lrcs = lrcs;
    this.range = range;
    this.nowPlay = nowPlay;
    this.totalPlay = totalPlay;
    this.play = play;
    this.prev = prev;
    this.next = next;
    this.translation = translation;
    this.mv = mv;
    this.sort = sort;
    this.list = list;
    this.listOverlay = listOverlay;
    this.close = close;
    this.music_list = music_list;
    this.music_count = music_count;
    this.video = video;
    this.init(playList[0]);
  }

  init(playInfo) {

    // 初始化歌曲播放链接
    this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + playInfo.songid + '.mp3';
    // 初始化封面
    this.cover.src = playInfo.pic;
    // 初始化歌曲名
    this.songName.innerHTML = playInfo.title;
    // 初始化歌词
    this.initLrc(playInfo.lrc);
    // 当音乐缓存完毕时,初始化操作
    this.audio.addEventListener('canplay', () => {
      // 初始化播放时间
      const fen = Math.floor(this.audio.duration / 60);
      const miao = Math.floor(this.audio.duration % 60);
      this.totalPlay.innerHTML = `${fen}:${miao > 9 ? miao : '0' + miao}`;
    });

    // 当音乐开始播放时
    this.audio.addEventListener('play', () => {
      // 封面开始旋转
      this.cover.style.animation = 'rotate360 20s linear infinite'
      // 更新图标
      this.play.className = 'iconfont icon-zanting button';
    });

    // 开始监听进度条
    this.range.addEventListener('input', () => {
      // 更改滑块前的背景占比
      this.range.style.backgroundSize = this.range.value + '% 100%';
      // 同步播放时间
      this.audio.currentTime = this.audio.duration * (this.range.value / 100);
      this.playAction()
      // 同步已播放时间
      this.nowPlay.innerHTML = Math.floor(this.audio.currentTime / 60) + ':' + Math.floor(this.audio.currentTime % 60);
    });

    // 调用音乐控制器
    this.control()
  }

  // 初始化歌词
  initLrc(lrc) {
    // 删除容器中的所有元素
    while (this.lrcs.firstChild) {
      this.lrcs.removeChild(this.lrcs.firstChild);
    }
    // 切割时间和内容
    let lrcArr = lrc.split('[');
    // 初始化存放歌词和时间的数组
    let lrcObj = [];
    // 循环切割的数组
    lrcArr.forEach((item, index) => {
      if (index !== 0) {
        // 切割分秒和毫秒
        let time = item.split(']')[0].split('.')
        // 切割分和秒
        let timeSec = time[0].split(':')
        // 组合精确到毫秒的时间
        timeSec = parseInt(timeSec[0]) * 60 + parseInt(timeSec[1]) + time[1] / 1000
        // 切割歌词
        let content = item.split(']')[1];
        content = content.replace(/\n/g, '');
        // 判断歌词是否为空
        if (content == '') {
          content = 'Music'
        }
        // 将时间和歌词存入数组
        lrcObj.push({
          timeSec,
          content
        })
      }
    })
    lrcObj.forEach((item, index) => {
      // 创建歌词元素
      const elp = document.createElement('p');
      // 设置歌词元素的内容
      elp.innerHTML = item.content;
      // 将elp的id设置为歌词时间来匹配歌词
      elp.setAttribute('id', item.timeSec);
      // 将歌词挂载到容器
      this.lrcs.appendChild(elp);
    })

    // 匹配歌词
    this.audio.ontimeupdate = () => {
      // 获取当前播放时间
      let currentTime = this.audio.currentTime;
      // 循环歌词
      for (let i = 0; i < lrcObj.length; i++) {
        try {
          // 判断歌词是否在当前播放时间内
          if (currentTime >= lrcObj[i].timeSec && currentTime < lrcObj[i + 1].timeSec) {
            // 设置当前歌词样式
            this.lrcs.children[i].style.color = 'red';
            this.lrcs.children[i].style.fontSize = '1rem';
            // 这里控制歌词滚动居中的位置
            this.lrcs.scrollTop = this.lrcs.children[i].offsetTop - this.lrcs.children[i].offsetHeight * 2;
            // 除去其他歌词颜色
            for (let j = 0; j < this.lrcs.children.length; j++) {
              if (j != i) {
                this.lrcs.children[j].style.color = 'rgb(216, 221, 225)';
                this.lrcs.children[j].style.fontSize = '0.5rem';
              }
            }
          }
        } catch (e) {
          // 播放完毕
        }
      }

      // 同步播放时间和滑轨
      const fen = Math.floor(this.audio.currentTime / 60);
      const miao = Math.floor(this.audio.currentTime % 60);
      this.nowPlay.innerHTML = `${fen}:${miao > 9 ? miao : '0' + miao}`;
      this.range.value = this.audio.currentTime / this.audio.duration * 100;
      this.range.style.backgroundSize = this.range.value + '% 100%';
    }
  }

  // 控制区域
  control() {
    // 播放完自动播放下一首
    this.audio.onended = () => {
      this.next.click();
    }

    // 播放按钮
    this.play.onclick = () => {
      // 判断是否播放
      if (this.audio.paused) {

        // 播放
        this.audio.play();
        // 改变按钮样式
        this.play.className = 'iconfont icon-zanting button';
      } else {
        console.log('暂停123')
        // 暂停
        this.play.className = 'iconfont icon-bofang button';
        this.audio.pause();
        // 改变按钮样式
      }
    }
    // 上一首
    this.prev.onclick = () => {
      if (this.playIndex > 0) {
        this.pause()
        this.totalPlay.innerHTML = 'Loding...';
        this.playIndex--;
        this.initLrc(this.playList[this.playIndex].lrc);
        this.cover.src = this.playList[this.playIndex].pic
        this.audio.src = this.playList[this.playIndex].url;
        // 当audio缓存完毕后执行
        this.audio.oncanplay = () => {
          this.audio.play();
          this.songName.innerHTML = this.playList[this.playIndex].title
          this.range.style.backgroundSize = '0% 100%';
        }
        this.nowPlay.innerHTML = this.playList[this.playIndex].name;
      }
    }
    // 下一首
    this.next.onclick = () => {
      if (this.playIndex != this.playList.length - 1) {
        this.pause()
        this.totalPlay.innerHTML = 'Loding...';
        this.playIndex++;
        this.initLrc(this.playList[this.playIndex].lrc);
        this.cover.src = this.playList[this.playIndex].pic
        this.audio.src = this.playList[this.playIndex].url;
        // 当audio缓存完毕后执行
        this.audio.oncanplay = () => {
          this.audio.play();
          this.songName.innerHTML = this.playList[this.playIndex].title
          this.range.style.backgroundSize = '0% 100%';
        }
        this.nowPlay.innerHTML = this.playList[this.playIndex].url;
      }
    }

    // 翻译和mv
    let count = 0;
    this.translation.onclick = () => {
      if (count === 0) {
        this.initLrc(this.playList[this.playIndex].tlrc);
        count = 1;
      }
      else {
        this.initLrc(this.playList[this.playIndex].lrc);
        count = 0;
      }
    }
    this.audio.addEventListener('canplay', () => {
      if (this.playList[this.playIndex].tlrc) {
        this.translation.style.display = 'block';
      } else {
        this.translation.style.display = 'none';
      }
      if (this.playList[this.playIndex].mv) {
        this.mv.style.opacity = 1;
        this.mv.disabled = true
      } else {
        this.mv.style.opacity = 0;
        this.mv.disabled = false
      }
    })
    // mv
    this.mv.onclick = () => {
      alert('在播放列表查看 mv')
      this.video.style.display = 'block';
      this.video.src = this.playList[this.playIndex].mv;
      this.video.play();
      this.play.className = 'iconfont icon-bofang button';
      this.audio.pause();
    }

    // 播放顺序
    this.sort.onclick = () => {
      // 如果className包含icon-shunxu
      if (this.sort.className.indexOf('icon-shunxu') != -1) {
        // 随机播放代码
        this.audio.loop = false
        this.playList.sort(() => {
          return Math.random() - 0.5;
        })
        this.sort.className = 'iconfont icon-suijibofang button';
      } else if (this.sort.className.indexOf('icon-suijibofang') != -1) {
        // 循环代码
        this.audio.loop = true;
        this.sort.className = 'iconfont icon-xunhuanjianting button';
      } else if (this.sort.className.indexOf('icon-xunhuanjianting') != -1) {
        // 顺序代码
        this.audio.loop = false
        fetch(this.playInfo).then(res => res.json()).then(data => {
          this.playList = data;
        });
        this.sort.className = 'iconfont icon-shunxu button';
      }
    }

    // 显示播放列表
    this.list.onclick = () => {
      this.listOverlay.style.display = 'block';
      setTimeout(() => {
        this.listOverlay.style.bottom = '0px'
      }, .1)
      this.music_count.innerHTML = `共${this.playList.length}首`;
      this.music_list.innerHTML = ''
      for (let i = 0; i < this.playList.length; i++) {
        const elDiv = document.createElement('div');
        const elDivImg = document.createElement('img');
        elDivImg.src = this.playList[i].pic;
        const elDivDiv = document.createElement('div');
        elDivDiv.onclick = () => {
          // 确定播放的是哪一首
          this.playIndex = i;
          // 切换为当前选择的歌曲
          this.audio.src = this.playList[i].url;
          this.cover.src = this.playList[i].pic;
          this.initLrc(this.playList[i].lrc);
          console.log("播放列表点击");
          this.songName.innerHTML = this.playList[i].title
          this.audio.play();
        }
        const elDivDivP1 = document.createElement('span');
        elDivDivP1.innerHTML = this.playList[i].title;
        const elDivDivP2 = document.createElement('span');
        elDivDivP2.innerHTML = this.playList[i].author;
        const elDivButton1 = document.createElement('button');
        elDivButton1.className = this.playList[i].mv ? 'iconfont icon-mv button' : 'button';
        if (!this.playList[i].mv) elDivButton1.disabled = true
        elDivButton1.onclick = () => {
          if (this.playList[i].mv) {
            this.video.style.display = 'block';
            this.video.src = this.playList[i].mv;
            this.audio.pause();
            this.video.play();
          }
        }
        const elDivButton2 = document.createElement('button');
        elDivButton2.onclick = () => {
          top.location.href = this.playList[i].link;
        }
        switch (this.playList[i].type) {
          case 'netease':
            elDivButton2.className = 'iconfont icon-wangyiyunyinle button';
            break;
          case 'bilibili':
            elDivButton2.className = 'iconfont icon-bili button';
            break;
          default:
            elDivButton2.className = ' button';
            elDivButton2.disabled = true;
        }
        this.music_list.appendChild(elDiv);
        elDiv.appendChild(elDivImg);
        elDiv.appendChild(elDivDiv);
        elDivDiv.appendChild(elDivDivP1);
        elDivDiv.appendChild(elDivDivP2);
        elDiv.appendChild(elDivButton1)
        elDiv.appendChild(elDivButton2)
      }
    }

    // 关闭播放列表
    this.close.onclick = () => {
      this.video.pause();
      this.listOverlay.style.bottom = '-100%';
      setTimeout(() => {
        this.listOverlay.style.display = 'none';
      }, 500)
    }
  }
  playAction() {
    this.audio.play();
  }
  pause() {
    this.audio.pause();
  }
}
const ms = new MusicPlayer(
  div_list,
  0,
  document.getElementById('cover'),
  document.getElementById('songName'),
  document.getElementById('lrc'),
  document.getElementById('range'),
  document.getElementById('nowPlay'),
  document.getElementById('totalPlay'),
  document.getElementById('play'),
  document.getElementById('prev'),
  document.getElementById('next'),
  document.getElementById('translation'),
  document.getElementById('mv'),
  document.getElementById('sort'),
  document.getElementById('list'),
  document.getElementById('listOverlay'),
  document.getElementById('close'),
  document.getElementById('music_list'),
  document.getElementById('music_count'),
  document.getElementById('video')
); 