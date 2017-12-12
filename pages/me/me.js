// me.js

const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    squarelist:[],
    recommendTag:[],
    swiperHeight: 0,
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取功能按钮
    this.getBtns();

    //获取推荐订阅
    this.getRecommendTag();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ swiperHeight: res.windowHeight });
      },
    })
  },

  getBtns:function(){
    var that = this;
    var param = "a=square&c=topic";
    util.request(param, function (res){
      
      var newArr = util.groupArray(res.data.square_list,10);
      that.setData({ squarelist: newArr, page:newArr.length});
    });    
  },
  getRecommendTag:function(){
    var that = this;
    var url = "https://d.api.budejie.com/tag/subscribe/budejie-android-6.7.2.json";
    util.requestUrl(url,'', function (res) {
      var d = res.data.rec_tags;
      for(var i=0;i<d.length;i++){
        d[i]['sub_number'] = util.formatNum(d[i]['sub_number']);
      }
      that.setData({ recommendTag: d});
    });  
  },
  jumpWeb:function(){
    wx.navigateTo({
      url: '../webview/index',
    })
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