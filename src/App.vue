<script>
import Vue from "vue";
export default Vue.extend({
  mpType: "app",
  onLaunch() {},
  onShow() {},
  onHide() {},
  onError() {},
  globalData: {
    code: "", // 换openid
    openid: "",
    user: "",
  },
});
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";

/*每个页面公共css */
</style>
