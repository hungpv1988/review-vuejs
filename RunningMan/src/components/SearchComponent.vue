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
const startingPage = global.startingPage,
      pageSize = global.pageSize,
      searchEndpoint = global.searchEndpoint,
      localSearchEndpoint = global.localSearchEndpoint,
      searchKeywork = ref(null),
      apiEndpoint = searchEndpoint; // or localSearchEndpoint if running local
      

  let itemsDisplayedOnScreen = ref([]);
  let currentPage = startingPage;
  let isLoading = false;
  const scrollPaging = 1;

  // can be removed if not choosing scroll paging
  onMounted(() =>{
    if (scrollPaging == 0){ // no scroll paging
      return;
    }

    // Detect when scrolled to bottom.
    window.onscroll = () => {
        var bottomOfWindow = document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight) ;
        if ((bottomOfWindow <= 1) && (!isLoading)) {
          isLoading = true;
          searchBIP(apiEndpoint, searchKeywork.value, currentPage, pageSize) // replace by getData to test as it has a lot of data
              .then(response => {
                 // var imageList = [];
                  response.data.images.forEach((element, index, attr) => {
                      itemsDisplayedOnScreen.value.push({
                      id: index,
                      "thumbnail": element.thumbnail,
                      "imageUrl": element.imageUrl
                    })
                  });
                  
                  currentPage++;
              }).then (result => isLoading = false);// run setTimeout to guarantee the delay
              
        }
    }})

    function search(event){
      searchBIP(apiEndpoint, searchKeywork.value, currentPage, pageSize)
       .then(response => {
          var imageList = [];
          response.data.images.forEach(element => {
            imageList.push({
              id: parseInt(searchKeywork.value),
              "thumbnail": element.thumbnail,
              "imageUrl": element.imageUrl
            })
          });

          itemsDisplayedOnScreen.value = imageList;
          currentPage++;
       });
    }
</script>

