import { createApp } from 'vue'
import RunningApp from './RunningApp.vue'
import './assets/main.css'
import Paginate from "vuejs-paginate-next";
import { createRouter, createWebHistory } from 'vue-router';
import RaceImages from './components/RaceImages.vue';
import HomePage from './components/HomePage.vue';

// params are ignored if path present
// https://stackoverflow.com/questions/40382388/how-to-set-url-query-params-in-vue-with-vue-router
const routes = [
    { path: '/raceimages', component: RaceImages, name:'raceimages'},
    { path: '/', component: HomePage, name:'homepage'}
  ];

const router = createRouter({
    history: createWebHistory(),
    routes
  })
const app = createApp(RunningApp).use(Paginate).use(router).mount('#app')


