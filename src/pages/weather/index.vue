<template>
  <view>
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="navigateDetail(item.id)"
      >
        <text class="label">
          {{ `${item.adm1} - ${item.adm2} - ${item.name}` }}
        </text>
        <view class="value">
          <switch
            class="switch"
            :checked="item.notify"
            style="transform:translateX(-16rpx) scale(0.7)"
            @click.stop=""
            @change.stop="handleChange($event, item.uuid)"
          />
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
import {
  weatherList,
  weatherRemove,
  weatherUpdate,
} from "@/util/cloud/weather.js";
import { subscribeMsg } from "@/util/cloud/subcribe.js";
const tmplId = "9Ng25oXuoF-HyilFkGd87Pe6FAIVAUeyS7w5EYX87WY";
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
      const res = await weatherList();
      this.list = res.data;
      uni.hideLoading();
    },
    async handleChange(event, uuid) {
      try {
        if (event.target.value) {
          await subscribeMsg(tmplId);
        }
        await weatherUpdate(uuid, {
          notify: event.target.value,
        });
      } catch (err) {}
    },
    handleRemove(uuid) {
      const self = this;
      uni.showModal({
        title: "温馨提示",
        content: "是否要删除这条数据?",
        success(res) {
          if (res.confirm) {
            self.removeWeather(uuid);
          } else if (res.cancel) {
            return;
          }
        },
      });
    },
    async removeWeather(uuid) {
      try {
        await weatherRemove(uuid);
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
        url: `/pages/weather/add`,
      });
    },
    navigateDetail(locationId) {
      uni.navigateTo({
        url: `/pages/weather/show?id=${locationId}`,
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
