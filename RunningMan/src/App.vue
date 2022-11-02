<script setup>
import { ref, computed } from 'vue'
import PageA from './components/Tab/PageA.vue'
import PageB from './components/Tab/PageB.vue'
import PageHome from './components/Tab/PageHome.vue'
import PageBrokenLink from './components/Tab/PageBrokenLink.vue'

const routes = {
    '/': PageHome,
  '/PageA': PageA,
  '/PageB': PageB
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || PageBrokenLink
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
    <br />
    <a href="#/">Home</a> |
    <a href="#/PageA">Page A</a> |
    <a href="#/PageB">Page B</a> |
    <a href="#/non-existent-path">BrokenLink</a>
    <component :is="currentView" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
