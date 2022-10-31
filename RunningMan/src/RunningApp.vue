<template>
  <div class="flex-container" style="margin: 15px 15px 15px 15px;">
      <ImageComponent  v-for="item in items" :key="item.id" v-bind:thumbnail="item.thumbnail" v-bind:imageUrl="item.imageUrl"/>
  </div>
</template>

<style scoped>
 .flex-container {
    display: flex;
    flex-direction: row;
     align-items: center;
  }
</style>

<script setup>
import  ImageComponent  from './components/ImageComponent.vue'

const items = [
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
            ]
</script>
