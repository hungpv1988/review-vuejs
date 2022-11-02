<template>
  <div>
    <h1>Longbien Marathon 2022 - Race Photos</h1>
    <div class="row" style="display: flex; margin-botton: 10px">
        <a style="cursor: pointer; margin-right: 30px" href="#/Search">Tìm theo BIB</a> |
        <a href="#/AllImages">Tất cả ảnh</a> 
   
        <component :is="currentView" />
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
import SearchComponent from './components/SearchComponent.vue'
import AllImages from './components/AllImages.vue'
import {ref, computed} from 'vue'
import { Fancybox } from "@fancyapps/ui";
  const routes = {
    '/': AllImages,
    '/Search': SearchComponent,
    '/AllImages': AllImages
  }
  
  const currentPath = ref(window.location.hash)

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
  })

  const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || PageBrokenLink
  })

  Fancybox.bind('[data-fancybox="imggroup"]', {
  Toolbar: {
    display: [
      { id: "prev", position: "center" },
      { id: "counter", position: "center" },
      { id: "next", position: "center" },
      "zoom",
      "download",
      "slideshow",
      "fullscreen",
      "download",
      "thumbs",
      "close",
    ],
  },
});
</script>
