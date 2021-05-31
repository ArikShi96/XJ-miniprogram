<template>
  <view class="content">
    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">标题</view>
        <input class="uni-input" name="title" placeholder="请输入标题" />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">内容</view>
        <textarea
          class="uni-textarea"
          name="content"
          placeholder="请输入内容,最大长度为200个字符"
          :maxlength="200"
        />
      </view>
      <view class="uni-form-item uni-column">
        <button class="upload-button" @click="upload">
          上传图片
        </button>
        <view class="image-list">
          <image
            v-for="image in imageList"
            :key="image"
            class="preview-image"
            :src="image"
            mode="aspectFill"
          />
        </view>
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
      </view>
    </form>
  </view>
</template>
<script>
import { memoAdd } from "@/util/cloud/memo.js";
import { upload } from "@/util/cloud/upload.js";
import dayjs from "dayjs";
import { generateUuid } from "@/util/util.js";
export default {
  data() {
    return { loading: false, imageList: [] };
  },
  methods: {
    upload() {
      const self = this;
      wx.chooseImage({
        success: async function(res) {
          const response = await upload(res.tempFilePaths[0]);
          self.imageList.push(response.fileID);
        },
      });
    },
    async validate({ title, content }) {
      if (!title) {
        return "请输入标题";
      }
      if (!content) {
        return "请输入内容";
      }
      return "";
    },
    async formSubmit(e) {
      const formdata = e.detail.value;
      const { title, content } = formdata;
      const errorMessage = await this.validate({ title, content });
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
        await memoAdd({
          uuid: generateUuid(),
          title,
          content,
          createdAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          images: this.imageList.join(","),
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
    margin-bottom: 16rpx;
  }
  .uni-textarea {
    width: 100%;
  }
  .upload-button {
    width: 200rpx;
    margin: 0;
    font-size: 28rpx;
    margin-bottom: 16rpx;
  }
  .image-list {
    display: flex;
    flex-wrap: wrap;
    .preview-image {
      flex: 0 0 30%;
      margin-right: 3%;
      height: 200rpx;
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
