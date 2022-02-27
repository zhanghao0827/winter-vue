<template>
  <div>
    <el-row>
      <span @click="uploadAvatar">
        <el-tooltip class="item" effect="dark" content="点击上传头像" placement="top-start">
          <el-avatar :size="100" :src="avatar"/>
        </el-tooltip>
      </span>
    </el-row>

    <my-upload
      v-model="show"
      :headers="headers"
      :url="url"
      @crop-upload-success="cropUploadSuccess"
    />
  </div>
</template>

<script>
  import myUpload from 'vue-image-crop-upload'
  import { mapGetters } from 'vuex'
  import { getToken } from '@/utils/auth'
  import store from '@/store'

  export default {
    name: 'Avatar',
    components: { myUpload },
    data() {
      return {
        show: false,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        url: 'http://localhost:8080/system/user/avatar'
      }
    },
    computed: {
      ...mapGetters([
        'avatar'
      ])
    },
    methods: {
      uploadAvatar() {
        this.show = !this.show
      },
      cropUploadSuccess() {
        store.dispatch('user/GetInfo').then(() => {})
      }
    }
  }
</script>

<style scoped>

</style>
