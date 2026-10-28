<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
:root {
  --gray: #f2f2f2;
  --track: #e0e0e0;
  --purple: #7e57c2;
  --red: #e53935;
  --green: #43a047;
  --orange: #fb8c00;
  --blue: #1e88e5;
}

h1, h2 {
  font-family: 'Cinzel', Georgia, serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
