<template>
  <view class="content">
    <form @submit="formSubmit" @reset="formReset">
      <view class="uni-form-item uni-column">
        <view class="title">标题</view>
        <input
          class="uni-input"
          name="title"
          placeholder="请输入标题"
          v-model="detail.title"
        />
      </view>
      <view class="uni-form-item uni-column">
        <view class="title">内容</view>
        <textarea
          class="uni-textarea"
          name="content"
          placeholder="请输入内容,最大长度为200个字符"
          :maxlength="200"
          v-model="detail.content"
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
import { memoUpdate, memoList } from "@/util/cloud/memo.js";
import { upload } from "@/util/cloud/upload.js";
import dayjs from "dayjs";
export default {
  onLoad(options) {
    this.uuid = options.id;
    this.fetchDetail();
  },
  data() {
    return { loading: false, imageList: [] };
  },
  methods: {
    async fetchDetail() {
      uni.showLoading({
        title: "加载中",
      });
      const res = await memoList({ uuid: this.uuid });
      this.detail = res.data[0] || {};
      this.imageList = this.detail.images.split(",");
      uni.hideLoading();
    },
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
          icon: "none",
          title: errorMessage,
          duration: 1000,
        });
        return;
      }
      this.loading = true;
      try {
        await memoUpdate(this.uuid, {
          title,
          content,
          updatedAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          images: this.imageList.join(","),
        });
        uni.showToast({
          title: "更新成功",
          duration: 1000,
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (err) {
        uni.showToast({
          icon: "none",
          title: "更新失败",
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
