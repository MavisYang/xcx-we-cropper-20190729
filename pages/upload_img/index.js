// pages/upload_img/index.js
import WeCropper from '../../we-cropper/we-cropper.min.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight - 50
const cutW = 300
const cutH = cutW
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImgUrl: '',
    showStatus: false, //false
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - cutW) / 2, // 裁剪框x轴起点
        y: (height - cutH) / 2, // 裁剪框y轴期起点
        width: cutW, // 裁剪框宽度
        height: cutH  // 裁剪框高度
      }
    },
    head_url: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //图片裁剪
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
      .updateCanvas()
  },
  // 图片上传 裁剪 begin
  touchStart: function (e) {
    this.cropper.touchStart(e)
  },
  touchMove: function (e) {
    this.cropper.touchMove(e)
  },
  touchEnd: function (e) {
    this.cropper.touchEnd(e)
  },
  uploadTap: function (params) {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.setData({
          showStatus: true
        });
        self.cropper.pushOrign(src)
      }
    })
  },
  getCropperImage: function () {
    const self = this
    const { parmas, uploadImgUrl } = self.data
    this.cropper.getCropperImage((tempFilePath) => {
      console.log(tempFilePath, '裁剪后的图片临时路径');
      self.setData({
            showStatus: false,
        head_url: tempFilePath,
      })
      // wx.uploadFile({
      //   url: uploadImgUrl,
      //   filePath: tempFilePath,
      //   name: 'file',
      //   formData: null,
      //   success: (res) => {
      //     let pic = JSON.parse(res.data).data[0];
      //     parmas['head_url'] = pic
      //     self.setData({
      //       showStatus: false,
      //       head_url: pic,
      //       parmas
      //     }, () => self.verifyParmas())
      //   }
      // });

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

  }
})