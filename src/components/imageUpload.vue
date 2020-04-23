<template>
    <el-upload
      class="image-uploader"
      :action="uploadUrl + '/app/api/v1/file/imageUpload'"
      :show-file-list="false"
      :data="dataFiles"
      :on-success="uploadImage"
    >
      <el-image v-if="imageSrc != ''" :src="activeImage == ''?imageSrc:activeImage" class="image-uploader-cover" fit="cover"></el-image>
      <i v-else class="el-icon-plus image-uploader-icon"></i>
    </el-upload>
</template>
<script>
export default {
  name: "imageUpload",
  inject: ["reload"],
  props:['imageUpload_props'],
  data() {
    return {
      uploadUrl:'',
      imageSrc:'',
      activeImage:'',
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
      this.imageSrc = res.data.path;
      this.activeImage = URL.createObjectURL(file.raw);
      this.$emit('update:imageSrc',this.imageSrc);
    }
  }
};
</script>
<style scoped lang="scss">
.image-uploader /deep/  .el-upload {
  border: 1px dashed #ebb563;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.image-uploader-cover {
  width: 120px;
  height: 120px;
  display: block;
}
</style>






