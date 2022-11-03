import { createApp } from 'vue'
import RunningApp from './RunningApp.vue'
import './assets/main.css'
import Paginate from "vuejs-paginate-next";

const app = createApp(RunningApp).use(Paginate).mount('#app')


