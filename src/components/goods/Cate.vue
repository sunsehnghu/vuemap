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
          <el-button class="treetable" type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- //是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
          <!-- 排序 -->
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scoped.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scoped.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- option用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKey"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChang"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Cate",
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类表单数据对象
      addCateForm: {
        //将要添加的对象的名称
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //分类的等级默认为1级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类的id数组
      selectedKey: [],
      // 编辑对话框 控制
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 编辑表单 绑定对象
      editCateForm: "",
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    //获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      console.log(res.data);
      //把数据列表赋值给catelist
      this.catelist = res.data.result;
      //把总数据条数 赋值 给 total
      this.total = res.data.total;
    },
    //监听pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCatelist();
    },
    //监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCatelist();
    },
    //点击按钮，展示添加分类对话框
    showAddCateDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList();
      //再展示对话框
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChang() {
      console.log(this.selectedKey);
      //如果selectedKey数组哄的length大于0，证明选中的父级分类
      //反之，就说明没有选中任何父级分类
      if (this.selectedKey.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKey[
          this.selectedKey.length - 1
        ];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKey.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功!");
        this.getCatelist();
        this.addCateDialogVisible = false;
      });
    },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKey = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // removeCate(cate_id){

    // }
    // 根据id删除对应的参数项
    async removeCate(cat_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //用户取消了删除操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      //删除的业务逻辑
      const { data: res } = await this.$http.delete(`categories/${cat_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.$message.success("删除分类成功");
      this.getCatelist();
    },
  // 显示编辑对话框
    async showEditCateDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 编辑分类名
    eidtCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          })
        if (res.meta.status !== 200){
           return this.$message.error('更新分类名失败！')
        }
        this.$message.success('更新分类名成功！')
        this.getCatelist();
        this.editCateDialogVisible = false
      })
    }
  },
};
</script>
<style scoped>
.treetable {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
