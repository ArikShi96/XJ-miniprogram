export function generateUuid() {
  return Date.now() + Math.floor(Math.random() * 100) + ""
}