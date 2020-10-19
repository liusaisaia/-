<template>
    <div class="orderList">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- table栏 -->
      <el-card>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
    name: "orderList",
    data() {
        return {
          tableData: [],
          info: {
            query: '',
            pagenum: 1,
            pagesize: 100
          }
        };
    },
    created() {
    },
    watch: {

    },
    computed: {

    },
    mounted() {
      this.getOrderList();
    },
    methods: {
      async getOrderList() {
        const { data: res } = await this.$http.get('orders', {params: this.info});
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！');
        }
      }
    },
};
</script>

<style>

</style>
