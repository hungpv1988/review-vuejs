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
    </div>

    
    <!-- SearchBox is a container-fluid  -->
    <SearchBox :enableDownload="enableDownload"  v-bind="searchingInfo" @search-images="submitSearchCriteria" :allowType="allowType" @download-images="downloadUserImages" />
    
    <!-- SearchBox is a container-fluid  -->
    <AlbumBox :key="reloadCount" :uploadedImage="uploadedImage" v-bind="albumInfo"  @loadPage="(pageNumber) => loadPageData(pageNumber)" />
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
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

const reloadCount = ref(0); // to make searchbox re-render when needed. This is used as a key for searchbox so when its value is changed, the component is re-rendered
const route = useRoute();
const router = useRouter();
//set up default value for searching box
const raceid = route.params.raceid;
const allowType = ref(1);
const raceName = ref(""); 
const configedHosts = ["timanh.com", "localhost", "127.0.0.1"];
const uploadedImage = ref(""); // the url of image uploaded for searching purpose

// move this to SearchBox later on
// by default, false. But if bib exists on query (f5 or search at home page), then show
const enableDownload = ref( (!route.query.bib) ? false : true );

// either in configed host or not in Iframe, hide our info including menu and logo
const isOurHost = configedHosts.filter((item) => { 
  return window.location.href.indexOf(item) > 0;
}).length > 0 && (window.location === window.parent.location); 

// initial data from configuration
// startingPage is the first page, value normally is 1
const globalConfig = getGlobalConfig();
const albumInfo = reactive({imageList: [], pageCount: 0, totalImagesFound: 0});

const searchingInfo = initSearchingInfo();
function initSearchingInfo(){
  // currently, only works with bib in home page
  const bibValue = route.query.bib ?? "*"; 
  const searchType = (bibValue === "*") ? 1 : 2 ; //1 = search all, 2 = search bib. We have three types of searching, but on homepage, no searching by image  
  
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

// consider to moved the main business to SearchBox later on, at here, just update albuminfo 
// searchType, searchValue are passed from SearchBox.vue by emit event
async function submitSearchCriteria(searchType, searchValue, file){   
  // reset searchingInfo
  searchingInfo.searchValue = searchValue;
  searchingInfo.searchType = searchType;
  searchingInfo.asset = file; // if search type is changed, file is set null in SearchBox, so searchingInfo needed to be updated accrodingly
  searchingInfo.pageNumber = globalConfig.startingPage; // reset page number as user click on a new search criteria  
  // we may not need those 3 lines, but keep it here for certainty
  // we need to reset albuminfo, otherwise, after reloadCount.value++, the component is reloaded
  // and its data would be binded with albumInfo.imageList that still have old value. Then, after feching data from search, new data is combined with old one
  // and this leads to a wrong in many cases. Currently, it still shows data correctly as in AlbumBox's watch, imageList is not changed after the component is reloaded (state is fresh now) , so migratedata does not execute
  albumInfo.imageList = [];
  albumInfo.pageCount = 0;
  albumInfo.totalImagesFound  = 0;
  // this is to re-render albumbox
  reloadCount.value++;

  // do a load if takes time here in the near future
  await searchData(searchingInfo)
      .then(response => {
          albumInfo.imageList = response.data.images;
          albumInfo.pageCount = Math.ceil(response.data.total / globalConfig.pageSize);
          albumInfo.totalImagesFound = response.data.total;
          if (searchingInfo.searchType == 3){
            // test to see whether value can be changed in const searchingInfo
             searchingInfo.previousFaceIds = response.data.previousFaceIds; // search by image need this
             uploadedImage.value = URL.createObjectURL(file);
          }
          else{
            uploadedImage.value = "";
          }

          // look stupid, should move to SearchBox
          if (searchingInfo.searchType == 2 || searchingInfo.searchType == 3){
            enableDownload.value = true;
          }
          else {
            enableDownload.value = false;
          }
      })
   .catch((error) => { // add this code segment so that vitest does not show error because of not handling error for promise
      albumInfo.imageList = [];
      albumInfo.pageCount = 0;
      albumInfo.totalImagesFound  = 0;
   })
  .finally(() => {
      if (searchingInfo.searchType == 3){// search by image
        return;
      }

      let query = {};
      if (searchingInfo.searchType == 2){ // search by bib, then, update bib in Url
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

// can be moved to SearchBox later on
 async function downloadUserImages(){
  const pageNumber = searchingInfo.pageNumber; // keep original value
  const pageSize = searchingInfo.pageSize; // keep original value
  const pageSizeForDownload = 1000; // no use has 1k image, this is to guarantee that all images of an user can be returned.
  searchingInfo.pageSize =  pageSizeForDownload;
  searchingInfo.pageNumber = globalConfig.startingPage;

  await searchData(searchingInfo).then(response => {
      const images = response.data.images;
      generateZIP(images);
  })
  
  searchingInfo.pageSize =  pageSize;
  searchingInfo.pageNumber = pageNumber;
 }

 function generateZIP(imageList) {
  var zip = null;

  // have not been able to fix this problem.
  try{
    zip = new JSZip();
  }
  catch{
    zip = JSZip.default();
  }
  
  var count = 0;
  var zipFilename = "timanh.zip";
  const numberofImages = imageList.length; 
  imageList.forEach(function (imageItem, i) {
    var url = imageItem.imageWithLogoUrl;
    // add extension to replace .jpg. Add preview box as well
    var extension = url.split(".").pop(); // split by . and get the last item. e.g 'https://yourbib.com/nulllg230408blvmowatermark-D75_6421.JPG';
    var filename =  'timanh_'.concat(i+1).concat('.').concat(extension); //i starts from 0, so need to add i+1 to be familiar with users
    // loading a file and add it in a zip file
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        throw err; // or handle the error
      }
      zip.file(filename, data, { binary: true });
      count++;
      if (count == numberofImages) {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          saveAs(content, zipFilename);
        });
      }
    });
  })}
</script>
