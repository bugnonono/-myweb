import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import qs from "qs";
import store from "./store";
import ElementUI, { MessageBox } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/reset.css";
import axios from "axios";

Vue.use(ElementUI);

axios.defaults.baseURL = "http://121.89.192.46:7777/api/v1/";
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    // 最后必须返回
    return config;
});

Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");