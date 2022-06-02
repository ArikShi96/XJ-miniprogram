import request from "@/util/request/request.ts";

const BASIC_CITY_URL = "https://geoapi.qweather.com/v2";
const BASIC_WEATHER_URL = "https://devapi.qweather.com/v7";
const KEY = "9a1f7d36aa2640c7a285dab43cd5d3f6";

export async function cityList(location) {
  if (!location) {
    return [];
  }
  try {
    const res = await request.get(
      `${BASIC_CITY_URL}/city/lookup?key=${KEY}&location=${location}&range=cn`
    );
    return res.location || [];
  } catch (err) {
    return [];
  }
}

export async function realtimeWeather(locationId) {
  if (!locationId) {
    return {};
  }
  try {
    const res = await request.get(
      `${BASIC_WEATHER_URL}/weather/now?key=${KEY}&location=${locationId}`
    );
    return res.now || {};
  } catch (err) {
    return {};
  }
}

export async function threeDaysWeather(locationId) {
  if (!locationId) {
    return {};
  }
  try {
    const res = await request.get(
      `${BASIC_WEATHER_URL}/weather/3d?key=${KEY}&location=${locationId}`
    );
    return res.daily || [];
  } catch (err) {
    return {};
  }
}
//
export function weatherList(query) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("weathers")
    .where(query || {})
    .get();
}

export function weatherAdd(data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db.collection("weathers").add({
    data,
  });
}

export function weatherUpdate(uuid, data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("weathers")
    .where({ uuid })
    .update({
      data,
    });
}

export function weatherRemove(uuid) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("weathers")
    .where({ uuid })
    .remove();
}
