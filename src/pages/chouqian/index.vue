<template>
  <view class="content">
    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">标题</view>
        <input class="uni-input" name="title" placeholder="请输入标题" />
      </view>
      <view
        v-for="(item, index) in list"
        :key="index"
        class="uni-form-item uni-column"
      >
        <view class="title">
          <text>{{ `内容${index + 1}` }}</text>
          <image
            class="icon remove"
            :src="RemoveIcon"
            @click="clickRemove(index)"
          />
        </view>
        <input
          class="uni-input"
          :name="`content${index}`"
          :placeholder="`请输入内容${index + 1}`"
        />
      </view>
      <image class="icon" :src="AddIcon" @click="clickAdd" />
      <view class="uni-btn-v">
        <button
          class="button"
          type="primary"
          form-type="submit"
          :loading="loading"
        >
          {{ loading ? "生成中" : "生成" }}
        </button>
        <button class="button" type="default" form-type="reset">重置</button>
      </view>
    </form>
  </view>
</template>
<script>
import AddIcon from "@/static/img/icon/add.png";
import RemoveIcon from "@/static/img/icon/remove.png";
export default {
  data() {
    return { AddIcon, RemoveIcon, loading: false, list: [] };
  },
  methods: {
    clickAdd() {
      this.list.push({});
    },
    clickRemove(index) {
      this.list.splice(index, 1);
    },
    async validate({ title, ...content }) {
      if (!title) {
        return "请输入标题";
      }
      if (!Object.keys(content).length) {
        return "请添加内容";
      }
      let errorMessage = "";
      this.list.forEach((item, index) => {
        if (!content[`content${index}`]) {
          errorMessage = `请输入内容${index + 1}`;
        }
      });
      return errorMessage;
    },
    async formSubmit(e) {
      const formdata = e.detail.value;
      const { title, ...content } = formdata;
      const errorMessage = await this.validate({ title, ...content });
      if (errorMessage) {
        uni.showToast({
          icon: "none",
          title: errorMessage,
          duration: 1000,
        });
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.showResult(title, content);
      }, 3000);
    },
    formReset(e) {
      this.list = [];
    },
    showResult(title, content) {
      const length = this.list.length;
      const result = Math.floor(Math.random() * length);
      uni.showModal({
        title: `${title}的抽签结果`,
        content: content[`content${result}`],
        success(res) {},
      });
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
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
    .tip {
      color: $uni-text-color-grey;
    }
  }
  .icon {
    display: block;
    margin: 32rpx auto;
    height: 32rpx;
    width: 32rpx;
    &.remove {
      display: inline-block;
      margin: 0 16rpx;
    }
  }
  .uni-btn-v {
    .button {
      margin-bottom: 16rpx;
      font-size: 28rpx;
    }
  }
}
</style>
