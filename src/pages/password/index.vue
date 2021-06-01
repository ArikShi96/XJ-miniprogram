<template>
  <view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="item">
        <text class="label">{{ item.title }}</text>
        <view class="value">
          <text>{{ item.password }}</text>
          <image
            class="icon"
            :src="RemoveIcon"
            @click="handleRemove(item.title)"
          />
        </view>
      </view>
      <view v-if="!list.length" class="empty">暂无数据</view>
    </view>
    <image class="add-icon" :src="AddIcon" @click="navigateAdd" />
  </view>
</template>
<script>
import { uniList } from "@dcloudio/uni-ui";
import AddIcon from "@/static/img/icon/add.png";
import RemoveIcon from "@/static/img/icon/remove.png";
import { passwordList, passwordRemove } from "@/util/cloud/password.js";
export default {
  components: {
    uniList,
    // uniListItem,
  },
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
      const res = await passwordList();
      this.list = res.data;
      uni.hideLoading();
    },
    handleRemove(title) {
      const self = this;
      uni.showModal({
        title: "温馨提示",
        content: "是否要删除这条数据?",
        success(res) {
          if (res.confirm) {
            self.removePassword(title);
          } else if (res.cancel) {
            return;
          }
        },
      });
    },
    async removePassword(title) {
      try {
        await passwordRemove(title);
        uni.showToast({
          title: "删除成功",
          duration: 1000,
        });
        this.fetchList();
      } catch (err) {
        uni.showToast({
          icon: "error",
          title: "删除失败",
          duration: 1000,
        });
      }
    },
    navigateAdd() {
      uni.navigateTo({
        url: "/pages/password/add",
      });
    },
    navigateEdit() {},
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
      color: $uni-text-color;
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
