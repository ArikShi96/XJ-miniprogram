<template>
  <view class="content">
    <u-tabs
      :list="tabs"
      :is-scroll="false"
      :current="currentTab"
      @change="onTabChange"
    ></u-tabs>
    <!-- search -->
    <view class="search">
      <u-search
        placeholder="请输入物品"
        v-model="keyword"
        @search="fetchList(false)"
        @custom="fetchList(false)"
      ></u-search>
    </view>
    <!-- tags -->
    <view class="tags">
      <u-tag
        v-for="tag in tags"
        :key="tag"
        :text="tag"
        :type="tag === currentTag ? 'primary' : 'info'"
        size="mini"
        @click="onTagChange(tag)"
      />
    </view>
    <!--  -->
    <view v-if="currentTab === 1" class="tip error"
      >(每日优鲜只支持上面几种类型的搜索)</view
    >
    <!-- 状态筛选 -->
    <view>
      <view class="current-status">
        当前显示：
        <u-tag
          :text="status[currentStatus].label"
          type="primary"
          size="mini"
          @click="showStatusSelect = true"
        />
      </view>
      <u-select
        v-model="showStatusSelect"
        mode="single-column"
        :list="status"
        @confirm="onStatusChange"
      ></u-select>
    </view>
    <!-- loading -->
    <view v-if="loading" class="loading">
      <u-loading mode="circle"></u-loading>
    </view>
    <!-- empty list -->
    <view
      v-else-if="!loading && !filteredList.length"
      class="empty"
      :class="{ empty: !filteredList.length }"
    >
      <u-empty text="没有搜索结果" mode="search"></u-empty>
    </view>
    <!-- list -->
    <view v-else class="list">
      <u-card
        v-for="(item, index) in filteredList"
        :key="index"
        :title="item.name"
        :thumb="item.image"
        :thumb-width="120"
      >
        <view class="items" slot="body">
          <!-- 名称 -->
          <view class="item">名称: {{ item.name }}</view>
          <!-- 价格 -->
          <view class="item">价格: {{ item.detail }}</view>
          <!-- 库存 -->
          <view class="item"
            >库存: {{ item.stock
            }}<text v-if="item.stock === 0"
              >(<text class="error">已售罄</text>)</text
            ></view
          >
          <!-- 购买上限 -->
          <view class="item">购买上限: {{ item.limit }}</view>
        </view>
        <view class="foot" slot="foot">
          <view>活动: {{ item.activity }}</view>
        </view>
      </u-card>
    </view>
  </view>
</template>
<script>
import { getUserLocation } from "@/util/cloud/user";
import {
  dingdongSearch,
  freshSearch,
  meituanSearch,
} from "@/util/cloud/maicai";
import { FRESH_BASE_MFSIG_MAP } from "@/util/cloud/mock";
export default {
  async onShow() {
    await this.checkLocation();
    this.fetchList();
  },
  data() {
    return {
      loading: false,
      keyword: "",
      // tab
      currentTab: 0,
      tabs: [
        { name: "叮咚" },
        { name: "每日优鲜" },
        { name: "美团买菜" },
        { name: "盒马鲜生" },
      ],
      list: [],
      filteredList: [],
      // tag
      currentTag: "",
      tags: Object.keys(FRESH_BASE_MFSIG_MAP),
      // 状态筛选
      status: [
        { label: "全部", value: 0 },
        { label: "未售罄", value: 1 },
        { label: "已售罄", value: 2 },
      ],
      showStatusSelect: false,
      currentStatus: 1,
    };
  },
  watch: {
    currentTab() {
      this.fetchList();
    },
  },
  methods: {
    onTabChange(index) {
      this.currentTab = index;
    },
    onTagChange(tag) {
      this.currentTag = tag;
      this.keyword = tag;
      this.fetchList();
    },
    onStatusChange(event) {
      this.currentStatus = event[0].value;
      this.filterList();
    },
    async checkLocation() {
      const location = getApp().globalData.location;
      const { latitude, longitude } = location;
      if (!latitude || !longitude) {
        try {
          const res = await getUserLocation();
          getApp().globalData.location = res;
        } catch (err) {
          uni.showToast({
            icon: "none",
            title: `获取定位失败，请稍后重试: ${err.message}`,
            duration: 1000,
          });
        }
      }
    },
    async fetchList(skip = true) {
      this.loading = true;
      try {
        if (!this.keyword) {
          if (!skip) {
            throw new Error("请输入要搜索的物品");
          }
          this.loading = false;
          return;
        }
        const location = getApp().globalData.location;
        const { latitude, longitude } = location;
        const params = {
          latitude,
          longitude,
          keyword: this.keyword,
        };
        switch (this.currentTab) {
          case 0: {
            this.list = await dingdongSearch(params);
            this.list = this.handleDingdong(this.list);
            break;
          }
          case 1: {
            this.list = await freshSearch(params);
            this.list = this.handleFresh(this.list);
            break;
          }
          case 2: {
            this.list = await meituanSearch(params);
            this.list = this.handleMeituan(this.list);
            break;
          }
          case 3: {
            this.list = await dingdongSearch({});
            break;
          }
        }
        this.filterList();
      } catch (err) {
        uni.showToast({
          icon: "none",
          title: err.message,
          duration: 1000,
        });
      }
      this.loading = false;
    },
    // 数据处理
    handleDingdong(list) {
      return list.map((item) => {
        return {
          image: item.small_image,
          name: item.product_name,
          detail: `¥${item.price}${
            item.vip_price ? "(" + item.vip_price + ")" : ""
          } / ${item.net_weight}${item.net_weight_unit}`,
          stock: item.stock_number,
          limit:
            item.buy_limit === -1 || item.buy_limit === 0
              ? "无"
              : item.buy_limit,
          activity: item.activity.length
            ? item.activity.map((ac) => ac.tag).join(",")
            : "无",
        };
      });
    },
    handleFresh(list) {
      return list
        .filter((item) => item.name && item.priceInfo)
        .map((item) => {
          return {
            image: item.image,
            name: item.name,
            stock: item.stock,
            limit:
              item.seckillLimit === -1 || item.seckillLimit === 0
                ? "无"
                : item.seckillLimit,
            detail: `¥${item.priceInfo.commonPrice.price / 100}${
              item.priceInfo.vipPrice.price
                ? "(" + item.priceInfo.vipPrice.price / 100 + ")"
                : ""
            }`,
            activity: "无",
          };
        });
    },
    handleMeituan(list) {
      return list
        .filter((item) => {
          return !!item.skuItem;
        })
        .map((item) => {
          const { skuItem } = item;
          return {
            image: skuItem.picUrl,
            name: skuItem.skuTitle.text,
            stock: skuItem.soldOutUrl ? 0 : "暂无数据",
            limit: "无",
            detail: `${skuItem.sellPrice.text}${
              skuItem.memberPrice ? "(" + skuItem.memberPrice.text + ")" : ""
            } / ${skuItem.buyStep}${skuItem.buyUnit}`,
            activity: "无",
          };
        });
    },
    filterList() {
      this.filteredList = this.list.filter((item) => {
        if (this.currentStatus === 0) {
          return item;
        }
        if (this.currentStatus === 2) {
          return item.stock === 0;
        } else {
          return item.stock !== 0;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx;
}
.out-of-stock {
  opacity: 0.7;
}
.item {
  font-size: 24rpx;
  margin-bottom: 8rpx;
}
.foot {
  font-size: 24rpx;
}
.current-status {
  font-size: 24rpx;
  padding-left: 10rpx;
  margin-top: 16rpx;
}
.loading,
.empty {
  margin-top: 100rpx;
  text-align: center;
}
.tags {
  display: flex;
  justify-content: space-around;
  margin-top: 24rpx;
}
.tip {
  font-size: 24rpx;
  margin-top: 24rpx;
  padding-left: 10rpx;
}
.error {
  color: #d81e06;
}
</style>
