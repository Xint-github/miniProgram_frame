// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 在服务端获取数据库不需要wx命名空间，云函数上const db = wx.cloud.database这一句把wx.去掉，官方文档里分为小程序端和服务端
let db = cloud.database()

// 添加日记云函数
function add(event, context) {
  return new Promise(function (resolve, reject) {
    let data = {
      img: event.img,
      comment: event.comment,
      time: Date.now(),
      _openid: event.userInfo.openId
    }

    db.collection('note_list').add({
      data: data,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })

  })
}

// 查询日记
function getList(event, context) {
  // 这样会把所有人的日记查出
  // return db.collection('note_list').get()

  // 只查自己的日记
  // openid：小程序用户标识
  return db.collection('note_list').where({
    _openid:event.userInfo.openId
  }).get()
}

// 根据id查询日记
function getDataById(event, context) {
  return db.collection('note_list').doc(event.id).get()
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('调用云函数成功');
  console.log(event);

  // const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  if (event.type === 'add') {
    return add(event, context)
  } else if (event.type === 'list') {
    return getList(event, context)
  } else {
    return getDataById(event, context)
  }
}