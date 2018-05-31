var song = new Song();

function doJSON(data) {
    song.cb(data);
}

song.extend({
    searchUrl: 'http://songsearch.kugou.com/song_search_v2?callback=doJSON&keyword=',
    // playWrapper: document.getElementsByClassName('play-wrapper')[0],
    // songWrapper: document.getElementsByClassName('song_wrapper')[0],
    input: document.getElementsByTagName('input')[0],
    target: document.getElementsByClassName('song_list')[0],
    imgDoc: document.getElementsByClassName('img-wrapper')[0],

    // callback of jsonp 
    cb: function (data) {
        // // 搜索的所有歌曲信息 songList
        this.songList = data.data.lists;
        console.log(this.songList);
        if (this.songList.length) {
            this.createDom(this.target, this.songList);
        }
    },

    // create song list
    createDom: function (obj, songList) {
        var str = `<li class="song_head song_item">
                    <div class="select_song"></div>
                    <div>歌曲名</div>
                    <div>专辑</div>
                    <div>时长</div>
                </li>`;

        songList.forEach(function (ele, index) {
            // all of song time
            var time = (ele.Duration / 60).toFixed(2).toString().split('.');
            var minute = time[0];
            var sec = time[1];
            var itemStr = `<li class="song_item">
                                <div class="select_song"></div>
                                <div class="singer_name">${ele.SongName}</div>
                                <div class="song_album">${ele.AlbumName}</div>
                                <div class="song_time">${minute > 9 ? minute : ('0' + minute)}:${sec}</div>
                        </li>`;
            str += itemStr;
        });

        obj.innerHTML = str;
    },

    // 防抖
    debounce: function (handle, delay) {
        var timer = null;

        return function (e) {
            var args = arguments;
            clearTimeout(timer);

            timer = setTimeout(() => {
                handle.apply(this, args);
            }, delay)
        }
    },

    // jsonp 加载歌曲资源
    loadSongList: function () {
        // this---> this.input
        if (this.value) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = song.searchUrl + this.value;
            // script.src = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=49493059975831973&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${this.value}&g_tk=1175838790&jsonpCallback=cb&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
            document.body.appendChild(script);
            document.body.removeChild(script);
        }
    },

    bindEvent: (function () {
        var flag = true;
        return function () {
            var self = this;
            if (flag) {
                this.input.oninput = this.debounce(this.loadSongList, 300);

                var singer = document.getElementsByClassName('song_list')[0];

                singer.onclick = function (e) {
                    var singerName = Array.from(document.getElementsByClassName('singer_name'));
                    var target = e.target;

                    if (target.className === 'singer_name') {
                        var index = singerName.indexOf(target);
                        // console.log(index);
                        // self.loadSong(self.songList[index].FileHash);
                        var hash = self.songList[index].FileHash;
                        window.location = './html/playsong.html?hash=' + hash;

                    }
                }
                flag = false;
            } else {
                throw new Error('You can\'t perform this function');
            }
        }
    })(),

    syncLyrics: function () {
        var lyrics = this.lyrics;
    }
})

song.bindEvent();