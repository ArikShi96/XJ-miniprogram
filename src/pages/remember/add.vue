<template>
  <view class="content">
    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">标题</view>
        <input class="uni-input" name="title" placeholder="请输入标题" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">纪念人</view>
        <input class="uni-input" name="people" placeholder="请输入纪念人" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">纪念地点</view>
        <input class="uni-input" name="address" placeholder="请输入纪念地点" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">日期</view>
        <!-- <uni-datetime-picker name="date"></uni-datetime-picker> -->
        <picker mode="date" name="date" :end="endDate" @change="changeDate">
          <text class="picker-label">{{ date || "选择时间" }}</text>
        </picker>
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">是否打开提醒</view>
        <switch
          class="switch"
          checked
          name="notify"
          style="transform:translateX(-16rpx) scale(0.7)"
        />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">提前多少天提醒</view>
        <picker
          mode="selector"
          name="advance"
          :range="range"
          :value="0"
          @change="changeAdvavnce"
        >
          <text class="picker-label">{{
            advance ? `${advance}天` : "选择提前多少天提醒"
          }}</text>
        </picker>
      </view>
      <view class="uni-btn-v">
        <button
          class="button"
          type="primary"
          form-type="submit"
          :loading="loading"
        >
          {{ loading ? "提交中" : "提交" }}
        </button>
        <button class="button" type="default" form-type="reset">重置</button>
      </view>
    </form>
  </view>
</template>
<script>
import { rememberAdd, rememberList } from "@/util/cloud/remember.js";
import { uniDatetimePicker } from "@dcloudio/uni-ui";
import { subscribeMsg } from "@/util/cloud/subcribe.js";
import dayjs from "dayjs";
export default {
  components: { uniDatetimePicker },
  data() {
    return { loading: false, date: "", advance: "", range: [10, 5, 3, 1] };
  },
  computed: {
    endDate() {
      return dayjs(new Date(Date.now() - 24 * 60 * 60 * 1000)).format(
        "YYYY-MM-DD"
      );
    },
  },
  methods: {
    changeDate(event) {
      this.date = event.detail.value;
    },
    changeAdvavnce(event) {
      this.advance = this.range[event.detail.value];
    },
    async validate({ title, date, people, address }) {
      if (!title) {
        return "请输入标题";
      }
      if (!date) {
        return "请选择日期";
      }
      if (!people) {
        return "请输入纪念人";
      }
      if (!address) {
        return "请输入纪念地址";
      }
      // 查重
      const res = await rememberList({ title });
      if (res.data && res.data.length) {
        return "添加失败,该标题已被使用";
      } else {
        return "";
      }
    },
    async formSubmit(e) {
      const formdata = e.detail.value;
      const { title, date, advance, notify, people, address } = formdata;
      const errorMessage = await this.validate({
        title,
        date,
        people,
        address,
      });
      if (errorMessage) {
        uni.showToast({
          icon: "none",
          title: errorMessage,
          duration: 1000,
        });
        return;
      }
      this.loading = true;
      const data = {
        title,
        date,
        people,
        address,
        advance: this.range[advance],
        notify,
      };
      try {
        await rememberAdd(data);
        uni.showToast({
          title: "添加成功",
          duration: 1000,
        });
        this.subscribe(data);
      } catch (err) {
        uni.showToast({
          icon: "none",
          title: "添加失败",
          duration: 1000,
        });
      }
      this.loading = false;
    },
    formReset(e) {},
    async subscribe(data) {
      try {
        if (data.notify) {
          await subscribeMsg({ ...data, remark: data.title });
        }
      } catch (err) {}
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 40rpx;
  .uni-form-item {
    margin-bottom: 32rpx;
  }
  .title {
    margin-bottom: 8rpx;
    .tip {
      color: $uni-text-color-grey;
    }
  }
  .picker-label {
    color: $uni-text-color-grey;
  }
  .uni-btn-v {
    .button {
      margin-bottom: 16rpx;
      font-size: 28rpx;
    }
  }
}
</style>
