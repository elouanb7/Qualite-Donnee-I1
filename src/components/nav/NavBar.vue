<template>
  <nav>
    <div id="left">
      <RouterLink to="/">NaviMap</RouterLink>
    </div>
    <div id="center">
      <RouterLink to="/about">About</RouterLink>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
nav {
  width: 100%;
  text-align: center;
  margin: 2rem 0 2rem;
  font-size: 18px;
  display: flex;
  justify-content: space-around;
}

#left {
  font-size: 25px;
  width: 10rem;
  display: flex;
  align-items: center;
  font-weight: bold;
}

#center {
  display: flex;
  align-items: center;
}

nav a.router-link-exact-active {
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  text-decoration: none;
  color: black;
}

nav a:first-of-type {
  border: 0;
}
</style>
