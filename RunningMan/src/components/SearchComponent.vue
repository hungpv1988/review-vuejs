<template>
    <div>
        <div id="bib-search">
          <input type="text" style="margin-right: 10px" v-model="searchKeywork" />
          <button @click="search" > Search </button>
        </div>
    
        <div class="flex-container row">
            <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in itemsDisplayedOnScreen" :key="item.id">
              <a data-fancybox="imggroup" v-bind:href="item.imageUrl"> 
                  <img v-bind:src="item.thumbnail" class="img-fluid img-thumbnail">
              </a>
           </div>
        </div>
    </div>
</template>

<style> 
 .flex-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .flex {
    display: flex;
  }
</style>

<script setup>
import {computed, reactive, ref, onMounted} from 'vue'
import {getGlobalConfig, searchBIP, getData} from '../services/DataService'


var global = getGlobalConfig();
const startingPage = global.startingPage, // to differentiate with currentPage. At the beginning, currentPage can be startingPage, but after doing scroll paging a lot of time, it's not the same.
      pageSize =  8, //global.pageSize,
      searchEndpoint = global.searchEndpoint,
      localSearchEndpoint = global.localSearchEndpoint,
      searchKeywork = ref(null),
      scrollPaging = 1,
      apiEndpoint = searchEndpoint; // or localSearchEndpoint if running local
      

  let itemsDisplayedOnScreen = ref([]),
      currentPage = startingPage,
      isLoading = false,
      totalPage = 0;
  

  // can be removed if not choosing scroll paging
  onMounted(() =>{
    if (scrollPaging == 0){ // no scroll paging
      return;
    }

    // Detect when scrolled to bottom.
    window.onscroll = () => {
        if (!searchKeywork.value){
            return;
        }

        var bottomOfWindow = document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight) ;
        if ((bottomOfWindow <= 1) && (!isLoading) && (currentPage <= totalPage)) {
          isLoading = true;
          searchBIP(apiEndpoint, searchKeywork.value, currentPage, pageSize) // replace by getData to test as it has a lot of data
              .then(response => {
                  migrateImagesFromSourceToDes(response.data.images, itemsDisplayedOnScreen.value,currentPage)
                  currentPage++;
              }).then (result => isLoading = false);// run setTimeout to guarantee the delay 
        }
    }})

    function search(event){
      searchBIP(apiEndpoint, searchKeywork.value, startingPage, pageSize)
       .then(response => {
          //bug on response.data.total. Not many items, but still show 12 pages
          totalPage = Math.ceil(response.data.total / pageSize); // set totalPage to restrict scroll paging. Need to reset totalPage here as you can search another BIP and info needs to be reset
          itemsDisplayedOnScreen.value = []; // when searching new bib, clean up old one
          migrateImagesFromSourceToDes(response.data.images, itemsDisplayedOnScreen.value,startingPage)
          currentPage = startingPage + 1;
       });
    }

    // functions
function migrateImagesFromSourceToDes(sourceItems, desItems, currentPage){
    var index = (currentPage-1) * pageSize;
    sourceItems.forEach( (element) => {
                desItems.push({
                     id: index, // need to be unique for VueJs, and to query data later on. Id is here is the item index (e.g page 3, second item -> id = (3-1)*10 (pagesize) +2 =22 ) 
                    "thumbnail": element.thumbnail,
                    "imageUrl": element.imageUrl
                })
                index++;
            });
}
</script>

