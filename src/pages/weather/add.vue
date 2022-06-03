<template>
  <view class="content">
    <view class="search-wrap">
      <input
        class="uni-input"
        placeholder="请输入城市名称"
        v-model="location"
      />
      <button class="button" type="primary" @click="fetchList">
        搜索
      </button>
    </view>
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :class="{ active: item.id === checked.id }"
        @click="checked = item"
      >
        <text>
          {{ `${item.adm1}-${item.adm2}-${item.name}` }}
        </text>
        <text class="tip">{{ item.id }}</text>
      </view>
    </view>
    <view v-if="!list.length" class="empty">暂无数据</view>
    <view class="uni-btn-v">
      <button
        class="button"
        type="primary"
        :loading="submitLoading"
        @click="submit"
      >
        {{ submitLoading ? "提交中" : "提交" }}
      </button>
    </view>
  </view>
</template>
<script>
import { cityList, weatherAdd } from "@/util/cloud/weather.js";
import { generateUuid } from "@/util/util.js";
export default {
  onShow() {},
  data() {
    return {
      location: "",
      checked: {},
      list: [],
      submitLoading: false,
    };
  },
  methods: {
    async fetchList() {
      uni.showLoading({
        title: "加载中",
      });
      this.checked = {};
      const res = await cityList(this.location);
      this.list = res;
      uni.hideLoading();
    },
    async submit() {
      if (!this.checked.id) {
        uni.showToast({
          icon: "none",
          title: "请选择城市",
          duration: 1000,
        });
        return;
      }
      this.submitLoading = true;
      try {
        await weatherAdd({ uuid: generateUuid(), ...this.checked });
        uni.showToast({
          title: "添加成功",
          duration: 1000,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (err) {
        uni.showToast({
          icon: "none",
          title: "添加失败",
          duration: 1000,
        });
      }
      this.submitLoading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx;
  .search-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    .uni-input {
      flex: auto;
      padding: 8rpx 16rpx;
      border: 1px solid $uni-border-color;
    }
    .button {
      margin: 0;
      margin-left: 20rpx;
      height: 64rpx;
      font-size: 28rpx;
    }
  }
  .empty {
    text-align: center;
    margin-top: 60rpx;
  }
  .list {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 16rpx;
      border-bottom: 1px solid $uni-border-color;
      .tip {
        color: $uni-text-color-grey;
      }
      &.active {
        color: #ffffff;
        background-color: #1aad19;
        .tip {
          color: #ffffff;
        }
      }
    }
  }
  .uni-btn-v {
    margin-top: 32rpx;
    .button {
      margin-bottom: 16rpx;
      font-size: 28rpx;
    }
  }
}
</style>
