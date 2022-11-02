<template>
    <div class="flex-container row" style="margin: 15px 15px 15px 15px;" >
        <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in itemsDisplayedOnScreen" :key="item.id">
            <a v-bind:href="item.imageUrl"> 
                <img v-bind:src="item.thumbnail">
            </a>
        </div>
    </div>
</template>


<script setup>
import {computed, reactive, ref} from 'vue'
import  ImageComponent  from './ImageComponent.vue'
import {getData, searchBIP} from '../services/DataService'
import axios from "axios";

const searchKeywork = ref(null);
const state = reactive({items: getData()})

    let itemsDisplayedOnScreen = ref(state.items);

    function search(event){
       axios.get('https://localhost:44301/Running/'+ searchKeywork.value , {
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

          itemsDisplayedOnScreen.value = imageList;
       });
    }
</script>

