<template>
  <div class="col-sm-6 col-md-3 col-lg-2 img-thumbnail-div">
    <a href=""> 
        <img v-bind:src=thumbnail>
    </a>
  </div>
</template>

<style scoped>

.img-thumbnail-div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
}

</style>

<script setup>
const props = defineProps({
  thumbnail: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})
</script>
