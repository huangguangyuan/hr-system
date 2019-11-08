<template>
      <el-form-item label="文 件：">
        <el-upload
          class="upload-demo"
          :action="uploadUrl + '/app/api/v1/file/fileUpload'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handlEerror"
          :before-remove="handlBeforeRemove"
          :file-list="fileList"
          :limit="3"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :data="dataFiles"
        >
          <el-button plain>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">上传文件格式为：'.jpg','.png','.gif','.csv','.csv','.xlsx','.xls','.docx','.doc','.pdf'</div>
        </el-upload>
      </el-form-item>
</template>
<script>
export default {
  name: "fileUpload",
  inject: ["reload"],
  props:['fileUpload_props'],
  data() {
    return {
      //uploadUrl:'http://134.175.150.60:9527'
      uploadUrl:'',
      fileList:[],
      dataFiles:{}
    };
  },
  mounted() {
    this.dataFiles.uploadFolder = this.fileUpload_props.uploadFolder;
    this.fileList = this.fileUpload_props.fileList;
  },
  methods:{
      handlePreview(file){
        let a = document.createElement('a')
          a.href = file.url;
          a.target = '_blank';
          a.click();
      },
      // 限制当前文件个数
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件`);
      },
      // 限制上传文件格式
      beforeAvatarUpload(file){
        var isOk;
        var fileType = ['.jpg','.png','.gif','.csv','.csv','.xlsx','.xls','.docx','.doc'];
        for(var i=0;i<fileType.length;i++){
          if(file.name.indexOf(fileType[i]) != -1){
            isOk = true;
          }
        }
        if(!isOk){
          this.$message.error('文件格式错误~');
        }
        return isOk;
      },
      //上传成功
      handleSuccess(file, fileList) {
          this.fileList.push({name:'文件' + (this.fileList.length + 1),url:file.data.path});
          this.$emit('fileUpload_tf',this.fileList);
      },
      //删除
      handlBeforeRemove(file, fileList) {
      return Promise.resolve((this.$confirm("确认删除文件?","提 示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            return true;
          }).catch(() => {
            return reject(false);
          }))
      )
      },
      //删除
      handleRemove(file, fileList) {
        this.fileList = fileList;
        this.$emit('fileUpload_tf',this.fileList);
      },
      //获取上传文件路径
      handlEerror(err, file, fileList) {
          console.log(err);
          // console.log(fileList);
          // this.ruleForm.fileSrc = file.response.data.path;
      },
      // //获取上传文件路径
      // handlProgress(event, file, fileList) {
      //      console.log(event);
      //     // console.log(fileList);
      //     // this.ruleForm.fileSrc = file.response.data.path;
      // },
    }
  };
</script>
<style scoped lang="scss">
</style>






