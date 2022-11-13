<template>
    <div id="all-images">
        <div class="row" style="margin-top: 20px;"> 
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
  
        <div class="row" style="align-items:center;">
            <TransitionGroup name="list">
                <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in itemsToBeDisplayed" :key="item.id">
                    <a data-fancybox="imggroup" v-bind:href="item.imageUrl"> 
                        <img v-bind:src="item.thumbnail " class="img-fluid img-thumbnail">
                    </a>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {getData, getGlobalConfig} from '../services/DataService'
import Paginate from "vuejs-paginate-next";


const {startingPage, pageSize, imageEndpoint, localImageEndpoint} = getGlobalConfig();
const state = reactive({items: [], pageCount: 0});
const apiEndpoint = imageEndpoint; // imageEndpoint = server, localImageEndpoint= local
let currentPage = ref(startingPage); // currentPage change, then itemsToBeDisplayed should be changed accordingly. So it should be ref

// important note: switch tag to search bib, then state is lost. Need to test again
onMounted(async() => {
    await getData(apiEndpoint, startingPage, pageSize)
         .then(response => {
              migrateImagesToState(response.data.images, state, startingPage);
              state.pageCount = Math.ceil(response.data.total / pageSize);
              currentPage.value = startingPage; // remember .value for currentPage, otherwise, it loses reactivity
          });
})
 
async function Paging(pageNumber){
    if (isDataPageNotLoadedBefore(pageNumber)) {// if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
        await getData(apiEndpoint, pageNumber, pageSize)
             .then(response => {     
                currentPage.value = pageNumber;  // remember .value for currentPage, otherwise, it loses reactivity
                migrateImagesToState(response.data.images, state, pageNumber);
             });
    }
    else { 
         currentPage.value = pageNumber;  // just need to update current page, and computed properties is activated. And remember .value for currentPage, otherwise, it loses reactivity
    } 
}

// calculate based on state.items (images are loaded until now) and currentPage in paging.
const itemsToBeDisplayed = computed(() =>{
        const fromIndex = (currentPage.value-1) * pageSize;
        const endIndex = currentPage.value * pageSize;
        return state.items.filter( (item) => {
            return (item.id >= fromIndex) && (item.id < endIndex); // if you visit page 2, then, go to page 5, and back to page 2, then, can acquire items in page 2 via indexing and displayed.
        });
    }
)

// functions
function migrateImagesToState(items, state, currentPage){
    var startIndex = (currentPage-1) * pageSize;
    items.forEach( (element) => {
                state.items.push({
                     id: startIndex, // need to be unique for VueJs, and to query data later on. Id is here is the item index (e.g page 3, second item -> id = (3-1)*10 (pagesize) +2 =22 ) 
                    "thumbnail": element.thumbnail,
                    "imageUrl": element.imageUrl
                })
                startIndex++;
            });
}

// Data page may be visited before, and already exist in state.
function isDataPageNotLoadedBefore(pageNumber) {
    // if we do not have an item at the beginning of the page, meaning that the clients have not accessed the page already, so  need to make a requet to api
    const fromIndex = (pageNumber-1) * pageSize;
    var firstItemInPage = state.items.find((item) => {return item.id == fromIndex }) ;
    return (!firstItemInPage);
}
</script>

