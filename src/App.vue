<template>
  <nav>
    <router-link to="/">Basic</router-link> |
    <router-link to="/fetch">Fetch</router-link> |
    <router-link to="/thousand">10 Thousand</router-link> |
    <router-link to="/server">Server</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
