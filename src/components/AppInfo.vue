<template>
  <footer>
    <a href="https://darksky.net/poweredby/" target="_blank">Powered by Dark Sky</a>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>

footer {
  text-align: right;
  position: relative;
  top: 15px;
  left: 30px;

  a {
    font-size: 12px;
    opacity: 0.5;
    text-decoration: none;
    color: inherit;
  }
}
</style>
