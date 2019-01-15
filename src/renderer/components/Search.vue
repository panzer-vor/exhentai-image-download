<template>
  <div class="row login-wrapper">
    <h1>Ex-hentai</h1>
    <div class="input-field col s12">
      <input id="picUrl" type="text" class="validate" v-model="picUrl">
      <label for="picUrl">地址</label>
    </div>
    <button class="btn waves-effect waves-light" type="submit" name="action" @click="search">下载
      <i class="material-icons right">send</i>
    </button>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Search',
    data () {
      return {
        picUrl: ''
      }
    },
    created () {
      ipcRenderer.on('getPicsFinish', (event, arg) => {
        alert(arg)
      })
    },
    methods: {
      search () {
        ipcRenderer.send('getPics', this.picUrl)
      }
    }
  }
</script>

<style type="scss">
  .login-wrapper {
    margin: 30px;
  }
</style>
