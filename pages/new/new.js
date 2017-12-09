// new.js
const util = require("../../utils/util.js");

var types = ["1", "10", "29", "31", "41"];
var dataType = 0;
var page = 1;
var isLoading = false;

// 当前播放音频id
var audioId = 0;
//记录上次播放的音频id
var audioLastId = 0;
// 当前播放视频id
var videoId = 0;
//记录上次播放的视频id
var videoLastId = 0;

var allmaxtime = 0;
var imagemaxtime = 0;
var wordmaxtime = 0;
var voicemaxtime = 0;
var videomaxtime = 0;

var DATATYPE = {
  ALLDATATYPE: "1",
  IMAGEDATATYPE: "10",
  WORDDATATYPE: "29",
  VOICEDATATYPE: "31",
  VIDEODATATYPE: "41"
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBarItem: ["全部", "图片", "段子", "声音", "视频"],
    allDataList: [],
    imageDataList: [],
    wordDataList: [],
    voiceDataList: [],
    videoDataList: [],
    currentTab: 0,
    swiperHeight: 0,
    refresh: 0,
    loadmore: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //刷新数据
    this.refreshNewData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ swiperHeight: res.windowHeight - 37, swiperWidth: res.screenWidth - 1 });
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshNewData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  switchTab: function (e) {
    dataType = e.target.dataset.idx;
    this.setData({ currentTab: e.target.dataset.idx });
    //判断是否需要加载新数据
    if (this.needLoadNewData()) {
      this.refreshNewData();
    }

    if (audioId >= 0 || this.videoContext) {
      this.stopMedia();
    }

  },
  switchBt: function (e) {
    dataType = e.detail.current;
    this.setData({ currentTab: e.detail.current });
    //判断是否需要加载新数据
    if (this.needLoadNewData()) {
      this.refreshNewData();
    }

    if (audioId >= 0 || this.videoContext) {
      this.stopMedia();
    }
  },
  refreshNewData: function () {
    var that = this;
    //显示正在加载
    util.showLoading();
    wx.showNavigationBarLoading();
    this.setData({ refresh: 50 });

    var param = "a=newlist&c=data&type=" + types[dataType];
    util.request(param, function (res) {
      console.log(res);
      page = 1;
      //设置新数据
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.hideNavigationBarLoading();
        that.setData({ refresh: 0 });
        wx.stopPullDownRefresh();
      }, 1000);
    });

  },
  setNewDataWithRes: function (res, target) {
    switch (types[dataType]) {
      case DATATYPE.ALLDATATYPE:
        allmaxtime = res.data.info.maxtime;
        target.setData({ allDataList: res.data.list });
        break;
      case DATATYPE.IMAGEDATATYPE:
        imagemaxtime = res.data.info.maxtime;
        target.setData({ imageDataList: res.data.list });
        break;
      case DATATYPE.WORDDATATYPE:
        wordmaxtime = res.data.info.maxtime;
        target.setData({ wordDataList: res.data.list });
        break;
      case DATATYPE.VOICEDATATYPE:
        voicemaxtime = res.data.info.maxtime;
        target.setData({ voiceDataList: res.data.list });
        break;
      case DATATYPE.VIDEODATATYPE:
        videomaxtime = res.data.info.maxtime;
        target.setData({ videoDataList: res.data.list });
        break;
    }
  },
  loadMoreData: function () {
    var that = this;
    //显示正在加载
    util.showLoading();
    wx.showNavigationBarLoading();
    that.setData({ loadmore: 50 });

    var param = "a=newlist&c=data&type=" + types[dataType] + "&page=" + page + "&maxtime=" + this.getMaxTime();
    util.request(param, function (res) {
      page += 1;
      //设置新数据
      that.setDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.hideNavigationBarLoading();
        that.setData({ loadmore: 0 });

        wx.stopPullDownRefresh();
        isLoading = false;
      }, 1000);
    });
  },
  getMaxTime: function () {
    switch (types[dataType]) {
      case DATATYPE.ALLDATATYPE:
        return allmaxtime;
      case DATATYPE.IMAGEDATATYPE:
        return imagemaxtime;
      case DATATYPE.WORDDATATYPE:
        return wordmaxtime;
      case DATATYPE.VOICEDATATYPE:
        return voicemaxtime;
      case DATATYPE.VIDEODATATYPE:
        return videomaxtime;
    }
  },
  setDataWithRes: function (res, target) {
    console.log(target.data.allDataList);
    if (!isLoading) {
      isLoading = true;
      switch (types[dataType]) {
        case DATATYPE.ALLDATATYPE:
          allmaxtime = res.data.info.maxtime;
          target.setData({ allDataList: target.data.allDataList.concat(res.data.list) });
          break;
        case DATATYPE.IMAGEDATATYPE:
          imagemaxtime = res.data.info.maxtime;
          target.setData({ imageDataList: target.data.imageDataList.concat(res.data.list) });
          break;
        case DATATYPE.WORDDATATYPE:
          wordmaxtime = res.data.info.maxtime;
          target.setData({ wordDataList: target.data.wordDataList.concat(res.data.list) });
          break;
        case DATATYPE.VOICEDATATYPE:
          voicemaxtime = res.data.info.maxtime;
          target.setData({ voiceDataList: target.data.voiceDataList.concat(res.data.list) });
          break;
        case DATATYPE.VIDEODATATYPE:
          videomaxtime = res.data.info.maxtime;
          target.setData({ videoDataList: target.data.videoDataList.concat(res.data.list) });
          break;
      }
    }
  },
  needLoadNewData: function () {
    switch (types[dataType]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        return this.data.allDataList.length > 0 ? false : true;

      //视频
      case DATATYPE.VIDEODATATYPE:
        return this.data.videoDataList.length > 0 ? false : true;

      //图片
      case DATATYPE.IMAGEDATATYPE:
        return this.data.imageDataList.length > 0 ? false : true;

      //段子
      case DATATYPE.WORDDATATYPE:
        return this.data.wordDataList.length > 0 ? false : true;

      //声音
      case DATATYPE.VOICEDATATYPE:
        return this.data.voiceDataList.length > 0 ? false : true;

      default:
        break;
    }

    return false;
  },
  // 播放音频
  audioplay: function (e) {
    audioId = e.target.id;

    if (audioLastId > 0 && audioId != audioLastId) {
      var audioCtx = wx.createAudioContext(audioLastId);
      audioCtx.pause();
    }
    audioLastId = audioId;
  },
  audioendplay: function (e) {
    audioId = e.target.id;
    var audioCtx = wx.createAudioContext(audioId);
    audioCtx.seek(0);
  },
  // 播放视频
  videoplay: function (e) {
    videoId = e.target.id;
    console.log("播放ing" + "id" + videoId);

    if (this.videoContext) {
      console.log("播放");
      console.log(this);
      this.videoContext.pause();
    }

    this.videoContext = wx.createVideoContext(e.target.id, this);
  },
  videopause: function (e) {
    // console.log(this);
    // console.log(e);
  },
  stopMedia: function () {
    if (audioId > 0) {
      var audioCtx = wx.createAudioContext(audioId);
      audioCtx.pause();
    }
    console.log("停止");
    console.log(this);
    if (this.videoContext) {
      this.videoContext.pause();
    }
  },
  clickCell: function (e) {
    console.log(e);
    var cell = e.currentTarget.dataset.cell;
    var t = { id: cell.id, profile_image: cell.profile_image, name: cell.name, screen_name: cell.screen_name, text: cell.text, passtime: cell.passtime, bimageuri: cell.bimageuri, videouri: cell.videouri, voiceuri: cell.voiceuri, videouri: cell.videouri, cai: cell.cai, ding: cell.ding, repost: cell.repost, comment: cell.comment, image1: cell.image1, top_cmt: cell.top_cmt, themes: cell.themes };
    var cellStr = JSON.stringify(t);

    wx.navigateTo({
      url: '../index/detail?id=' + cell.id + '&cell=' + cellStr
    })

  },
  clickImage: function (e) {
    console.log(e);
  },
  clickVoice: function () {
    console.log('clickVoice');
  },
  clickVideo: function () {
    console.log('clickVideo');
  }
})