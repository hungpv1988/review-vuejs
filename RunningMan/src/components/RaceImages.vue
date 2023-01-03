<template>
  <div id="main-container">
    <!-- need this for tests to pass. Actually, we can remove router-view -->
    <router-view></router-view>
    <div class="container-fluid">
      <div class="row">
         <div class="col-sm-9">
            <span style="font-weight: bold; font-size: 32px; color: gray" id="campaign-name">{{raceName}}</span>
         </div> 
         <div class="col-sm-3">
              <a href="/" style="font-size: 32px; color: gray"> Home Page </a>
         </div>
      </div>
    </div>
    <hr>
    <div class="container-fluid">
       <div class="row">
          <div class="col-sm-5">
            <div class="row">
                <div class="col-sm-4">
                    <select class="form-control" id="search-type" v-model="searchType" @change="onSearchTypeChange">
                      <option value="1">Tất cả ảnh</option>
                      <option value="2">Ảnh theo bib</option>
                    </select>
                   
                </div>
                <div class="col-sm-8">  <input class="form-control" id="txtBib" :disabled="searchType == 1" type="text" v-model="searchValue"   /></div>
            </div>   
          </div>
          <div class="col-sm-2">
              <button class="form-control" id="btnSearch" @click="searchImages">Tìm ảnh</button>
          </div>
       </div>
    </div>
   

      <div id="main-box">
            <div class="row" style="margin-top: 20px;"> 
                    <div class="col-md-9" style="margin-bottom: 1rem" id="statistic-box"> Có <strong>{{totalImagesFound}}</strong> ảnh được tìm thấy {{yourName}} </div>
        
                    <div class="col-md-3" id="paging-box">
                            <!-- page-count must be bound to  either state.total or a computed total. Cannot work with  constant and perhaps, let (but may be, use in wrong way) -->
                    <paginate
                            v-model="selectedPage"
                            :page-count="state.pageCount"
                            :click-handler="Paging"
                            :prev-text="'Prev'"
                            :next-text="'Next'"
                            :page-class="'page-item'"
                            >
                            </paginate>
                    </div> 
            </div>
  
            <div class="row" style="align-items:center;" id="image-box">
                <TransitionGroup name="list">
                    <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in itemsToBeDisplayed" :key="item.id">
                        <a data-fancybox="imggroup" v-bind:href="item.imageWithLogoUrl" :data-download-src="item.imageWithLogoUrl"> 
                            <img v-bind:src="item.thumbnail" class="img-fluid img-thumbnail">
                        </a>
                    </div>
                </TransitionGroup>
            </div>
        </div>
  </div>
</template>

<style scoped>
#main-container h3{
    border-bottom: 1px solid #CCC;
    padding-bottom: 10px;
}

/* Responsive layout - makes a two column-layout instead of four columns */
@media (max-width: 800px) {
  .column {
    flex: 50%;
    max-width: 50%;
  }
}

/* Responsive layout - makes the two columns stack on top of each other instead of next to each other */
@media (max-width: 600px) {
  .column {
    flex: 100%;
    max-width: 100%;
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
import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox.js";
import { useRoute, useRouter } from 'vue-router';
import {computed, onMounted, reactive, ref} from 'vue'
import {getData, getGlobalConfig} from '../services/DataService'
import Paginate from "vuejs-paginate-next";
const attrName = 'data-download-src';
const objectOfAttrs = {
  "href": 'container',
  class: 'wrapper'
}
const route = useRoute();
const router = useRouter();
//set up default value for searching box
var raceid = route.params.raceid;
const searchType = ref(0); // default value of int should be zero, would be setup in the next following lines
const searchValue = ref("*"); // don't set as null. Value cannot be updated. If primitive type: string, int, let's set a default value.
if (!route.query.bib){
  searchType.value = 1;
  searchValue.value = "*";
}
else{
   searchType.value = 2;
  searchValue.value = route.query.bib;
}
if (searchType.value == 1){
  searchValue.value = "*";
}
else if (searchType.value == 2) {
   searchValue.value = route.query.bib;
}

// need to setup selected of of pagination when clients change criteria. After that, no need to set up its value each time user
// click on a new page as pagination has done it
const selectedPage = ref(1);

// setup msg
const raceName = ref(""); 
const totalImagesFound = ref("");
const yourName = ref("");

// setup fancy box
Fancybox.bind('[data-fancybox="imggroup"]', {
  Toolbar: {
    display: [
      { id: "prev", position: "center" },
      { id: "counter", position: "center" },
      { id: "next", position: "center" },
      "zoom",
      "download",
      "slideshow",
      "fullscreen",
      "thumbs",
      "close",
    ],
  },
});

// initial data from configuration
// startingPage is the first page, value normally is 1
const {startingPage, pageSize, baseUrl} = getGlobalConfig();

// store items returned from service and pagecount used by pagination to calculate the number of page
const state = reactive({items: [], pageCount: 0});

// currentPage change, then itemsToBeDisplayed should be changed accordingly. So it should be ref
let currentPage = ref(startingPage); 

// compose endpoints to fetch api. If extend in the future, then, just change code here, and for testing purpose
function getEndpoint(baseurl, raceid, searchType, searchValue){
  var apiEndpoint =  baseurl;
  apiEndpoint = apiEndpoint + "?campaignId="+raceid;
  if (searchType == 2){
    apiEndpoint = apiEndpoint + "&bib="+searchValue;
  }

  return apiEndpoint;
}

// first phase in the flow. When the component is mounted, then, fetch data
onMounted(async() => {
  // need to adjust with searchType = 2, 3... so wrap it in a function. raceid & baseUrl are global constants 
    var apiEndpoint = getEndpoint(baseUrl, raceid, searchType.value, searchValue.value); // searchValue, searchType has been bind to bib and relevant search
    await getData(apiEndpoint, startingPage, pageSize)
         .then(response => {
              migrateImagesToState(response.data.images, state, startingPage);
              state.pageCount = Math.ceil(response.data.total / pageSize);
              currentPage.value = startingPage; // remember .value for currentPage, otherwise, it loses reactivity
              totalImagesFound.value = response.data.total;
              yourName.value = (!response.data.name) ? "" : response.data.name ;
              raceName.value = response.data.campaignName;
          }) .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise

          })
          .finally(() => {
              addMetadataForSharingContent();
          });
})

function addMetadataForSharingContent(){
  const bib = route.query.bib;
  const url =  'https://yourbib.xyz/raceimages?raceid='+ ( (bib) ? raceid + '&bib='+bib : raceid);
  
  setMetaContentAttributeValue('og:url', url);
  setMetaContentAttributeValue('og:title', raceName.value);
  // just need to call this function when loading the page & the url of first item of state would be chosen 
      // if bib is not present, the first item is chosen at first. Later on, if clients search by bib
                            //  then, bib would appear on url, and if clients paste the current link (with bib)
                            // the page is load and this time, bib is on url so all images by bib is returned
                            // and state would only store images by bib, then first item is ok
      // bib is present, then state only store images by bib, so first item is ok
  setMetaContentAttributeValue('og:image', state.items[0].thumbnail);
  setMetaContentAttributeValue('og:description', raceName.value);
  
  function setMetaContentAttributeValue(property, contentValue){
      const metaList = document.getElementsByTagName("meta");
      // find the meta element whose property value is equal to property
      const element = findMetaElementByProperty(property);
      element.setAttribute("content", contentValue);

      function findMetaElementByProperty(property){
          // find the meta element whose property value is equal to property
          for(let i = 0; i< metaList.length; i++){
              if (metaList[i].getAttribute("property") === property ){
                return metaList[i];
              }
          }
      }
  };
};

// when users click on a page 
async function Paging(pageNumber){
  //if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
    if (isDataPageNotLoadedBefore(pageNumber)) {
         var apiEndpoint = getEndpoint(baseUrl, raceid, searchType.value, searchValue.value); // searchValue, searchType has been bind to bib and relevant search type
        await getData(apiEndpoint, pageNumber, pageSize)
             .then(response => {     
              // no need to reset selectedPage  as stated above 
                currentPage.value = pageNumber;  // remember .value for currentPage, otherwise, it loses reactivity
                migrateImagesToState(response.data.images, state, pageNumber);
             });
    }
    else { 
         currentPage.value = pageNumber;  // just need to update current page, and computed properties is activated. And remember .value for currentPage, otherwise, it loses reactivity
    } 
}

// after move to next/previous page or choose another search type, and  fetching data by api, state.times and currentPage change, and 
// calculate based on state.items (images are loaded until now) and currentPage in paging.
// currentPage is a global ref to keep track of current data page should be displayed
const itemsToBeDisplayed = computed(() =>{
        if (state.items.length == 0) { // data has not been loaded. The function is executed before onmount
          return [];
        }
        const fromIndex = (currentPage.value-1) * pageSize;
        const endIndex = currentPage.value * pageSize;
        return state.items.filter( (item) => {
            return (item.id >= fromIndex) && (item.id < endIndex); // if you visit page 2, then, go to page 5, and back to page 2, then, can acquire items in page 2 via indexing and displayed.
        });
    }
)

function migrateImagesToState(items, state, currentPage){
    var startIndex = (currentPage-1) * pageSize;
    items.forEach( (element) => {
                state.items.push({
                     id: startIndex, // need to be unique for VueJs, and to query data later on. Id is here is the item index (e.g page 3, second item -> id = (3-1)*10 (pagesize) +2 =22 ) 
                    "thumbnail": element.thumbnail,
                    "imageUrl": element.imageUrl,
                    "imageWithLogoUrl": element.imageWithLogoUrl
                })
                startIndex++;
            });
}

// Data page may be visited before, and already exist in state.
function isDataPageNotLoadedBefore(pageNumber) {
    // if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
    const fromIndex = (pageNumber-1) * pageSize;
    var firstItemInPage = state.items.find((item) => {return item.id == fromIndex }) ;
    return (!firstItemInPage);
}

//searchType change, we might need to setup againt searchValu as it has a default value for searchType 01
async function onSearchTypeChange(event){
 if (event.currentTarget.value == "1") {// searchType for race
    searchValue.value = "*";
 }
 else {
    searchValue.value = "";
  }
}

async function searchImages(){
  // Big question consider to push forward to http://127.0.0.1:5173/raceimages?raceid=25&bib=22424 
  var apiEndpoint = getEndpoint(baseUrl, raceid, searchType.value, searchValue.value); // searchValue, searchType has been bind to bib and relevant search

  // clean up old data
  state.items = [];
  state.pageCount = 0; // we do not need its reactivity
  currentPage.value = startingPage; 

  //startingPage and pageSize is const and is configured
  await getData(apiEndpoint, startingPage, pageSize)
      .then(response => {
          migrateImagesToState(response.data.images, state, startingPage);
          state.pageCount  = Math.ceil(response.data.total / pageSize);
          currentPage.value = startingPage; // remember .value for currentPage, otherwise, it loses reactivity
          selectedPage.value = 1; // set pagination's first page is 1 in the data list returned.
          totalImagesFound.value = response.data.total;
          yourName.value = (!response.data.name) ? "" : response.data.name ;
      })
   .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise

   })
  .finally(() => {
      let query = {};
      if (searchValue.value != '*'){
        query.bib = searchValue.value; 
      };
      
      router.push({
        path: route.fullPath,
        params: route.params,
        query: query
      });
   });
}
</script>
