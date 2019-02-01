<template>
  <div class="row login-wrapper">
    <h1>Ex-hentai图片下载</h1>
    <div class="input-field col s12">
      <input id="picUrl" type="text" class="validate" v-model="picUrl">
      <label for="picUrl">地址</label>
    </div>
    <button class="btn waves-effect waves-light" type="submit" name="action" @click="search">下载
      <i class="material-icons right">send</i>
    </button>
    <h1>{{status}}</h1>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Search',
    data () {
      return {
        picUrl: '',
        status: '',
      }
    },
    created () {
      const self = this
      ipcRenderer.on('getPicsFinish', (event, arg) => {
        self.status = arg
      })
      ipcRenderer.on('getPicsStaus', (event, arg) => {
        self.status = arg
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
