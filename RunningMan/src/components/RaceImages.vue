<template>
  <div id="main-container">
    <!-- need this for tests to pass. Actually, we can remove router-view -->
    <router-view></router-view>

    <div id="box-race-info" class="container-fluid">
      <Menu v-if="isOurHost" />
      
      <div class="row raceinfo" id="#race-info" style="margin-top: 25px;">
         <div class="col-md-9">
            <span style="font-weight: bold; color: gray" id="campaign-name">{{raceName}}</span>
         </div> 
         <div class="col-md-3">
              <a href="/" style="color: gray" v-if="isOurHost"> Home Page </a>
         </div>
      </div>
      
      <div class="row" id="#space">
        <hr>
        <hr>
      </div>

      <div class="row" id="#search-box">
        <SearchBox  v-bind="searchingInfo" @search-images="submitSearchCriteria" :allowType="allowType" />
      </div>
      <div class="row" id="#album-box">
        <AlbumBox :key="reloadCount" v-bind="albumInfo"  @loadPage="(pageNumber) => loadPageData(pageNumber)"  />
      </div>
    </div>
  </div>
</template>

<style scoped>
#main-container h3{
    border-bottom: 1px solid #CCC;
    padding-bottom: 10px;
}

/* Responsive layout - makes the two columns stack on top of each other instead of next to each other */
@media (max-width: 380px) {
  .raceinfo{
    font-size:  15px;
  }
}

@media (min-width: 480px) {
  .raceinfo{
    font-size:  23px;
  }
}
@media (min-width: 561px) {
  .raceinfo{
    font-size:  28px;
  }
}

.form-control, .search-form button {
    font-size: 22px;
    height: 50px !important;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 10px;
}
</style>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import {onMounted, reactive, ref} from 'vue'
import {searchData, getGlobalConfig} from '../services/DataService'
import SearchBox from "./SearchBox.vue";
import AlbumBox from "./AlbumBox.vue";
import Menu from "./Menu.vue";

const reloadCount = ref(0); // to make searchbox re-render when needed. This is used as a key for searchbox so when its value is changed, the component is re-rendered
const route = useRoute();
const router = useRouter();
//set up default value for searching box
const raceid = route.params.raceid;
const allowType = ref(1);
const raceName = ref(""); 
const configedHosts = ["timanh.com", "localhost", "127.0.0.1"];
const isOurHost = configedHosts.filter((item) => { 
  return window.location.href.indexOf(item) > 0;
}).length > 0 ;

// initial data from configuration
// startingPage is the first page, value normally is 1
const globalConfig = getGlobalConfig();
const albumInfo = reactive({imageList: [], pageCount: 0, totalImagesFound: 0});

const searchingInfo = initSearchingInfo();
function initSearchingInfo(){
  // currently, only works with bib in home page
  const bibValue = route.query.bib ?? "*"; 
  const searchType = (bibValue === "*") ? 1 : 2 ; //1 = search all, 2 = search bib  
  
  return {
    searchValue: bibValue, 
    searchType: searchType,
    asset: null,
    raceid: raceid,
    pageSize: globalConfig.pageSize,
    pageNumber: globalConfig.startingPage,
    previousFaceIds: null
  }
};

// first phase in the flow. When the component is mounted, then, fetch data
onMounted(async() => {
  // just search by bib now, so don't need to store prefaceIDs now
  await searchData(searchingInfo)
         .then(response => {
              raceName.value = response.data.campaignName;
              albumInfo.imageList = response.data.images;
              albumInfo.pageCount = Math.ceil(response.data.total / globalConfig.pageSize);
              albumInfo.totalImagesFound  = response.data.total;

              // not a good design. SearchBox needs to be instantisated well before albuminfo is retrieved, but keep this here for simplicity
              // perhaps, move this to SearchBox info (the same for bib & asset & other thing) 
              allowType.value = response.data.allowType; 
          }) .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise

          })
          .finally(() => {
            // should add metadata for sharing content here, but fb does not execute so that the code segment has been deleted, see git commit to take code if needed
          });
})

// searchType, searchValue are passed from SearchBox.vue by emit event
async function submitSearchCriteria(searchType, searchValue, file){ 
  searchingInfo.searchValue = searchValue;
  searchingInfo.searchType = searchType;
  searchingInfo.asset = file; // if search type is changed, file is set null in SearchBox, so searchingInfo needed to be updated accrodingly
  
  // this is to re-render albumbox
  reloadCount.value++;
 
  await searchData(searchingInfo)
      .then(response => {
          albumInfo.imageList = response.data.images;
          albumInfo.pageCount = Math.ceil(response.data.total / globalConfig.pageSize);
          albumInfo.totalImagesFound = response.data.total;
          if (searchingInfo.searchType == 3){
            // test to see whether value can be changed in const searchingInfo
             searchingInfo.previousFaceIds = response.data.previousFaceIds; // search by image need this
          }
      })
   .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise

   })
  .finally(() => {
      if (searchingInfo.searchType == 3){// search by image
        return;
      }

      let query = {};
      // need to check searchType == 2 (search by bib), but do later on after integrating with Hai
      if (searchingInfo.searchValue != '*'){
        query.bib = searchValue; 
      };
      
      router.push({
        path: route.fullPath,
        params: route.params,
        query: query
      });
   });
}

// when users click on a page in ImageBox. searchingInfo is still the same
async function loadPageData(pageNumber){
    // searchValue, searchType has been bind to bib and relevant search type
    searchingInfo.pageNumber = pageNumber;
    await searchData(searchingInfo)
          .then(response => {     
              albumInfo.imageList = response.data.images;              
              if (searchingInfo.searchType == 3){
                searchingInfo.previousFaceIds = response.data.previousFaceIds; // search by image need this
              }
          })   
          .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise
           //   console.log(error);
          }).finally( () => {
           // console.log('final');
          })
};
</script>
