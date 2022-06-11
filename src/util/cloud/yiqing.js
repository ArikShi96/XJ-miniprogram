import request, { encodeUrlWithParams } from "@/util/request/request.ts";
import { MOCK_POLICY_DATA } from "./mock";

const QQ_BASE_URL = "https://api.inews.qq.com";

const DING_XIANG_BASE_URL = "https://lab.isaaclin.cn/nCoV/api";

const JUHE_BASE_URL = "https://apis.juhe.cn";
const JUHE_FREE_KEY = "f356614cb42ac6a903a914c95bb834ef";

export async function fetchChinaDetail() {
  try {
    const res = await request.get(
      `${QQ_BASE_URL}/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf`
    );
    return res.data || null;
  } catch (err) {
    return null;
  }
}

export async function fetchCityList() {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${DING_XIANG_BASE_URL}/provinceName`, {})
    );
    return res.results || [];
  } catch (err) {
    return [];
  }
}

export async function fetchYiqingDetail(province) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${DING_XIANG_BASE_URL}/area`, { province })
    );
    return res.results[0] || null;
  } catch (err) {
    return null;
  }
}

export async function fetchNews(page = 1, num = 10) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${DING_XIANG_BASE_URL}/news`, { page, num })
    );
    return res.results || [];
  } catch (err) {
    return [];
  }
}

export async function fetchRumors(page = 1, num = 10) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${DING_XIANG_BASE_URL}/rumors`, { page, num })
    );
    return res.results || [];
  } catch (err) {
    return [];
  }
}

export async function fetchPolicy(from, to) {
  try {
    let cache = true;
    let res = await request.get(
      encodeUrlWithParams(`${JUHE_BASE_URL}/springTravel/query`, {
        key: JUHE_FREE_KEY,
        from,
        to,
      })
    );
    if (res.resultcode === "112") {
      res = MOCK_POLICY_DATA;
      cache = false;
    }
    return [res.result || null, cache];
  } catch (err) {
    return [null, false];
  }
}
