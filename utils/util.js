var config = require("config.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 请求数据
 */
function request(param="",success,method="GET",header={}){
  //发送请求
  wx.request({
    url: config.BaseURL +(method == "GET" ? "?" :"")+ param,
    data:{},
    method:method?method:"GET",
    header:header?header:"application/json",
    success:function(res){
      // console.log(res);
      success(res);
    }
  })
}

function requestUrl(url="",param = "", success, method = "GET", header = {}) {
  //发送请求
  wx.request({
    url: url + (method == "GET" ? "?" : "") + param,
    data: {},
    method: method ? method : "GET",
    header: header ? header : "application/json",
    success: function (res) {
      // console.log(res);
      success(res);
    }
  })
}
/**
 * 分割数组
 * array  要分割的数组
 * subGroupLength 分成多少个一组
 */
function groupArray(array, subGroupLength) {
  var index = 0;
  var newArray = [];

  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }

  return newArray;
}

//格式化数字
function formatNum(num){
  if (num > 10000){
    var n = Math.round((num / 10000) * 100) / 100;
    return n + '万';
  } 
  
  return num;
}


//HUD
function showLoading(title='正在加载...',duration=5000){
  wx.showLoading({
    title: title,
    success:"loading",
    duration:duration
  })
}

function hideToast(){
  wx.hideToast();
}

function showSuccess(title="加载成功",duration=3000){
  wx.showLoading({
    title: title,
    success: "success",
    duration: duration
  })
}

module.exports = {
  formatTime: formatTime,
  request: request,
  requestUrl, requestUrl,
  showLoading: showLoading,
  hideToast: hideToast,
  showSuccess: showSuccess,
  groupArray: groupArray,
  formatNum: formatNum
}
