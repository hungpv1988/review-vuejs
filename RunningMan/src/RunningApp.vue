<template>
  <div>
    <h1>Longbien Marathon 2022 - Race Photos</h1>
    <div>
        <a style="cursor: pointer; margin-right: 30px" href="#/Search">Tìm theo BIB</a> |
        <a href="#/AllImages">Tất cả ảnh</a> 
    </div>
  
    <component :is="currentView" />
  </div>
</template>

<style scoped>

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
  border: 1px solid #ccc;
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

body {
  padding-top: 40px;
}
</style>

<script setup>
import SearchComponent from "./components/SearchComponent.vue";
import AllImages from "./components/AllImages.vue";
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
</script>
