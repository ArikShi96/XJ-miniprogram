<template> </template>
<script>
export default {
  async onLoad() {},
  async onShow() {
    const res = await this.login();
    const user = await this.getUserProfile();
    getApp().globalData.openid = res.result.openid;
    getApp().globalData.user = user.userInfo;
    uni.redirectTo({ url: "/pages/index/index" });
  },
  data() {
    return {
      code: "", // 换openid
      openid: "",
      user: "",
    };
  },
  methods: {
    // 登录
    login() {
      wx.cloud.init();
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: "login",
          data: {},
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 获取用户信息
    getUserProfile() {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: "温馨提示",
          content: "亲，授权微信登录后才能正常使用小程序功能",
          success(res) {
            if (res.confirm) {
              uni.getUserProfile({
                desc: "获取你的昵称、头像、地区及性别",
                success: (res) => {
                  resolve(res);
                },
                fail: (res) => {
                  reject(res);
                  //拒绝授权
                  uni.showToast({
                    title: "您拒绝了请求,不能正常使用小程序",
                    icon: "error",
                    duration: 2000,
                  });
                  return;
                },
              });
            } else if (res.cancel) {
              //如果用户点击了取消按钮
              uni.showToast({
                title: "您拒绝了请求,不能正常使用小程序",
                icon: "error",
                duration: 2000,
              });
              return;
            }
          },
        });
      });
    },
  },
};
</script>
<style></style>
