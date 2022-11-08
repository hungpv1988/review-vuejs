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
                    <img v-bind:src="item.thumbnail " class="img-fluid img-thumbnail">
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
              state.pageCount = Math.round(response.data.total / pageSize);
          });
})
 

async function Paging(pageNumber){
    await getData(apiEndpoint, pageNumber, pageSize)
       .then(response => {       
        state.items = response.data.images;
       });
}

</script>

