<template> </template>
<script>
import { login, getUserProfile } from "@/util/cloud/user";
export default {
  async onLoad() {},
  async onShow() {
    const res = await login();
    const user = await getUserProfile();
    getApp().globalData.openid = res.result.openid;
    getApp().globalData.user = user.userInfo;
    uni.redirectTo({ url: "/pages/index/index" });
  },
};
</script>
<style></style>
