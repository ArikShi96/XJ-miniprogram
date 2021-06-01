<template>
  <view>
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="navigateDetail(item.uuid)"
      >
        <text class="label">{{ item.title }}</text>
        <view class="value">
          <text>{{ item.createdAt }}</text>
          <image
            class="icon"
            :src="RemoveIcon"
            @click.stop="handleRemove(item.uuid)"
          />
        </view>
      </view>
      <view v-if="!list.length" class="empty">暂无数据</view>
    </view>
    <image class="add-icon" :src="AddIcon" @click="navigateAdd" />
  </view>
</template>
<script>
import AddIcon from "@/static/img/icon/add.png";
import RemoveIcon from "@/static/img/icon/remove.png";
import { memoList, memoRemove } from "@/util/cloud/memo.js";
export default {
  async onLoad() {},
  async onShow() {
    this.fetchList();
  },
  data() {
    return {
      AddIcon,
      RemoveIcon,
      list: [],
    };
  },
  methods: {
    async fetchList() {
      uni.showLoading({
        title: "加载中",
      });
      const res = await memoList();
      this.list = res.data;
      uni.hideLoading();
    },
    handleRemove(uuid) {
      const self = this;
      uni.showModal({
        title: "温馨提示",
        content: "是否要删除这条数据?",
        success(res) {
          if (res.confirm) {
            self.removeMemo(uuid);
          } else if (res.cancel) {
            return;
          }
        },
      });
    },
    async removeMemo(uuid) {
      try {
        await memoRemove(uuid);
        uni.showToast({
          title: "删除成功",
          duration: 1000,
        });
        this.fetchList();
      } catch (err) {
        uni.showToast({
          icon: "none",
          title: "删除失败",
          duration: 1000,
        });
      }
    },
    navigateAdd() {
      uni.navigateTo({
        url: "/pages/memo/add",
      });
    },
    navigateDetail(uuid) {
      uni.navigateTo({
        url: `/pages/memo/show?id=${uuid}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 40rpx;
    border-bottom: 1px solid $uni-border-color;
    .label {
      color: $uni-text-color;
    }
    .value {
      color: $uni-text-color-grey;
      display: flex;
      align-items: center;
      .icon {
        width: 32rpx;
        height: 32rpx;
        margin-left: 8rpx;
      }
    }
  }
}
.empty {
  text-align: center;
  margin-top: 60rpx;
}
.add-icon {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 80rpx;
  height: 80rpx;
}
</style>
