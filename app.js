import WXAPI from 'wxapi/main';
//app.js
App({
  navigateToLogin: false,
  timer: null,
  onLaunch: function() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // 检测版本
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success: result => {
        if (result.networkType === 'none') {
          this.globalData.isConnected = false;
          wx.showToast({
            title: '当前网络不可用',
            icon: 'loading',
            duration: 1500,
            mask: false
          });
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(result => {
      if (!result.isConnected) {
        this.globalData.isConnected = false;
        wx.wx.showToast({
          title: '网络已经断开',
          icon: 'loading',
          duration: 1500,
          mask: false
        });
      } else {
        this.globalData.isConnected = true;
        wx.hideToast();
      }
    });
    //  获取系统参数设置
    WXAPI.queryConfigBatch('mallName').then(function(res) {
      if (res.code === 0) {
        res.data.forEach(ele => {
          wx.setStorageSync(ele.key, ele.value);
        });
      }
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  goLoginPageTimeOut(params) {
    if (this.navigateToLogin) {
      return;
    }
    wx.removeStorageSync('token');
    this.navigateToLogin = true;
    this.timer = setTimeout(() => {
      wx.navigateTo({
        url: '/pages/authorize/index',
        complete: () => {
          this.timer = null;
        }
      });
    }, 1000);
  },
  onShow(e) {
    this.globalData.launchOption = e;
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
    }
  },
  globalData: {
    userInfo: null,
    isConnected: true,
    launchOption: undefined
  }
});
