export function upload(filePath, name) {
  wx.cloud.init();
  return wx.cloud.uploadFile({
    cloudPath: `image-${name}-${Date.now()}.png`,
    filePath,
  });
}
