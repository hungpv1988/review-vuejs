import { createApp } from 'vue'
import RunningApp from './RunningApp.vue'
import './assets/main.css'
import Paginate from "vuejs-paginate-next";
import { createRouter, createWebHistory } from 'vue-router';
import RaceImages from './components/RaceImages.vue';
import HomePage from './components/HomePage.vue';
import {JSZip} from 'jszip';
import veProgress from "vue-ellipse-progress";
import { useRoute, useRouter } from 'vue-router';
import { race } from 'cypress/types/bluebird';

const scripts = document.getElementsByTagName('script');
let raceid = 0;
for(var i=0;i < scripts.length;i++){
    if (scripts[i].getAttribute('raceId') != null){
        raceid = parseInt(scripts[i].getAttribute('raceId'));
        break;
    }
}


// params are ignored if path present
// https://stackoverflow.com/questions/40382388/how-to-set-url-query-params-in-vue-with-vue-router
const routes = [
 //   { path: '/', component: HomePage, name:'homepage'},
    { path: '/races/:raceid/:racealias', component: RaceImages, name:'racedetails'}
    
  ];
debugger;
const router = createRouter({
    history: createWebHistory(),
    routes
});

if (raceid != 0){
  // test test test
    const currentPath = window.location.pathname;
    //let query = {};
    query.raceid = raceid;
    router.addRoute({ name:'embeded', path: currentPath ?? '/', component: RaceImagesY });
    router.push({name: 'embeded', query:{raceid: raceid}});
   router.push({path: currentPath ?? '/', query:{raceid: raceid}});
}
else{
  router.addRoute({ path: '/', component: HomePage, name:'homepage'});
  router.addRoute({ path: '/races/:raceid/:racealias', component: RaceImages, name:'racedetails'});
}

const app = createApp(RunningApp).use(Paginate)
                                 .use(veProgress)
                                 .use(router)
                               //  .use(JSZip)
                                 .mount('#app')


