<template>
    <div class="login">
        <div class="container">
            <h5>后台登录系统</h5>
            <el-form label-position="left" label-width="100px" :model="formLabelAlign">
                <el-form-item label="账 号：">
                    <el-input prefix-icon="el-icon-edit" v-model="formLabelAlign.user"></el-input>
                </el-form-item>
                <el-form-item label="密 码：">
                    <el-input prefix-icon="el-icon-setting" v-model="formLabelAlign.pass"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click='loginFn'>登 录</el-button>
                    <el-button type="danger">注 册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:'login',
    data(){
        return{
            formLabelAlign: {
                user: '',
                pass: ''
            }
        }
    },
    methods:{
        // 登录
        loginFn(){
            var _this = this;
            _this.$router.push({path:'/home'});
        }
    }
}
</script>
<style scoped lang="scss">
.login{
    width: 100vw;height: 100vh;position: absolute;top:0;left: 0;background: url('../assets/images/login-bg.jpg') center center no-repeat;
    .container{
        position: absolute;width: 550px;padding:50px 0;background-color: rgba(255, 255, 255, 0.8);left: 50%;top:50%;
        transform: translate3d(-50%,-50%,0);transition: 0.5s all;box-shadow: 0 0 30px #409EFF; border:1px solid #409EFF;
        h5{font-size: 25px;text-align: center;font-weight: 500;}
        .el-form{width: 400px;margin: 30px auto;}
    }
    .container:hover{
        border-radius:30px;
        input{outline: none;}
    }
}
</style>





