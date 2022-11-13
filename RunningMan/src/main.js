import { createApp } from 'vue'
import RunningApp from './RunningApp.vue'
import './assets/main.css'
import Paginate from "vuejs-paginate-next";
import { createRouter, createWebHistory } from 'vue-router';
import RaceImage from './components/RaceImage.vue';
import HomePage from './components/HomePage.vue';
import AllImages from './components/AllImages.vue'; // remember to remove s
import SearchComponent from './components/SearchComponent.vue'; // remember to remove s
const routes = [
    { path: '/raceimage', component: RaceImage, name:'raceimage'},
    { path: '/homepage', component: HomePage, name:'homepage'},
   
  ];

const router = createRouter({
    history: createWebHistory(''),
    routes
  })
const app = createApp(RunningApp).use(Paginate).use(router).mount('#app')


