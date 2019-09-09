<template>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl + '/app/api/v1/file/imageUpload'"
          :show-file-list="false"
          :on-success="uploadImage"
        >
          <el-image v-if="imageSrc != ''" :src="imageSrc" class="avatar" fit="cover"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
</template>
<script>
export default {
  name: "imageUpload",
  inject: ["reload"],
  props:['imageUpload_props'],
  data() {
    return {
      //uploadUrl:'http://134.175.150.60:9527'
      uploadUrl:'',
      imageSrc:'',
      dataFiles:{}
    };
  },
  mounted() {
    this.dataFiles.uploadFolder = this.imageUpload_props.uploadFolder;
    this.imageSrc = this.imageUpload_props.imageSrc;
  },
  methods:{
    // 获取上传头像
    uploadImage(res, file) {
      this.imageSrc = URL.createObjectURL(file.raw);
      this.$emit('fileUpload_tf',this.imageSrc);
    }
  }
};
</script>
<style scoped lang="scss">
</style>






