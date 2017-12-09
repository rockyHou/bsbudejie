// trends.js

const util = require('../../utils/util.js');

var levelId = 35;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level1:[],
    level2:[],
    current:0,
    swiperHeight: 0,
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCate();
    this.loadLevel2(levelId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ swiperHeight: res.windowHeight});
      },
    })
  },
  loadCate:function(){
    var that = this;

    var param = "a=category&c=subscribe";

    util.request(param, function (res) {
      that.setData({ level1:res.data.list});
    });

  },

  clickLevel1:function(e){
    this.setData({ current: e.target.dataset.idx});
    levelId = e.target.dataset.id;

    this.loadLevel2(levelId);

  },

  loadLevel2:function(){
    var that = this;

    var param = "a=list&c=subscribe&category_id=" + levelId;

    util.request(param, function (res) {
      that.setData({ level2: res.data.list });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})