// pages/list/list.js
function fixZero(num) {
  return num < 10 ? '0' + num : num;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用于存储云端数据
    list: [],
    // showToolbar: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  // 查询数据
  getData() {
    // 使用云函数
    wx.cloud.callFunction({
      name: 'mydb',
      data: {
        type: 'list'
      },
      success: res => {
        // console.log(res);
        let result = res.result || {};

        this.dealData(result.data, function (data) {
          that.setData({
            list: data
          });
        });

      },
      fail: err => {
        console.log(err);
      }
    })

    // var db = wx.cloud.database();
    // db.collection('note_list').get({
    //   success: res => {
    //     // console.log(res);

    //     this.dealData(res.data);
    //   }
    // })
  },

  // 数据解析
  dealData(list) {
    // 日记列表
    let fileList = [];

    // 时间解析
    list.forEach(item => {
      let date = new Date(item.time);
      item.timeInfo = {
        year: fixZero(date.getFullYear()),
        month: fixZero(date.getMonth() + 1),
        date: fixZero(date.getDate()),
        hours: fixZero(date.getHours()),
        minutes: fixZero(date.getMinutes())
      }

      fileList.push(item.img || '');
    })

    // 对图片解析  将临时地址换成http
    wx.cloud.getTempFileURL({
      fileList: fileList,
      success: res => {
        let fileList = res.fileList;
        list.forEach((item, index) => {
          // 将cloud://路径转换为真实图片路径http://
          item.img = fileList[index].tempFileURL;
        })

        callback(list);
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '图片解析失败'
        });
      }
    })

    // console.log(list);
    this.setData({
      list: list
    })
  },

  // onToggle: function () {
  //   this.setData({
  //     showToolbar: !this.data.showToolbar
  //   });
  // },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/addComment/addComment',
    })
  },
  goToDetail(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    wx.navigateTo({
      url: '/pages/commentDetail/commentDetail?id=' + item._id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    return {
      title: '我的云记事本'
    }
  }
})