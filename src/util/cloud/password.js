export function passwordList(query) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("passwords")
    .where(query || {})
    .get();
}

export function passwordAdd(data) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db.collection("passwords").add({
    data,
  });
}

export function passwordRemove(title) {
  wx.cloud.init();
  const db = wx.cloud.database();
  return db
    .collection("passwords")
    .where({ title })
    .remove();
}
