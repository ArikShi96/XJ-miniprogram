<template>
  <view class="content">
    <view
      class="item"
      v-for="item in list"
      :key="item.text"
      @click="navigate(item.url)"
    >
      <image class="logo" :src="item.icon" />
      <text>{{ item.text }}</text>
    </view>
    <image
      v-if="isAdmin"
      class="admin-icon"
      :src="AdminIcon"
      @click="navigateAdmin"
    />
  </view>
</template>

<script>
import PasswordIcon from "@/static/img/icon/password.png";
import MemoIcon from "@/static/img/icon/memo.png";
import ChoujiangIcon from "@/static/img/icon/抽奖.png";
import RememberIcon from "@/static/img/icon/纪念日.png";
import WeatherIcon from "@/static/img/icon/weather.png";
import WaitingIcon from "@/static/img/icon/waiting2.png";
import AdminIcon from "@/static/img/icon/admin.png";
import MaiCaiIcon from "@/static/img/icon/买菜.png";
export default {
  onShow() {
    // this.checkSession();
  },
  onHide() {},
  data() {
    return {
      AdminIcon,
      list: [
        { icon: MaiCaiIcon, text: "买菜比价", url: "/pages/maicai/index" },
        { icon: PasswordIcon, text: "密码管理", url: "/pages/password/index" },
        { icon: MemoIcon, text: "便签", url: "/pages/memo/index" },
        { icon: ChoujiangIcon, text: "抽签", url: "/pages/chouqian/index" },
        { icon: RememberIcon, text: "纪念日", url: "/pages/remember/index" },
        { icon: WeatherIcon, text: "天气", url: "/pages/weather/index" },
        { icon: WaitingIcon, text: "敬请期待" },
        { icon: WaitingIcon, text: "敬请期待" },
      ],
    };
  },
  computed: {
    isAdmin() {
      return getApp().globalData.openid === "o09pZ5FpRP4eQ3PmSz7DIuak13Dg";
    },
  },
  methods: {
    // 获取登录状态
    checkSession() {
      if (!getApp().globalData.openid) {
        uni.redirectTo({
          url: "/pages/login/index",
        });
      }
    },
    // 跳转
    navigate(url) {
      if (!url) {
        return;
      }
      uni.navigateTo({
        url,
      });
    },
    // 管理员界面
    navigateAdmin() {
      uni.navigateTo({
        url: "/pages/admin/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  .item {
    flex: 0 0 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32rpx 0;
    .logo {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 16prx;
      border-radius: 40rpx;
    }
  }
  .admin-icon {
    position: fixed;
    right: 40rpx;
    bottom: 80rpx;
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
