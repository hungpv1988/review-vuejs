<template>
  <div>
    <h1>Longbien Marathon 2022 - Race Photos</h1>
    <div class="row" style="display: flex; margin-botton: 10px">
          <a style="cursor: pointer; margin-right: 30px" >Tìm theo BIB</a>
          <a style="cursor: pointer" >Tất cả ảnh</a>
    </div>
    <div id="bib-search">
          <input type="text" style="margin-right: 10px" v-model="searchKeywork" />
          <button @click="search" > Search </button>
    </div>
    <div class="flex-container row" style="margin: 15px 15px 15px 15px;" >
        <div class="col-sm-6 col-md-3 col-lg-2" v-for="(item, index) in itemsDisplayedOnScreen" :key="item.id">
            <a v-bind:href="item.imageUrl"> 
                <img v-bind:src="item.thumbnail">
            </a>
       </div>
    </div>
  </div>
</template>

<style scoped>
 .flex-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

 .cursor {
    cursor: pointer;
  }

 
#top_menu {
    list-style: none;
    display: flex;
    padding: 0;
    margin-bottom: 0;
}

#top_menu li {
    border: 1px solid #CCC;
    margin: 2px;
    padding: 5px 10px;
    color: #555;
    cursor: pointer;
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
              id: parseInt(searchKeywork.value),
              "thumbnail": element.thumbnail,
              "imageUrl": element.imageUrl
            })
          });
    
     //     itemsDisplayedOnScreen.value = imageList;
       });

      itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
  //     itemsDisplayedOnScreen =  searchBIP(searchKeywork.value);
      //  console.log(imageList);
          //      itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
       // debugger;
        //itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
    }
</script>
