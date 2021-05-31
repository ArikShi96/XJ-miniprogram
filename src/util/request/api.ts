const MODE = process.env.NODE_ENV
const PRODUCTION_PREFIX = "";
const DEVELOPMENT_PREFIX = ""; //填写服务器地址
const PREFIX = MODE === "production" ? PRODUCTION_PREFIX : DEVELOPMENT_PREFIX;

export default {
  MODE,
};
