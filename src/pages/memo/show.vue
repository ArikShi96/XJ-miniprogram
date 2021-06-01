<template>
  <view class="content">
    <view class="title">最后更新时间</view>
    <view class="value">{{ detail.updatedAt || detail.createdAt }}</view>
    <view class="title">标题</view>
    <view class="value">{{ detail.title }}</view>
    <view class="title">内容</view>
    <view class="value">{{ detail.content }}</view>
    <view class="title">图片</view>
    <view class="value image-list">
      <image
        v-for="image in (detail.images || '').split(',')"
        :key="image"
        :src="image"
        mode="widthFix"
      />
    </view>
    <image class="edit-icon" :src="EditIcon" @click="navigateEdit" />
  </view>
</template>
<script>
import { memoList } from "@/util/cloud/memo.js";
import EditIcon from "@/static/img/icon/edit.png";
export default {
  onLoad(options) {
    this.uuid = options.id;
    this.fetchDetail();
  },
  data() {
    return {
      EditIcon,
      uuid: "",
      detail: {},
    };
  },
  methods: {
    async fetchDetail() {
      uni.showLoading({
        title: "加载中",
      });
      const res = await memoList({ uuid: this.uuid });
      this.detail = res.data[0] || {};
      uni.hideLoading();
    },
    navigateEdit() {
      uni.navigateTo({
        url: `/pages/memo/edit?id=${this.uuid}`,
      });
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
  .edit-icon {
    position: fixed;
    right: 40rpx;
    bottom: 80rpx;
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
