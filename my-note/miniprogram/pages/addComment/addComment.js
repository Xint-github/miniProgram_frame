// pages/addComment/addComment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddBtn: true, // 是否显示添加按钮
    form: {
      img: '',
      comment: ''
    }
  },
  uploadImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: 'image', // 压缩
      sourceType: ['camera', 'album'], // 相机 相册
      success: res => {
        console.log(res);
        this.setData({
          showAddBtn: false,
          'form.img': res.tempFiles[0].tempFilePath
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  onInput(event) {
    this.setData({
      'form.comment': event.detail.value
    })
  },
  onSave() {
    var form =this.data.form
    if (!form.img || !form.comment) {
      wx.showToast({
        title: '请先填写内容',
        icon:'none'
      })
      return;
    }

    // 文件名 时间戳＋扩展名
    // 取扩展名 字符串截取  从.开始截取，还可以使用正则
    var cloudFile = Date.now()+form.img.match(/\.[^.]+?$/)[0]
    console.log(cloudFile);

    // 上传图片
    wx.cloud.uploadFile({
      cloudPath:cloudFile,
      filePath:form.img,
      success:res=>{
        // console.log(res.fileID);
        // 存储到数据库
        this.addToDB(res.fileID)
      },
      fail:err=>{
        console.log(err);
      }
    })
  },

  /**
   * 将结构化的数据存储到云端
   */
  addToDB(fileID){
    // var db=wx.cloud.database();
    let form=this.data.form;

    // 使用云函数
    wx.cloud.callFunction({
      name:'mydb',
      data:{
        type:'add',
        img:fileID,
        comment:form.comment
      },
      success:res=>{
        wx.showToast({
          title: '保存成功',
        })

        // 页面跳转
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/list/list',
          })
        }, 500);
      }
    })

    // db.collection('note_list').add({
    //   data:{
    //     img:fileID,
    //     comment:form.comment,
    //     time:Date.now()
    //   },
    //   success:res=>{
    //     wx.showToast({
    //       title: '保存成功',
    //     })
    //   },
    //   fail:err=>{
    //     console.log(err);
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})