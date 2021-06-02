<template>
  <view class="content">
    <view class="title">标题</view>
    <view class="value">{{ detail.title }}</view>
    <view class="title">纪念人</view>
    <view class="value">{{ detail.people }}</view>
    <view class="title">纪念地点</view>
    <view class="value">{{ detail.address }}</view>
    <view class="title">纪念日期</view>
    <view class="value">{{ detail.date }}</view>
    <view class="uni-form-item uni-column">
      <view class="title">是否提醒</view>
      <switch
        class="switch"
        :checked="detail.date"
        name="notify"
        style="transform:translateX(-16rpx) scale(0.7)"
      />
    </view>
  </view>
</template>
<script>
import { rememberList } from "@/util/cloud/remember.js";
export default {
  onLoad(options) {
    this.uuid = options.id;
  },
  onShow() {
    this.fetchDetail();
  },
  data() {
    return {
      uuid: "",
      detail: {},
    };
  },
  methods: {
    async fetchDetail() {
      uni.showLoading({
        title: "加载中",
      });
      const res = await rememberList({ uuid: this.uuid });
      this.detail = res.data[0] || {};
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
