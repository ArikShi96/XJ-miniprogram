<template>
  <view class="content">
    <view class="title">当前天气</view>
    <view class="value">{{ detail.text }}</view>
    <view class="title">当前气温</view>
    <view class="value">{{ detail.temp }}</view>
  </view>
</template>
<script>
import { realtimeWeather } from "@/util/cloud/weather.js";
export default {
  onLoad(options) {
    this.id = options.id;
  },
  onShow() {
    this.fetchDetail();
  },
  data() {
    return {
      id: "",
      detail: {},
    };
  },
  methods: {
    async fetchDetail() {
      uni.showLoading({
        title: "加载中",
      });
      this.detail = await realtimeWeather(this.id);
      uni.hideLoading();
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 40rpx;
  .title {
    margin-bottom: 16rpx;
    font-weight: bold;
    font-size: 32rpx;
  }
  .value {
    margin-bottom: 32rpx;
    &.image-list {
      image {
        width: 100%;
        margin-bottom: 16rpx;
      }
    }
  }
}
</style>
