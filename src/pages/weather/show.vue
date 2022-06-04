<template>
  <view class="content">
    <u-divider>当前天气</u-divider>
    <view class="title">当前天气</view>
    <view class="value last">{{ detail.text || "" }}</view>
    <view class="title">当前气温</view>
    <view class="value last">{{ detail.temp || "" }}℃</view>
    <u-divider>3日天气</u-divider>
    <view v-for="day in daysDetail">
      <view class="title">{{ day.fxDate }}</view>
      <view class="value">气温: {{ day.tempMin }}℃ - {{ day.tempMax }}℃</view>
      <view class="value">天气: {{ day.textDay }}转{{ day.textNight }}</view>
      <view class="value last"
        >日出时间: {{ day.sunrise }} — {{ day.sunset }}</view
      >
    </view>
  </view>
</template>
<script>
import { realtimeWeather, threeDaysWeather } from "@/util/cloud/weather.js";
export default {
  onLoad(options) {
    this.id = options.id;
  },
  async onShow() {
    uni.showLoading({
      title: "加载中",
    });
    await this.fetchDetail();
    await this.fetch3daysDetail();
    uni.hideLoading();
  },
  data() {
    return {
      id: "",
      detail: {},
      daysDetail: [],
    };
  },
  methods: {
    async fetchDetail() {
      this.detail = await realtimeWeather(this.id);
    },
    async fetch3daysDetail() {
      this.daysDetail = await threeDaysWeather(this.id);
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
    margin-bottom: 16rpx;
    &.image-list {
      image {
        width: 100%;
        margin-bottom: 16rpx;
      }
    }
    &.last {
      margin-bottom: 32rpx;
    }
  }
}
</style>
