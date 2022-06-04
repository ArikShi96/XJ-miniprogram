<template>
  <view class="content">
    <u-divider>当前天气</u-divider>
    <view class="title">当前天气</view>
    <view class="value">{{ detail.text || "" }}</view>
    <view class="image-list last">
      <image
        v-if="iconMap[detail.text]"
        class="image"
        :src="iconMap[detail.text]"
      />
    </view>
    <view class="title">当前气温</view>
    <view class="value last">{{ detail.temp || "" }}℃</view>
    <u-divider>3日天气</u-divider>
    <view v-for="day in daysDetail">
      <view class="title">{{ day.fxDate }}</view>
      <view class="value">气温: {{ day.tempMin }}℃ - {{ day.tempMax }}℃</view>
      <view class="value">天气: {{ day.textDay }}转{{ day.textNight }}</view>
      <view class="image-list">
        <image
          v-if="iconMap[day.textDay]"
          class="image"
          :src="iconMap[day.textDay]"
        />
      </view>
      <view class="value last">
        日出时间: {{ day.sunrise }} — {{ day.sunset }}
      </view>
    </view>
  </view>
</template>
<script>
import { realtimeWeather, threeDaysWeather } from "@/util/cloud/weather.js";
import 暴雨 from "@/static/img/weather/暴雨.png";
import 大暴雨 from "@/static/img/weather/大暴雨.png";
import 大雨 from "@/static/img/weather/大雨.png";
import 多云 from "@/static/img/weather/多云.png";
import 雷雨 from "@/static/img/weather/雷雨.png";
import 晴 from "@/static/img/weather/晴.png";
import 小雨 from "@/static/img/weather/小雨.png";
import 雪 from "@/static/img/weather/雪.png";
import 阴 from "@/static/img/weather/阴.png";
import 中雨 from "@/static/img/weather/中雨.png";
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
      iconMap: { 暴雨, 大暴雨, 大雨, 多云, 雷雨, 晴, 小雨, 雪, 阴, 中雨 },
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
  }
  .image {
    height: 80rpx;
    width: 80rpx;
    object-fit: contain;
    margin-right: 40rpx;
  }
  .last {
    margin-bottom: 32rpx;
  }
}
</style>
