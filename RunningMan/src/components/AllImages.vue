<template>
    <div id="all-images">
      <div class="row" style="margin-top: 20px"> 
             <div class="col-md-6" style="margin-bottom: 1rem"> Có <strong>142,461</strong> ảnh của bạn, trong tổng số <strong>142,461</strong> ảnh </div>
   
              <div class="col-md-6">
                      <!-- page-count must be bound to  either state.total or a computed total. Cannot work with let or constant -->
               <paginate
             
                    :page-count="state.pageCount"
                    :click-handler="Paging"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :page-class="'page-item'"
                    >
                    </paginate>
             </div> 
      </div>

        <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in state.items" :key="item.id">
                <a data-fancybox="imggroup" v-bind:href="item.imageUrl"> 
                    <img v-bind:src="item.thumbnail" class="img-fluid img-thumbnail">
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {getData, getGlobalConfig} from '../services/DataService'
import Paginate from "vuejs-paginate-next";


const {startingPage, pageSize, imageEndpoint, localImageEndpoint} = getGlobalConfig();
const state = reactive({items: [], pageCount: 0});
const apiEndpoint = imageEndpoint; // imageEndpoint = server, localImageEndpoint= local
onMounted(async() => {
    await getData(apiEndpoint, startingPage, pageSize)
         .then(response => {
          state.items = response.data.images;
          // remove + 10 later on after the bug regarding total is fixed
          state.pageCount = Math.round((response.data.total + 10) / pageSize);
       });
})
 

async function Paging(pageNumber){
    await getData(apiEndpoint, pageNumber, pageSize)
       .then(response => {       
        state.items = response.data.images;
        
        // to test whether it works as images look the same  . It works so comment
         state.items.push({
              id: state.length + 1,
              "thumbnail": "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10",
              "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10"
            })
       });
}

</script>

