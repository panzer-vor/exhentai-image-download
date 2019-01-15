<template>
  <div id="wrapper">
    <Search></Search>
  </div>
</template>

<script>
  import Search from './Search'
  export default {
    name: 'Home',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    components: {
      Search
    }
  }
</script>

<style type="scss">

</style>
