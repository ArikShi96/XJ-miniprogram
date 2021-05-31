<template>
  <view class="content">
    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">标题</view>
        <input class="uni-input" name="title" placeholder="输入标题" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">密码</view>
        <input class="uni-input" name="password" placeholder="输入密码" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title"
          >是否隐藏部分字符
          <text class="tip">(例如: 密码保存为pas**ord)</text></view
        >
        <switch
          class="switch"
          checked
          name="checked"
          style="transform:translateX(-16rpx) scale(0.7)"
        />
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
import { passwordAdd, passwordList } from "@/util/cloud/password.js";
export default {
  data() {
    return { loading: false };
  },
  methods: {
    async validate({ title, password }) {
      if (!title) {
        return "请输入标题";
      }
      if (!password) {
        return "请输入密码";
      }
      // 查重
      const res = await passwordList({ title });
      if (res.data && res.data.length) {
        return "添加失败,该标题已被使用";
      } else {
        return "";
      }
    },
    async formSubmit(e) {
      const formdata = e.detail.value;
      const { title, password, checked } = formdata;
      const errorMessage = await this.validate({ title, password });
      if (errorMessage) {
        uni.showToast({
          icon: "error",
          title: errorMessage,
          duration: 1000,
        });
        return;
      }
      this.loading = true;
      try {
        await passwordAdd({
          title,
          password: this.hidePassword(checked, password),
        });
        uni.showToast({
          title: "添加成功",
          duration: 1000,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (err) {
        uni.showToast({
          icon: "error",
          title: "添加失败",
          duration: 1000,
        });
      }
      this.loading = false;
    },
    formReset(e) {},
    hidePassword(checked, password) {
      if (checked) {
        return (
          password.substring(0, 2) +
          "***" +
          password.substring(password.length - 2)
        );
      } else {
        return password;
      }
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
  .uni-btn-v {
    .button {
      margin-bottom: 16rpx;
      font-size: 28rpx;
    }
  }
}
</style>
