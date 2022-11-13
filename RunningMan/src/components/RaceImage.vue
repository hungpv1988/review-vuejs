<template>
  <div>
    <h1>Longbien Marathon 2022 - Race Photos</h1>
    <div>
        <a style="cursor: pointer; margin-right: 30px" href="#/Search">Tìm theo BIB</a> |
        <a href="#/AllImages">Tất cả ảnh</a> 
    </div>
      <KeepAlive>
         <component :is="currentView" />
      </KeepAlive>
  </div>
</template>

<style scoped>


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
import SearchComponent from "./SearchComponent.vue";
import AllImages from "./AllImages.vue";
import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox.js";
import { ref, computed } from "vue";
const routes = {
  "/": AllImages,
  "/Search": SearchComponent,
  "/AllImages": AllImages,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || PageBrokenLink;
});

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
      "thumbs",
      "close",
    ],
  },
});
</script>
