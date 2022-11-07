<template>
    <div>
        <div id="bib-search">
          <input type="text" style="margin-right: 10px" v-model="searchKeywork" />
          <button @click="search" > Search </button>
        </div>
    
        <div class="flex-container row" style="margin: 15px 15px 15px 15px;" >      
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
import {computed, reactive, ref} from 'vue'
import {getGlobalConfig, searchBIP} from '../services/DataService'
import axios from "axios";

var global = getGlobalConfig();
const startingPage = global.startingPage,
      pageSize = global.pageSize,
      searchEndpoint = global.searchEndpoint,
      localSearchEndpoint = global.localSearchEndpoint,
      searchKeywork = ref(null),
      apiEndpoint = searchEndpoint; // or localSearchEndpoint if running local


    let itemsDisplayedOnScreen = ref([]);

    function search(event){
      searchBIP(localSearchEndpoint, searchKeywork.value, startingPage, pageSize)
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
       });
    }
</script>

