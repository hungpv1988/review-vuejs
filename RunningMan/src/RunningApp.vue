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

  // if user is at raceimages, or any other pages, then, press f5, server would return index (this page), 
  // but url on browser is still the raceimages and in this case, we should keep them at the same page as before pressing f5 (not forward to homepage)
  if (!window.location.pathname){ 
    await router.push({name: 'homepage'}).then(res => {
      console.log("log ok");
    });
  }

});
</script>


