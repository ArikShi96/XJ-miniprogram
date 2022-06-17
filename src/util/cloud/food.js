import request, { encodeUrlWithParams } from "@/util/request/request.ts";

const FOOD_BASE_URL = "https://way.jd.com/jisuapi/search";
const APP_KEY = "da39dce4f8aa52155677ed8cd23a6470";

export async function fetchFoodList(keyword, num = 20) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${FOOD_BASE_URL}`, { keyword, num, appkey: APP_KEY })
    );
    return res.result.result.list || [];
  } catch (err) {
    uni.showToast({
      title: err.msg,
      icon: "error",
      duration: 1000,
    });
    return [];
  }
}
