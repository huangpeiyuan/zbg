import Vue from 'vue'
import App from './App'



import uView from "uview-ui";
Vue.use(uView);

import { myRequest } from './util/api.js'


Vue.prototype.$myRequest = myRequest
Vue.prototype.zbger_url = "https://zbger.com:8443/zbger"

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
