<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/huahang.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
  <el-form-item  prop="username">
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
  </el-form-item>
                <!-- 密码 -->
    <el-form-item  prop="password">
    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
  </el-form-item>
               <!-- 按钮区域 -->
                 <el-form-item  class="btns">
             <el-button type="primary" @click="login">登录</el-button>
             <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"Login",
    data() {
        return {
            //这是登录表单的数据绑定对象
            loginForm:{
                username:'',
                password:''
            },
            //这是表单验证规则验证
            loginFormRules:{
                //验证用户名是否合法
                username:[ { required: true, message: '青输入登录名称', trigger: 'blur' },{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                //验证密码是否合法
                password:[{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]

            }

        }
    },
    methods:{
        //点击重置按钮，充值登录表单
        resetLoginForm(){
            console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                //   console.log(valid);
                if(!valid) return ;
                const {data: res}=await this.$http.post("login",this.loginForm);
                console.log(res);
                if(res.meta.status!=200) /*return console.log('登录失败'); */return this.$message.error('登陆失败')
                  /*return console.log('登录成功');*/  this.$message.success('登录成功')  ;
                 //1.将登录成功之后的token，保存到客户端的 sessionStrage中
                 //  1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                 //   1.2 token只应哎当前网站打开期间生效，所以token保存在sessionStrage中
                 window.sessionStorage.setItem("token", res.data.token);
                 //2. 通过编程式导航跳转到后台主页，路由地址是/home
                 this.$router.push("/home")

            })
        }
    }
}
</script>
<style  scoped>
    .login_container{
        /* background-color: #2b4b6b ; */
        background-image: url('../assets/bh.jpg');
        background-position: center 0px;
        background-size: cover;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        
        border-radius:3px ;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 2px solid #eee;
        border-radius:50% ;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;

        
        
    }
    .avatar_box img{
        width: 100%;
        height: 100%;
        border-radius:50% ;
        background-color: #eee;
    }
    .btns{
        display: flex; /*弹性盒模型*/
        justify-content: flex-end;/*横轴上 尾部对齐*/
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>