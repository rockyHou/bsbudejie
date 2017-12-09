// detail.js

const util = require("../../utils/util.js");

var detailId = 0;
var page = 1;
var lastcid = 0;
var isLoading = false;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    hotItem:{},
    commentItem:{},
    swiperHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    detailId = options.id;
    var cell = JSON.parse(options.cell);
    this.setData({ item:cell});

    //请求最新数据
    this.refreshNewData();
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //请求最新数据
    this.refreshNewData();
  },
  refreshNewData:function(){  
    var that = this; 
    //显示正在加载....
    util.showLoading();

    var param = 'a=dataList&c=comment&data_id=' + detailId + "&hot=1";
    console.log(param);
    util.request(param,function(res){
      console.log(res);
      // commentItem:res.data.data
      // hotItem:res.data.hot
      that.setNewData(res,that);

      setTimeout(function(){
        util.hideToast();
        wx.stopPullDownRefresh();
      },1000);
    });
  },
  setNewData:function(res,target){
    target.setData({
      hotItem:res.data.hot,
      commentItem: res.data.data
    });
  },
  loadMoreData: function () {
    var that = this;
    //显示正在加载....
    util.showLoading();

    var param = 'a=dataList&c=comment&data_id=' + detailId + "&page=" + (page + 1) + "&lastcid=" + lastcid;
    console.log(param);
    util.request(param, function (res) {
      if (res.data.data || !isLoading) {
        page += 1;
        that.setData({
          commentItem: that.data.commentItem.concat(res.data.data)
        });
        lastcid = res.data.data[res.data.data.length - 1].id;
        setTimeout(function () {
          util.hideToast();
          wx.stopPullDownRefresh();
          isLoading=true;
        }, 1000);
      } else {
        util.showSuccess('全部加载完',2000);
      }
    });
  },
  clickImage:function(){
    console.log('点击图片');
  }
})