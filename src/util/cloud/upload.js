export function upload(filePath) {
  wx.cloud.init();
  return wx.cloud.uploadFile({
    cloudPath: `image-${Date.now()}.png`,
    filePath
  })
}