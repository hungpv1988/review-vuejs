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
</style>

<script setup>
import {computed, reactive, ref} from 'vue'
import  ImageComponent  from './components/ImageComponent.vue'

const searchKeywork = ref(null);
const state = reactive({items: [
              {
                id: 1,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10",
                "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10"
              },
              {
                id: 2,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/4d7f590f9e792075b9c05dffdb8af5f7.jpg?v=10",
                "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/4d7f590f9e792075b9c05dffdb8af5f7.jpg?v=10"
              },
              {
                id: 3,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/54d92cf9254c3a0a302cd5156921c289.jpg?v=10",
                "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/54d92cf9254c3a0a302cd5156921c289.jpg?v=10"
              },
              {
                id: 4,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/cddb6a91c39e24f392e07ed2b3c62d16.jpg?v=10",
                "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/cddb6a91c39e24f392e07ed2b3c62d16.jpg?v=10"
              },
              {
                id: 5,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/6fc3505469e467e108dee4d5ec98ab1b.jpg?v=10",
                "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/6fc3505469e467e108dee4d5ec98ab1b.jpg?v=10"
              },
              {
                id: 6,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/c2953c4f381717a1619705a0fc8f15eb.jpg?v=10",
                "imageUrl": "https://lbmpix.race.vn/photo?race_id=lbm2022&result=0&bib_type=all&bib=*&page=62#cl-group-1"
              },
              {
                id: 7,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/d8e2a30d5280c7a791173c0d93355415.jpg?v=10",
                "imageUrl": "https://lbmpix.race.vn/photo?race_id=lbm2022&result=0&bib_type=all&bib=*&page=62#cl-group-33"
              },
              {
                id: 8,
                "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/dd11e0603f3d247979fe02ce390c812f.jpg?v=10",
                "imageUrl": "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/dd11e0603f3d247979fe02ce390c812f.jpg?v=10"
              },
            ]})

    const itemsDisplayedOnScreen = ref(state.items);

    function search(event){
        itemsDisplayedOnScreen.value = state.items.filter(item => item.id > searchKeywork.value)
    }
</script>
