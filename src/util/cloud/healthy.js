import request, { encodeUrlWithParams } from "@/util/request/request.ts";

const HEALTHY_BASE_URL = "http://zhouxunwang.cn/data/";
const APP_KEY = "da39dce4f8aa52155677ed8cd23a6470";

export async function fetchSicknessList(title, id = 111) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${HEALTHY_BASE_URL}`, { id, title, key: APP_KEY })
    );
    return res.result || [];
  } catch (err) {
    return [];
  }
}
