<template>
  <view class="content">
    <u-tabs
      :list="tabs"
      :is-scroll="false"
      :current="currentTab"
      @change="onTabChange"
    ></u-tabs>
    <!-- 国内疫情 -->
    <view v-if="currentTab === TABS_CONSTRAINTS.GUONEI">
      <!-- yiqing list -->
      <view v-if="chinaDetail">
        <u-divider>昨日疫情</u-divider>
        <u-card :show-head="false">
          <view class="items" slot="body">
            <view v-for="col in chinaSummaryCols" :key="col.key" class="item">
              <text class="label">{{ col.label }}</text>
              {{ chinaDetail.diseaseh5Shelf.chinaAdd[col.key] }}
            </view>
          </view>
          <view class="foot" slot="foot">
            <view>
              <text class="label">省份数量: </text>
              {{ chinaCities.length }}
            </view>
          </view>
        </u-card>
        <u-divider>地区详情</u-divider>
        <u-select
          v-model="showChinaCitySelect"
          :list="chinaCities"
          @confirm="confirmChinaCitySelect"
          @cancel="showChinaCitySelect = false"
        ></u-select>
        <view class="city-select-item" @click="showChinaCitySelect = true">
          当前城市: {{ currentChinaCity || "点击选择城市" }}
        </view>
        <u-card
          v-for="(city, index) in filteredChinaDetailList"
          :key="index"
          :show-head="false"
        >
          <view class="items" slot="body">
            <view v-for="col in chinaDetailCols" :key="col.key" class="item">
              <text class="label">{{ col.label }}</text>
              {{ city[col.key] }}
            </view>
          </view>
        </u-card>
        <view v-if="!filteredChinaDetailList.length" class="empty">
          <u-empty text="没有搜索结果" mode="search"></u-empty>
        </view>
      </view>
      <!-- yiqing empty list -->
      <view v-else class="empty">
        <u-empty text="没有搜索结果" mode="search"></u-empty>
      </view>
    </view>
    <!-- 国际疫情 -->
    <view v-if="currentTab === TABS_CONSTRAINTS.GUOJI">
      <!-- search -->
      <view class="search">
        <u-search
          placeholder="请输入国家或地区"
          :show-action="false"
          :value="keyword"
          @change="handleKeywordChange"
        ></u-search>
        <view v-if="cityList.length > 0 && showAutoSearch" class="search-auto-list">
          <view v-for="(city, index) in cityList" :key="index" class="search-auto-item">
            <view class="search-auto-name" @click="searchDetail(city)">
              {{ city }}
            </view>
          </view>
        </view>
      </view>
      <!-- yiqing list -->
      <view v-if="yiqingDetail">
        <u-divider>疫情总览</u-divider>
        <u-card :show-head="false">
          <view class="items" slot="body">
            <!-- 国家/城市 -->
            <view class="item">
              <text class="label">国家/城市:</text>
              {{ yiqingDetail.provinceName }}
            </view>
            <!-- 现有确诊 -->
            <view class="item">
              <text class="label">现有确诊:</text>
              {{ yiqingDetail.currentConfirmedCount }}
            </view>
            <!-- 累计确诊 -->
            <view class="item">
              <text class="label">累计确诊:</text>
              {{ yiqingDetail.confirmedCount }}
            </view>
            <!-- 疑似病例 -->
            <view class="item">
              <text class="label">疑似病例:</text>
              {{ yiqingDetail.suspectedCount }}
            </view>
            <!-- 累计治愈 -->
            <view class="item">
              <text class="label">累计治愈:</text>
              {{ yiqingDetail.curedCount }}
            </view>
            <!-- 累计死亡 -->
            <view class="item">
              <text class="label">累计死亡:</text>
              {{ yiqingDetail.deadCount }}
            </view>
          </view>
          <view class="foot" slot="foot">
            <view>
              <text class="label">更新时间:</text>
              {{ formatTime(new Date(yiqingDetail.updateTime)) }}
            </view>
            <!-- <view>
              <text class="label"> 备注:</text>
              {{ yiqingDetail.comment }}
            </view> -->
          </view>
        </u-card>
        <u-divider>地区详情</u-divider>
        <u-card
          v-for="(city, index) in yiqingDetail.cities"
          :key="index"
          :show-head="false"
        >
          <view class="items" slot="body">
            <!-- 城市/区域: -->
            <view class="item">
              <text class="label">城市/区域:</text>
              {{ city.cityName }}
            </view>
            <!-- 现有确诊 -->
            <view class="item">
              <text class="label">现有确诊:</text>
              {{ city.currentConfirmedCount }}
            </view>
            <!-- 累计确诊 -->
            <view class="item">
              <text class="label">累计确诊:</text>
              {{ city.confirmedCount }}
            </view>
            <!-- 疑似病例 -->
            <view class="item">
              <text class="label">疑似病例:</text>
              {{ city.suspectedCount }}
            </view>
            <!-- 累计治愈 -->
            <view class="item">
              <text class="label">累计治愈:</text>
              {{ city.curedCount }}
            </view>
            <!-- 累计死亡 -->
            <view class="item">
              <text class="label">累计死亡:</text>
              {{ city.deadCount }}
            </view>
            <!-- 高风险地区 -->
            <view class="item">
              <text class="label">高风险地区:</text>
              {{ city.highDangerCount }}
            </view>
            <!-- 中风险地区 -->
            <view class="item">
              <text class="label">中风险地区:</text>
              {{ city.midDangerCount }}
            </view>
          </view>
        </u-card>
        <view v-if="!yiqingDetail.cities.length" class="empty">
          <u-empty text="没有搜索结果" mode="search"></u-empty>
        </view>
      </view>
      <!-- yiqing empty list -->
      <view v-else class="empty">
        <u-empty text="没有搜索结果" mode="search"></u-empty>
      </view>
    </view>
    <!-- 防疫政策 -->
    <view v-if="currentTab === TABS_CONSTRAINTS.POLICY">
      <u-select
        v-model="showCitySelect"
        mode="mutil-column-auto"
        :list="citySelectList"
        @confirm="confirmCitySelect"
        @cancel="cancelCitySelect"
      ></u-select>
      <view
        class="city-select-item"
        @click="
          showFromCitySelect = true;
          showCitySelect = true;
        "
      >
        出发城市: {{ fromCityLabel }}
      </view>
      <view
        class="city-select-item"
        @click="
          showToCitySelect = true;
          showCitySelect = true;
        "
      >
        到达城市: {{ toCityLabel }}
      </view>
      <view v-if="policyDetail">
        <u-divider>出发城市: {{ fromCityLabel }}</u-divider>
        <u-card
          :title="policyDetail.from_info.health_code_name"
          :sub-title="policyDetail.from_info.health_code_desc"
          :thumb="policyDetail.from_info.health_code_picture"
          :thumb-width="120"
        >
          <view class="items" slot="body">
            <view class="item item-content">
              {{ policyDetail.from_info.low_in_desc }}
            </view>
            <view class="item item-content">
              {{ policyDetail.from_info.out_desc }}
            </view>
          </view>
          <view class="foot" slot="foot">
            <view>
              <text class="label width-100">风险等级: </text>
              {{
                ["", "低风险", "中风险", "高风险"][
                  Number(policyDetail.from_info.risk_level)
                ]
              }}
            </view>
          </view>
        </u-card>
        <u-divider>到达城市: {{ toCityLabel }}</u-divider>
        <u-card
          :title="policyDetail.to_info.health_code_name"
          :sub-title="policyDetail.to_info.health_code_desc"
          :thumb="policyDetail.to_info.health_code_picture"
          :thumb-width="120"
        >
          <view class="items" slot="body">
            <view class="item item-content">
              {{ policyDetail.to_info.low_in_desc }}
            </view>
            <view class="item item-content">
              {{ policyDetail.to_info.out_desc }}
            </view>
          </view>
          <view class="foot" slot="foot">
            <view>
              <text class="label width-100">风险等级: </text>
              {{
                ["", "低风险", "中风险", "高风险"][
                  Number(policyDetail.to_info.risk_level)
                ]
              }}
            </view>
          </view>
        </u-card>
      </view>
      <view v-else class="empty">
        <u-empty text="没有搜索结果" mode="search"></u-empty>
      </view>
    </view>
    <!-- 疫情新闻 -->
    <!-- 疫情谣言 -->
    <view
      v-if="
        currentTab === TABS_CONSTRAINTS.NEWS || currentTab === TABS_CONSTRAINTS.RUMORS
      "
    >
      <view v-if="news.list.length">
        <u-card v-for="(item, index) in news.list" :key="index" :title="item.title">
          <view class="items" slot="body">
            <!-- 内容 -->
            <view class="item item-content">
              {{ currentTab === TABS_CONSTRAINTS.NEWS ? item.summary : item.body }}
            </view>
            <view v-if="currentTab === TABS_CONSTRAINTS.NEWS" class="item item-link">
              {{ item.sourceUrl }}
            </view>
          </view>
          <view class="foot" slot="foot">
            <view v-if="currentTab === TABS_CONSTRAINTS.NEWS">
              <text class="label width-100">消息来源: </text>
              {{ item.infoSource }}
            </view>
            <view v-if="currentTab === TABS_CONSTRAINTS.NEWS">
              <text class="label width-100">消息时间: </text>
              {{ formatTime(new Date(Number(item.pubDate))) }}
            </view>
            <view v-if="currentTab === TABS_CONSTRAINTS.RUMORS">
              <text class="label width-100">消息辟谣: </text>
              {{ item.mainSummary }}
            </view>
          </view>
        </u-card>
      </view>
      <view v-else class="empty">
        <u-empty text="没有搜索结果" mode="search"></u-empty>
      </view>
    </view>
  </view>
</template>
<script>
import {
  fetchChinaDetail,
  fetchCityList,
  fetchYiqingDetail,
  fetchNews,
  fetchRumors,
  fetchPolicy,
} from "@/util/cloud/yiqing";
import { FANGYI_CITY_LIST } from "@/util/cloud/mock.js";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/util/util";
import dayjs from "dayjs";
export default {
  async onShow() {
    this.fetchChinaDetailYiqing();
    this.allCityList = await fetchCityList();
  },
  data() {
    return {
      // tab
      currentTab: 0,
      tabs: [
        { name: "国内疫情" },
        { name: "国际疫情" },
        { name: "防疫政策" },
        { name: "疫情新闻" },
        { name: "疫情谣言" },
      ],
      TABS_CONSTRAINTS: {
        GUONEI: 0,
        GUOJI: 1,
        POLICY: 2,
        NEWS: 3,
        RUMORS: 4,
      },
      // 国内疫情
      showChinaCitySelect: false,
      currentChinaCity: "",
      chinaCities: [],
      chinaDetail: null,
      chinaDetailList: [],
      filteredChinaDetailList: [],
      chinaSummaryCols: [
        { key: "nowSevere", label: "新增危重" },
        { key: "noInfect", label: "新增无症状" },
        { key: "localConfirmH5", label: "新增本土" },
        { key: "confirm", label: "新增确诊" },
        { key: "heal", label: "新增治愈" },
        // { key: "nowConfirm", label: "" },
        { key: "suspect", label: "新增疑似" },
        { key: "dead", label: "新增死亡" },
        { key: "importedCase", label: "新增境外" },
        // { key: "localConfirm", label: "本土确诊" },
        // { key: "noInfectH5", label: "" },
      ],
      chinaDetailCols: [
        { key: "city", label: "区域" },
        { key: "confirmAdd", label: "新增确诊" },
        { key: "nowConfirm", label: "现有确诊" },
        { key: "confirm", label: "累计确诊" },
        { key: "heal", label: "新增治愈" },
        { key: "dead", label: "新增死亡" },
      ],
      // 国际疫情
      keyword: "",
      cityList: [],
      allCityList: [],
      yiqingDetail: null,
      showAutoSearch: false,
      // 防疫政策
      citySelectList: FANGYI_CITY_LIST,
      showFromCitySelect: false,
      showToCitySelect: false,
      showCitySelect: false,
      from: "",
      to: "",
      fromCityLabel: "点击选择出发城市",
      toCityLabel: "点击选择到达城市",
      policyDetail: null,
      // 疫情新闻
      // 疫情谣言
      news: {
        page: 1,
        num: 10,
        list: [],
      },
    };
  },
  computed: {
    fromToProps() {
      return [this.from, this.to];
    },
    today() {
      return dayjs(new Date()).format("M/D");
    },
  },
  watch: {
    currentTab() {
      this.news = {
        page: 1,
        num: 10,
        list: [],
      };
      if (
        [this.TABS_CONSTRAINTS.NEWS, this.TABS_CONSTRAINTS.RUMORS].includes(
          this.currentTab
        )
      ) {
        this.fetchNewsList();
      }
    },
    fromToProps() {
      this.fetchPolicyDetail();
    },
  },
  methods: {
    onTabChange(index) {
      this.currentTab = index;
    },
    formatTime(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 国内疫情
    async fetchChinaDetailYiqing() {
      uni.showLoading({
        title: "加载中",
      });
      this.chinaDetail = await fetchChinaDetail();
      if (this.chinaDetail) {
        const chinaCities = Array.from(
          new Set(this.chinaDetail.statisGradeCityDetail.map((city) => city.province))
        );
        this.chinaCities = chinaCities.map((city) => {
          return { label: city, value: city };
        });
        this.filteredChinaDetailList = this.chinaDetail.statisGradeCityDetail;
        this.chinaDetailList = this.chinaDetail.statisGradeCityDetail;
      }
      uni.hideLoading();
    },
    confirmChinaCitySelect(value) {
      this.currentChinaCity = value[0].value;
      if (this.currentChinaCity) {
        this.filteredChinaDetailList = this.chinaDetailList.filter(
          (city) => city.province === this.currentChinaCity
        );
      } else {
        this.filteredChinaDetailList = this.chinaDetailList;
      }
    },
    // 国际疫情
    async handleKeywordChange(value) {
      this.keyword = value;
      this.showAutoSearch = true;
      if (this.keyword.length) {
        if (!this.allCityList.length) {
          this.allCityList = await fetchCityList();
        }
        this.cityList = this.allCityList.filter((city) => city.includes(this.keyword));
      } else {
        this.cityList = [];
      }
    },
    async searchDetail(city) {
      this.cityList = [];
      this.keyword = city;
      setTimeout(() => {
        this.showAutoSearch = false;
      }, 0);
      uni.showLoading({
        title: "加载中",
      });
      this.yiqingDetail = await fetchYiqingDetail(city);
      uni.hideLoading();
    },
    // 防疫政策
    cancelCitySelect() {
      this.showCitySelect = false;
      this.showFromCitySelect = false;
      this.showToCitySelect = false;
    },
    confirmCitySelect(value) {
      // 选择出发城市
      if (this.showFromCitySelect) {
        this.from = value[1].value;
        this.fromCityLabel = `${value[0].label} - ${value[1].label}`;
      }
      // 选择到达城市
      if (this.showToCitySelect) {
        this.to = value[1].value;
        this.toCityLabel = `${value[0].label} - ${value[1].label}`;
      }
      this.showCitySelect = false;
      this.showFromCitySelect = false;
      this.showToCitySelect = false;
    },
    async fetchPolicyDetail() {
      if (this.from && this.to && this.from !== this.to) {
        uni.showLoading({
          title: "加载中",
        });
        const cacheKey = `${this.today}-${this.from}-${this.to}`;
        let policyDetail = await getLocalStorage(cacheKey);
        let cache;
        if (!policyDetail) {
          [policyDetail, cache] = await fetchPolicy(this.from, this.to);
          if (policyDetail && cache) {
            await setLocalStorage(cacheKey, policyDetail);
          }
        }
        this.policyDetail = policyDetail;
        uni.hideLoading();
      } else {
        //
      }
    },
    // 疫情新闻
    // 疫情谣言
    async fetchNewsList() {
      uni.showLoading({
        title: "加载中",
      });
      const { page, num } = this.news;
      const list =
        this.currentTab === this.TABS_CONSTRAINTS.NEWS
          ? await fetchNews(page, num)
          : await fetchRumors(page, num);
      this.news = { ...this.news, list };
      uni.hideLoading();
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx;
}

.search {
  margin-bottom: 16rpx;
  .search-auto-list {
    background-color: #f2f2f2;
    position: absolute;
    top: 145rpx;
    width: 94.6vw;
    left: 21rpx;
    padding: 16rpx 0;
    z-index: 10;
    .search-auto-item {
      padding: 0 60rpx;
    }

    .search-auto-name {
      border-top: 1px solid #cccccc;
      padding: 16rpx 0;
    }
  }
}

.item {
  font-size: 24rpx;
  margin-bottom: 8rpx;
  .label {
    display: inline-block;
    width: 140rpx;
    margin-right: 8rpx;
  }
  &.item-content {
    text-align: justify;
  }
  &.item-link {
    word-break: break-all;
  }
}

.foot {
  font-size: 24rpx;
  .label {
    display: inline-block;
    width: 140rpx;
    margin-right: 8rpx;
    &.width-100 {
      width: 110rpx;
    }
  }
}
.loading,
.empty {
  margin-top: 100rpx;
  text-align: center;
}
.error {
  color: #d81e06;
}

.city-select-item {
  margin: 16rpx 0;
  padding-left: 32rpx;
}
</style>
