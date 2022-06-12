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
import {
  subscribeMsg,
  cloudSendMsg,
  REMEMBER_TEMPLATE_ID,
  WEATHER_TEMPLATE_ID,
} from "@/util/cloud/subcribe.js";
export default {
  methods: {
    async triggerMessage() {
      await subscribeMsg(REMEMBER_TEMPLATE_ID);
      cloudSendMsg("sendTemplateMessage");
    },
    async triggerWeatherMessage() {
      await subscribeMsg(WEATHER_TEMPLATE_ID);
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
