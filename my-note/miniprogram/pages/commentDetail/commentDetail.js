// pages/commentDetail/commentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id);
    this.getDataById(options.id)
  },

  getDataById(id) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'mydb',
      data: {
        type: 'detail',
        id: id
      },
      success: res => {
        console.log(res);
        if (res.result.data.img) {
          wx.cloud.getTempFileURL({
            fileList: [res.result.data.img],
            success: res2 => {
              let fileList = res2.fileList;
              res.result.data.img = fileList[0].tempFileURL;

              this.setData({
                detail: res.result.data
              })
              // console.log(this.data.detail);
            }
          })
        }
      }
    })

    // let db=wx.cloud.database();
    // db.collection('note_list').doc(id).get({
    //   success:res=>{
    //     console.log(res);
    //     if (res.data.img) {
    //       wx.cloud.getTempFileURL({
    //         fileList:[res.data.img],
    //         success:res2=>{
    //           let fileList=res2.fileList;
    //           res.data.img=fileList[0].tempFileURL;

    //           this.setData({
    //             detail:res.data
    //           })
    //           // console.log(this.data.detail);
    //         }
    //       })
    //     }
    //   }
    // })
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
      title: this.data.detail.comment
    }
  }
})