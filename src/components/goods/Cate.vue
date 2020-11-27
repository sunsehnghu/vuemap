<template>
    <div>
              <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
       <!-- 卡片视图区域 -->
       <el-card>
           <el-row>
               <el-col>
                   <el-button type="primary">添加分类</el-button>
               </el-col>
           </el-row>
           <!-- 表格 -->
              <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border></tree-table>
           <!-- 分页区 -->
       </el-card>
    </div>
</template>
<script>
export default {
    name:'Cate',
    data() {
        return {
            //查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //商品分类的数据列表，默认为空
            catelist:[],
            //总数据条数
            total:0,
            //为table指定列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            }]
        }
    },
    created(){
        this.getCatelist()
    },
    methods:{
        //获取商品分类数据
       async getCatelist(){
          const{data:res}= await  this.$http.get('categories',{params:this.querInfo})

          if(res.meta.status !==200){
              return this.$message.error('获取商品分类失败!')
          }
          console.log(res.data);
        //把数据列表赋值给catelist
          this.catelist = res.data.result
          //把总数据条数 赋值 给 total
          this.total = res.data.total
        }
    }
}
</script>
<style scoped>
    
</style>
