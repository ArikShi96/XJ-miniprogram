<template>
  <view class="content">
    <u-divider>工具列表</u-divider>
    <view class="list">
      <view
        class="item"
        v-for="item in list"
        :key="item.text"
        @click="navigate(item.url)"
      >
        <image class="logo" :src="item.icon" />
        <text>{{ item.text }}</text>
      </view>
      <image
        v-if="isAdmin"
        class="admin-icon"
        :src="AdminIcon"
        @click="navigateAdmin"
      />
    </view>
    <u-divider>每日鸡汤</u-divider>
    <view class="section text">
      {{ jitang }}
    </view>
    <u-divider>每日热点</u-divider>
    <view class="section">
      <u-card
        v-for="(item, index) in news"
        :key="index"
        :title="item.author_name"
        :sub-title="item.date"
        :thumb="item.thumbnail_pic_s"
        :thumb-width="120"
      >
        <view class="news-body" slot="body">
          <view class="news-body-item">
            <text class="news-body-item__label">内容:</text>{{ item.title }}
          </view>
          <view class="news-body-item">
            <text class="news-body-item__label">链接:</text>
            <text v-clipboard:copy="item.url" @click="toastCopyMessage">
              {{ item.url }}
            </text>
          </view>
        </view>
        <view class="news-footer" slot="footer">
          <view>分类: {{ item.category }}</view>
        </view>
      </u-card>
    </view>
    <u-divider>历史上的今天</u-divider>
    <view class="section">
      <u-card
        v-for="(item, index) in history"
        :key="index"
        :title="`公元${item.date}`"
      >
        <view class="news-body" slot="body">{{ item.title }}</view>
      </u-card>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import {
  fetchTodayJiTang,
  fetchTodayHistory,
  fetchTodayNews,
} from "@/util/cloud/index";
import { getLocalStorage, setLocalStorage, remo } from "@/util/util";
import PasswordIcon from "@/static/img/icon/password.png";
import MemoIcon from "@/static/img/icon/memo.png";
import ChoujiangIcon from "@/static/img/icon/抽奖.png";
import RememberIcon from "@/static/img/icon/纪念日.png";
import WeatherIcon from "@/static/img/icon/weather.png";
import WaitingIcon from "@/static/img/icon/waiting2.png";
import AdminIcon from "@/static/img/icon/admin.png";
import MaiCaiIcon from "@/static/img/icon/买菜.png";
export default {
  async onShow() {
    uni.showLoading({
      title: "加载中",
    });
    // await this.checkSession();
    const homePageData = (await getLocalStorage(this.today)) || {};
    let { history, news, jitang } = homePageData;
    if (!history || !news || !jitang) {
      jitang = await this.fetchHomepageTodayJiTang();
      history = await this.fetchHomepageTodayHistory();
      news = await this.fetchHomepageTodayNews();
      setLocalStorage(this.today, { history, news, jitang });
    }
    this.history = history;
    this.news = news;
    this.jitang = jitang;
    uni.hideLoading();
  },
  onHide() {},
  data() {
    return {
      AdminIcon,
      list: [
        { icon: MaiCaiIcon, text: "买菜比价", url: "/pages/maicai/index" },
        { icon: PasswordIcon, text: "密码管理", url: "/pages/password/index" },
        { icon: MemoIcon, text: "便签", url: "/pages/memo/index" },
        { icon: ChoujiangIcon, text: "抽签", url: "/pages/chouqian/index" },
        { icon: RememberIcon, text: "纪念日", url: "/pages/remember/index" },
        { icon: WeatherIcon, text: "天气", url: "/pages/weather/index" },
        { icon: WaitingIcon, text: "敬请期待" },
        { icon: WaitingIcon, text: "敬请期待" },
      ],
      // 首页数据
      history: [],
      jitang: "",
      news: [],
    };
  },
  computed: {
    isAdmin() {
      return getApp().globalData.openid === "o09pZ5FpRP4eQ3PmSz7DIuak13Dg";
    },
    today() {
      return dayjs(new Date()).format("M/D");
    },
  },
  methods: {
    // 获取登录状态
    checkSession() {
      if (!getApp().globalData.openid) {
        uni.redirectTo({
          url: "/pages/login/index",
        });
      }
    },
    // 跳转
    navigate(url) {
      if (!url) {
        return;
      }
      uni.navigateTo({
        url,
      });
    },
    // 管理员界面
    navigateAdmin() {
      uni.navigateTo({
        url: "/pages/admin/index",
      });
    },
    // 历史上的今天
    async fetchHomepageTodayJiTang() {
      return await fetchTodayJiTang();
    },
    // 每日鸡汤
    async fetchHomepageTodayHistory() {
      return await fetchTodayHistory(this.today);
    },
    // 每日热点
    async fetchHomepageTodayNews() {
      return await fetchTodayNews();
    },
    // 复制到剪切板
    toastCopyMessage() {
      uni.showToast({
        icon: "none",
        title: "链接已复制到剪切板",
        duration: 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20rpx 0;
  .section {
    padding: 24rpx;
    &.text {
      text-align: justify;
      padding: 24rpx 48rpx;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    flex: 0 0 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32rpx 0;
    .logo {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 16prx;
      border-radius: 40rpx;
    }
  }
  .admin-icon {
    position: fixed;
    right: 40rpx;
    bottom: 80rpx;
    width: 80rpx;
    height: 80rpx;
  }
  .news-body {
    font-size: 24rpx;
    .news-body-item {
      margin-bottom: 8rpx;
      word-break: break-all;
    }
    .news-body-item__label {
      margin-right: 8rpx;
    }
  }
  .news-footer {
    font-size: 24rpx;
  }
}
</style>
