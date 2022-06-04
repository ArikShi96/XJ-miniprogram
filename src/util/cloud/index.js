import request from "@/util/request/request.ts";

const JITANG_CONFIG = {
  key: "862bc8b49b255beab1b24f05ae946ccf",
  url: "https://apis.juhe.cn",
};

const HISTORY_CONFIG = {
  key: "ca9104160add5b9a0954e51f53a12054",
  url: "https://v.juhe.cn",
};

const NEWS_CONFIG = {
  key: "72cf1e4b2097c1c8672d194e98f029d0",
  url: "https://v.juhe.cn",
};

export async function fetchTodayJiTang() {
  try {
    const res = await request.get(
      `${JITANG_CONFIG.url}/fapig/soup/query?key=${JITANG_CONFIG.key}`
    );
    return res.result.text || "";
  } catch (err) {
    return "";
  }
}

export async function fetchTodayHistory(date) {
  try {
    const res = await request.get(
      `${HISTORY_CONFIG.url}/todayOnhistory/queryEvent.php?key=${HISTORY_CONFIG.key}&date=${date}`
    );
    return res.result || [];
  } catch (err) {
    return [];
  }
}

export async function fetchTodayNews() {
  try {
    const res = await request.get(
      `${NEWS_CONFIG.url}/toutiao/index?key=${NEWS_CONFIG.key}`
    );
    return res.result.data || [];
  } catch (err) {
    return [];
  }
}
