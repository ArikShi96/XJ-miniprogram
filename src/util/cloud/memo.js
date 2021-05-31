export function memoList(query) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("memos")
    .where(query || {})
    .get();
}

export function memoAdd(data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db.collection("memos").add({
    data,
  });
}

export function memoUpdate(uuid, data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("memos")
    .where({ uuid })
    .update({
      data,
    });
}

export function memoRemove(uuid) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("memos")
    .where({ uuid })
    .remove();
}
