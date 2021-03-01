<template>
  <div>
    <!-- 这是面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单的时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";

export default {
  name: "Order",
  data() {
    return {
      querInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      //订单列表
      orderlist: [],
      // 修改地址对话框
      addressDialogVisible: false,
      //修改地址对话框
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      cityData,
      // 物流进度对话框
      progressDialogVisible: false,
      // 物流进度
      progressInfo: [
          {
              context:'已签收,签收人是孙胜虎（快递已送代理点如有问题请联系11053685196）先生/女士，如有疑问请联系派件员李亚宁、刘欣伟(11053685196、0530-18194261)，如您未收到此快递，请拨打投诉电话：0530--17366376，感谢使用申通快递，期待再次为您服务',
              time:'2020-07-15 12:39:56'
          },
        //   {
        //       context:'山东潍坊寒亭营业厅-寒亭魏飞飞(11053685196,0530-18194261)-派件中',
        //       time:'2020-07-15 08:46:54'
        //   },
          {
              context:'已签收-[代收点]已签收，签收人凭取货码签收。感谢使用广阳区百世快递[百世邻里]，期待再次为您服务',
              time:'2020-07-15 08:38:57'
          },
          {
              context:'待取件-[代理点]您的快件已被益丰粮油百世快递[百世邻里]代收，请在20点前取件，有问题联系百世邻里18531624682',
              time:'2020-07-15 06:38:13'
          },
          {
              context:'派送中-河北廊坊广阳区的华航-李亚宁[15081573955]正在派件(95720为中通快递员外呼专属号码，请放心接听)',
              time:'2020-07-14 20:56:45'
          },
          {
              context:'运输中-快件已到达河北廊坊广阳区',
              time:'2020-07-14 20:52:44'
          },
          {
              context:'快件离开河北廊坊开发区-发往河北廊坊广阳区',
              time:'2020-07-14 17:43:48'
          },
          {
              context:'快件已到达河北廊坊开发区',
              time:'2020-07-14 10:53:46'
          },
          {
              context:'快件离开华北操作部已发往河北廊坊',
              time:'2020-07-14 10:43:31'
          },
          {
              context:'快件已到达华北操作部',
              time:'2020-07-14 02:43:20'
          },
          {
              context:'快件离开潮汕中心已发往华北操作部',
              time:'2020-07-14 02:41:40'
          },
          {
              context:'快件已到达潮汕中心',
              time:'2020-07-13 16:28:13'
          },
          {
              context:'已揽收-潮州的KH-徐创丰-李亚宁[15081573955]已揽收',
              time:'2020-07-13 15:03:30'
          },
          {
              context:'已发货-包裹正在等待揽收',
              time:'2020-07-13 14:47:56'
          },
          {
              context:'已下单-商品已经下单',
              time:'2020-07-13 14:37:06'
          },
      ],

    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      console.log(res);
      this.total = res.data.total;
      this.orderlist = res.data.goods;
    },
    //分页
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getOrderList();
    },
    showEditDialog () {
      this.addressDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // async showProgressDialog() {
    //   // 供测试的物流单号：1106975712662
    //   const { data: res } = await this.$http.get("/kuaidi/1106975712662");
    //   if (res.meta.status !== 200) {
    //     return this.$message.error("获取物流进度失败!");
    //   }
    //   this.progressInfo = res.data;
    //   this.progressDialogVisible = true;
    // },
      async showProgressDialog() {
      // 供测试的物流单号：1106975712662
      this.progressDialogVisible = true;
    },
  },
};
</script>
<style scope>
</style>