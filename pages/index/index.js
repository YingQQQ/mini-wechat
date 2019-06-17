import WXAPI from '../../wxapi/main';
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperCurrent: 0,
    bannerList: [],
    shopSubList: [],
    goodsRecommend: [] // 推荐商品
  },
  onShow() {
    WXAPI.banners().then(res => {
      if (res.code === 0) {
        this.setData({
          bannerList: res.data
        });
        console.log(res.data);
      }
    });
    WXAPI.shopSubList().then(res => {
      if (res.code === 0) {
        this.setData({
          shopSubList: res.data
        });
        console.log(res.data);
      }
    });
    WXAPI.goods({
      recommendStatus: 1
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          goodsRecommend: res.data
        });
      }
    });
  },
  swiperChange(e) {
    // banner滚动事件
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  toDetailsTap(e) {
    wx.navigateTo({
      url: `/pages/goods-details/index?id=${e.currentTarget.dataset.id}`
    });
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
});
