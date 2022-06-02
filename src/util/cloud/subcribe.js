// 订阅消息
export function subscribeMsg(tmplId) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: "温馨提示",
      content: "授权后才能正常接收到消息通知",
      success(res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            success(res) {
              if (res[tmplId] == "accept") {
                resolve();
              } else if (res[tmplId] == "reject") {
                uni.showToast({
                  title: "您拒绝了请求,将不能正常收到消息",
                  icon: "none",
                  duration: 2000,
                });
                reject();
              }
            },
            fail(err) {
              uni.showToast({
                title: "未知错误",
                icon: "none",
                duration: 2000,
              });
              reject();
            },
          });
        } else if (res.cancel) {
          //如果用户点击了取消按钮
          uni.showToast({
            title: "您拒绝了请求,不能正常收到消息",
            icon: "none",
            duration: 2000,
          });
          reject();
        }
      },
    });
  });
}
// 云函数-消息推送
export function cloudSendMsg(name, data = {}) {
  return wx.cloud.callFunction({
    name,
    data,
  });
}
