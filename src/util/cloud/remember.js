export function rememberList(query) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("remembers")
    .where(query || {})
    .get();
}

export function rememberAdd(data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db.collection("remembers").add({
    data,
  });
}

export function rememberRemove(title) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("remembers")
    .where({ title })
    .remove();
}
