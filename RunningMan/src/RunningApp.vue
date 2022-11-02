<template>
  <div>
    <h1>Longbien Marathon 2022 - Race Photos</h1>
    <div id="bib-search">
          <input type="text" style="margin-right: 10px" v-model="searchKeywork" />
          <button @click="search" > Search </button>
    </div>
    <div class="flex-container" style="margin: 15px 15px 15px 15px;">
        <ImageComponent  v-for="item in itemsDisplayedOnScreen" :key="item.id" v-bind:thumbnail="item.thumbnail" v-bind:imageUrl="item.imageUrl"/>
    </div>
  </div>
</template>

<style scoped>
 .flex-container {
    display: flex;
    flex-direction: row;
    align-items: center;
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

body { padding-top: 40px; }
</style>

<script setup>
import {computed, reactive, ref} from 'vue'
import  ImageComponent  from './components/ImageComponent.vue'
import {getData, searchBIP} from './Services/DataService'
import axios from "axios";

const searchKeywork = ref(null);
const state = reactive({items: getData()})

    let itemsDisplayedOnScreen = ref(state.items);
    

    function search(event){
       axios.get('https://localhost:44301/Running/'+searchKeywork.value , {
          // params:{
          //   "bip": bip
          // },
          headers:{
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET'
          }
       })
       .then(response => {
          var imageList = [];
          response.data.imageList.forEach(element => {
            imageList.push({
              id: searchKeywork.value,
              "thumbnail": element.thumbnail,
              "imageUrl": element.imageUrl
            })
          });
          itemsDisplayedOnScreen.value  = null;
          itemsDisplayedOnScreen.value = imageList;
       });

      itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
  //     itemsDisplayedOnScreen =  searchBIP(searchKeywork.value);
      //  console.log(imageList);
          //      itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
       // debugger;
        //itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
    }
</script>
