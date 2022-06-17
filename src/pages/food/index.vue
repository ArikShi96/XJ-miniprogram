<template>
  <view class="content">
    <view class="search">
      <u-search
        placeholder="请输入菜品"
        v-model="keyword"
        @search="fetchList"
        @custom="fetchList"
      ></u-search>
    </view>
    <!-- empty -->
    <view v-if="!list.length" class="empty">
      <u-empty text="没有搜索结果" mode="search"></u-empty>
    </view>
    <!-- list -->
    <view v-else class="food-content">
      <Step
        class="food-steps"
        :list="steps"
        :current="currentStepIndex"
        direction="column"
        mode="number"
        @change="setCurrentStepIndex"
      ></Step>
      <view
        v-if="currentStepIndex === 0 || currentStepIndex === steps.length - 1"
        class="food-step-wrap"
      >
        <u-card
          :title="list[currentIndex].name"
          :thumb="list[currentIndex].pic"
          :thumb-width="100"
        >
          <view class="items" slot="body">
            <view v-for="col in foodSummaryCols" :key="col.key" class="item">
              <text class="label"> {{ col.label }}: </text>
              {{ list[currentIndex][col.key] }}
            </view>
            <view
              class="item item-content"
              v-html="list[currentIndex].content"
            />
          </view>
          <view class="foot" slot="foot">
            <view class="foot-item">
              <text class="label">标签:</text>
              <u-tag
                class="foot-tag"
                v-for="tag in (list[currentIndex].tag || '').split(',')"
                :key="tag"
                :text="tag"
                type="primary"
                size="mini"
              />
            </view>
            <view class="foot-item">
              <text class="label">材料:</text>
              <u-tag
                class="foot-tag"
                v-for="(item, index) in list[currentIndex].material"
                :key="index"
                :text="`${item.mname}${item.amount}`"
                type="info"
                size="mini"
              />
            </view>
          </view>
        </u-card>
      </view>
      <view v-else class="food-step-wrap">
        <view class="food-step-content">
          {{ list[currentIndex].process[currentStepIndex - 1].pcontent }}
        </view>
        <view class="food-step-image">
          <image :src="list[currentIndex].process[currentStepIndex - 1].pic" />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { fetchFoodList } from "@/util/cloud/food";
import Step from "@/components/common/steps.vue";
export default {
  async onShow() {
    this.fetchList();
  },
  components: { Step },
  data() {
    return {
      currentIndex: null,
      currentStepIndex: 0,
      keyword: "",
      foodSummaryCols: [
        { label: "适合人数", key: "peoplenum" },
        { label: "准备时间", key: "preparetime" },
        { label: "烹饪时间", key: "cookingtime" },
      ],
      list: [],
      steps: [],
    };
  },
  watch: {
    currentIndex() {
      if (this.list && this.list.length > 0) {
        this.steps = [
          { name: "准备" },
          ...this.list[this.currentIndex].process.map((process, index) => {
            return { name: `步骤${index + 1}` };
          }),
          { name: "完成" },
        ];
      }
    },
    currentStepIndex() {
      const self = this;
      if (
        this.currentStepIndex === this.steps.length - 1 &&
        this.currentIndex < this.list.length
      ) {
        uni.showModal({
          title: "温馨提示",
          content: "是否要查看下一条数据?",
          success(res) {
            if (res.confirm) {
              self.currentIndex = self.currentIndex + 1;
              self.currentStepIndex = 0;
            } else if (res.cancel) {
              return;
            }
          },
        });
      }
    },
  },
  methods: {
    async fetchList() {
      if (!this.keyword) {
        return;
      }
      uni.showLoading({
        title: "加载中",
      });
      this.list = await fetchFoodList(this.keyword);
      this.currentIndex = 0;
      uni.hideLoading();
    },
    setCurrentStepIndex(val) {
      this.currentStepIndex = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx;
}
.loading,
.empty {
  margin-top: 100rpx;
  text-align: center;
}
.error {
  color: #d81e06;
}

.item {
  font-size: 24rpx;
  margin-bottom: 8rpx;
  .label {
    display: inline-block;
    width: 120rpx;
    margin-right: 8rpx;
  }
  &.item-content {
    text-align: justify;
    margin-top: 16rpx;
  }
}
.foot {
  font-size: 24rpx;
  .foot-item {
    margin-bottom: 16rpx;
  }
  .label {
    display: inline-block;
    margin-right: 8rpx;
  }
  .foot-tag {
    margin-right: 8rpx;
  }
}

.food-content {
  position: relative;
  height: calc(100vh - 94rpx);
  .food-steps {
    position: absolute;
    height: calc(100vh - 74rpx);
    overflow: auto;
  }
  .food-step-wrap {
    padding-left: 20%;
    padding-top: 40rpx;
    max-height: 100%;
    overflow: auto;
  }
  .food-step-content {
    margin-bottom: 32rpx;
  }
  .food-step-image image {
    width: 500rpx;
    height: 360rpx;
  }
}
</style>
