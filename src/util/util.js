export function generateUuid() {
  return Date.now() + Math.floor(Math.random() * 100) + "";
}

export async function getLocalStorage(key) {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key,
      success(res) {
        resolve(JSON.parse(res.data));
      },
      fail(err) {
        resolve(null);
      },
    });
  });
}

export async function setLocalStorage(key, data, skipError = true) {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key,
      data: JSON.stringify(data),
      success() {
        resolve();
      },
      fail(err) {
        skipError ? resolve() : reject(err);
      },
    });
  });
}

export async function removeLocalStorage(key, skipError = true) {
  return new Promise((resolve, reject) => {
    uni.removeStorage({
      key,
      success() {
        resolve();
      },
      fail(err) {
        skipError ? resolve() : reject(err);
      },
    });
  });
}
