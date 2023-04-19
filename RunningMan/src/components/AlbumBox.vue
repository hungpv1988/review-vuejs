<template>
    <div id="main-box" class="container-fluid">   <!-- should change the name main-box -->
        <div class="row" style="margin-top: 20px;" v-if="(props.uploadedImage)">
            <div class="col-sm-9 col-md-6 col-lg-4">
                <div>Ảnh bạn đẩy lên. Hãy chọn ảnh rõ khuôn mặt bạn để tăng độ chính xác tìm kiếm</div>
                <a data-fancybox="imggroup" v-bind:href="props.uploadedImage" :data-download-src="props.uploadedImage"> 
                    <img v-bind:src="props.uploadedImage" class="img-fluid img-thumbnail">
                </a>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;"> 
                <div class="col-md-9" style="margin-bottom: 1rem" id="statistic-box"> Có <strong>{{props.totalImagesFound}}</strong> ảnh được tìm thấy</div>
    
                <div class="col-md-3" id="paging-box">
                        <!-- page-count must be bound to  either state.total or a computed total. Cannot work with  constant and perhaps, let (but may be, use in wrong way) -->
                        <paginate
                          :page-count="props.pageCount"
                          :click-handler="Paging"
                          :prev-text="'Prev'"
                          :next-text="'Next'"
                          :page-class="'page-item'"
                        >
                        </paginate>
                </div> 
        </div>
        <div class="row">

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
</template>

<script setup>
import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox.js";
import {ref, reactive, watch } from 'vue';
import { getGlobalConfig} from '../services/DataService';
import Paginate from "vuejs-paginate-next";

const emit = defineEmits(['loadPage'])
const {startingPage, pageSize} = getGlobalConfig();

// imageList is retrieved on parent's component: RaceImages.vue, and props is updated, then, child component - ImageBox is updated accoridngly
const props = defineProps(['imageList', 'pageCount', 'totalImagesFound', 'uploadedImage']);
const state = reactive({items: []});
const itemsToBeDisplayed = ref([]);

// currentPage change, then itemsToBeDisplayed should be changed accordingly. So it should be ref
const currentPage = ref(startingPage); 

// Data page may be visited before, and already exist in state.
function isDataPageNotLoadedBefore(pageNumber) {
    // if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
    const fromIndex = (pageNumber-1) * pageSize;
    var firstItemInPage = state.items.find((item) => {return item.id == fromIndex }) ;
    return (!firstItemInPage);
};

// when users click on a page 
async function Paging(pageNumber){
    currentPage.value = pageNumber;  
  //if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
    if (isDataPageNotLoadedBefore(pageNumber)) {
      emit('loadPage', pageNumber); // change clickPage to loadDataPage
    }
    else {
      setItemsToBeDisplayed(currentPage);
    }
};

// watch change in imageList (after click on another page or click a new search criteria, data would be fetch in RaceImages and pass down to the component as a property) & update things accroi
watch(
  () => props.imageList,
  (newVal) =>{
      // currentPage has been changed in Paging before that triggers an event emit to fetch new images and make imageList to be changed and this watch is triggered.
      // first, migrate images to state for caching purpose, and then, set ItemsToBeDisplayed  by new page
      migrateImagesToState(newVal, state, currentPage); // currentPage has been changed in Paging & currentpage's data is migrated to state
      setItemsToBeDisplayed(currentPage); // items to be displayed on currentPage
  }
 )  ;

function migrateImagesToState(items, state, currentPage){
    if (!items || items.length == 0){
      state.items = []; // found no image    
      return;
    }

    var startIndex = (currentPage.value-1) * pageSize;
    items.forEach( (element) => {
                state.items.push({
                     id: startIndex, // need to be unique for VueJs, and to query data later on. Id is here is the item index (e.g page 3, second item -> id = (3-1)*10 (pagesize) +2 =22 ) 
                    "thumbnail": element.thumbnail,
                    "imageUrl": element.imageUrl,
                    "imageWithLogoUrl": element.imageWithLogoUrl
                })
                startIndex++;
            });
};

// after move to next/previous page or choose another search type, and  fetching data by api, state.times and currentPage change, and 
// calculate based on state.items (images are loaded until now) and currentPage in paging.
// currentPage is a global ref to keep track of current data page should be displayed
function setItemsToBeDisplayed(currentPage) {
    const fromIndex = (currentPage.value-1) * pageSize;
    const endIndex = currentPage.value * pageSize;
    itemsToBeDisplayed.value = state.items.filter( (item) => {
        return (item.id >= fromIndex) && (item.id < endIndex); // if you visit page 2, then, go to page 5, and back to page 2, then, can acquire items in page 2 via indexing and displayed.
    });
}
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
</script>
