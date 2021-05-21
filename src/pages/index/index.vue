<template>
  <view class="content">
    <image class="logo" src="../../static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <u-button type="primary" @click="addUser">添加用户</u-button>
  </view>
</template>

<script>
export default {
  onShow() {
    this.checkSession();
  },
  onHide() {},
  data() {
    return {};
  },
  methods: {
    async addUser() {
      // 插入用户
      const db = wx.cloud.database();
      db.collection("users").add({
        data: {
          name: "微信用户",
          open_id: this.openid,
        },
        success: function(res) {
          console.log(res);
        },
      });
    },
    // 获取登录状态
    checkSession() {
      if (!getApp().globalData.openid) {
        uni.redirectTo({
          url: "/pages/login/index",
          success(res) {
            console.log(res);
          },
          fail(err) {
            console.log(err);
          },
        });
      }
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
