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
    location: {
      // latitude: "", // 纬度，浮点数，范围为-90~90，负数表示南纬
      // longitude: "", // 经度，浮点数，范围为-180~180，负数表示西经
      // accuracy: "", // 位置的精确度
    },
  },
});
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
/*每个页面公共css */
</style>
