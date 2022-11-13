<template>
    <div>
         <router-view></router-view>
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
import { onMounted } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';

onMounted(async() =>{
  const router = useRouter();
  const route = useRoute();
  await router.push({name: 'homepage'}).then(res => {
    console.log("log ok");
  })
});
</script>


