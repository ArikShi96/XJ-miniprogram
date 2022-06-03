import request, { encodeUrlWithParams } from "@/util/request/request.ts";
import { FRESH_BASE_MFSIG_MAP, FRESH_BASE_PARAMS_MAP } from "./mock";

const DINGDONG_BASE_URL = "https://maicai.api.ddxq.mobi";
const DINGDONG_BASE_PARAMS = {
  uid: "5ad6094e134bb238b5c4876f",
  city_number: "0101",
  station_id: "59e5bd12916edf56028f43c3",
  api_version: "9.52.0",
  app_version: "2.87.1",
  // applet_source: "",
  // channel: "applet",
  // app_client_id: "4",
  // sharer_uid: "",
  // s_id: "60h76gu470h7v007374894y7d7y99v0hlgl64369uv1946tkt53l83y442zgwuhu",
  // openid: "osP8I0Zwy1ZdW56oGCnLaGcijduM",
  // h5_source: "",
  time: Date.now(),
  // device_token: "WHJMrwNw1k%2FFBDS1bQmfKg4lKHP1DM0BgcjAA1tLtraHcI20ViM5m5f%2BtwDIYwBO%2FHv%2BD%2BNkpy41hD8WjpfSoDb1Ps6S2u9rLdCW1tldyDzmauSxIJm5Txg%3D%3D1487582755342",
  // tag: "",
  // algo_id: "",
  page: 1,
  sort: 0,
  // guide_id: "",
  // select_activity_id: false,
  count: 30,
  like_size: 30,
  // nars: "157f860cb7fe6616394b2935197869de",
  // sesi: "Os5NaPY9ca3794ea9b1026fb0db10cb96892d26",
};

const FRESH_BASE_URL = "https://as-vip.missfresh.cn";
const FRESH_BASE_PARAMS = {};
const FRESH_BASE_HEADER = {
  mfsig: "",
};

const MEITUAN_BASE_URL = "https://mall.meituan.com";
const MEITUAN_BASE_PARAMS = {
  uuid: "181227cede0c8-9749b1cd4e06d-0-5a900-181227cede0c8",
  xuuid: "181227cede0c8-9749b1cd4e06d-0-5a900-181227cede0c8",
  // __reqTraceID: "03431b92-f687-5e8b-d272-adf865184f12",
  // platform: "android",
  // utm_medium: "wxapp",
  // brand: "xiaoxiangmaicai",
  // tenantId: "1",
  // utm_term: "5.35.0",
  isClosed: false,
  offset: "0",
  limit: "30",
  poiId: "249",
  // quickSearchWord: "false",
  // from: "hot",
  // last: "0",
  // poi: "249",
  // stockPois: "249",
  // ci: "1",
  // bizId: "2",
  // deliveryRegionKey: "6667-6668",
  // openId: "oV_5G41uxAnw_mxzG_1aJTsfI0uw",
  // sysName: "macOS",
  // sysVerion: "12.3.1",
  // app_tag: "union",
  // uci: "1",
  userid: "767938662",
};
const MEITUAN_BASE_HEADER = {
  // openIdCipher: "",
  // req_of_maicai: 1,
  // openId: "",
  // Location: "",
  t:
    "uG-bJ_tkwwdK8SNF2aYACE5LwKkAAAAADhIAAOF5Q51dCnpQIR7P3mueN5F2HoCarLgFQkyNsywkd329tjzkvP3XIRFxtuV4KeQdUw",
};

export async function dingdongSearch(params) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${DINGDONG_BASE_URL}/search/searchProduct`, {
        ...DINGDONG_BASE_PARAMS,
        ...params,
      })
    );
    return res.data.product_list || [];
  } catch (err) {
    return [];
  }
}

export async function freshSearch(params) {
  try {
    const res = await request.post(
      `${FRESH_BASE_URL}/as/item/search/getResult`,
      FRESH_BASE_PARAMS_MAP[params.keyword],
      { mfsig: FRESH_BASE_MFSIG_MAP[params.keyword] }
    );
    return (
      res.data.searchItemList.reduce((prev, item) => {
        return [...prev, ...item.searchList];
      }, []) || []
    );
  } catch (err) {
    return [];
  }
}

export async function meituanSearch(params) {
  try {
    const res = await request.get(
      encodeUrlWithParams(`${MEITUAN_BASE_URL}/api/c/poi/249/sku/search/v2`, {
        ...MEITUAN_BASE_PARAMS,
        keyword: params.keyword,
      }),
      {},
      MEITUAN_BASE_HEADER
    );
    return res.data.skuListAreaVOs || [];
  } catch (err) {
    return [];
  }
}
