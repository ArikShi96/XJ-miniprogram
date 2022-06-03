<template>
  <view class="content">
    <view class="title">触发纪念日通知</view>
    <view class="value">
      <button class="button" type="primary" @click="triggerMessage">
        触发
      </button>
    </view>
    <view class="title">触发天气通知</view>
    <view class="value">
      <button class="button" type="primary" @click="triggerWeatherMessage">
        触发
      </button>
    </view>
  </view>
</template>
<script>
import { subscribeMsg, cloudSendMsg } from "@/util/cloud/subcribe.js";
const rememberTmplId = "9Ng25oXuoF-HyilFkGd87Pe6FAIVAUeyS7w5EYX87WY";
const weatherTmplId = "3FAKZcJ6u2hqPceD4385tiIEwbYLH9VK9pYysK4lymk";
export default {
  methods: {
    async triggerMessage() {
      await subscribeMsg(rememberTmplId);
      cloudSendMsg("sendTemplateMessage");
    },
    async triggerWeatherMessage() {
      await subscribeMsg(weatherTmplId);
      cloudSendMsg("sendWeatherMessage");
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx;
  .title {
    margin-bottom: 16rpx;
    font-weight: bold;
    font-size: 32rpx;
  }
  .value {
    margin-bottom: 32rpx;
    .button {
      margin: 0;
      height: 64rpx;
      font-size: 28rpx;
      width: 200rpx;
    }
  }
}
</style>
