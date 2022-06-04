import Vue from 'vue'
import App from './App.vue'
import uView from "uview-ui";
import VueClipboard from "vue-clipboard2";

Vue.use(uView);
Vue.use(VueClipboard);

Vue.config.productionTip = false

new App().$mount()
