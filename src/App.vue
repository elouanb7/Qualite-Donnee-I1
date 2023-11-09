<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/nav/NavBar.vue'
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@500&display=swap"
    rel="stylesheet"
  />
  <div id="root">
    <NavBar />
    <RouterView />
  </div>
</template>

<style>
body {
  font-family: 'Red Hat Display', sans-serif;
}
</style>
