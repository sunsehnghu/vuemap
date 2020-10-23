<template>
  <el-container class="home">
      <!-- 头部区域 -->
         <el-header>
             <div>
                 <img src="../assets/huahang.jpg" alt="" class="img">
                 <span>电商后台管理系统</span>
             </div>
             <el-button type="info" @click="logout">退出</el-button>
         </el-header>
         <!-- 页面主体区域 -->
    <el-container>
         <el-aside width="200px">
       <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF">
        <!-- 一级菜单 -->
      <el-submenu  :index="item.id+''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span >{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
            <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>

    </el-menu>
         </el-aside>
         <!-- 右侧内容主题 -->
    <el-main>Main</el-main>
   </el-container>
  </el-container>
</template>
<script>
export default {
    created(){
      this.getMenuList()
    },
    name:"Home",
    data() {
        return {
            //左侧菜单数据
            menulist:[],
            iconsObj:{
               '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            }
            
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        //获取所有的菜单
   async getMenuList(){
      const{data : res} =await this.$http.get('menus')
      console.log(res);
      if(res.meta.status !==200) return this.$message.error(res.meta.msg)
       this.menulist=res.data
       
    }
    }
    
}
</script>
<style scoped>
 .el-header{
     background-color: #373d51;
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding-left:0;
     color: #fff;
     font-size: 20px;
     
 }
 .el-header div{
     display: flex;
     align-items: center;
 }
 .el-header div span{
     margin-left: 15px;
 }
 .el-aside{
    background-color: #333744;
 }
 .el-main{
     background-color: #E9EDF1;
 }
.home{
    height: 100%;
    width: 100%;
}
.img{
    height: 40px;
    width: 40px;
    border-radius:50% ;
}
.iconfont{
    margin-right: 10px;
}
</style>