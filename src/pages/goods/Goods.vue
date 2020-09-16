<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表 -->
    <el-card >
      <!-- 添加角色按钮 -->
      <el-row class="btn_bottom">
        <el-col>
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsTable" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="价格" prop="goods_price"> </el-table-column>
        <el-table-column label="数量" prop="goods_number"> </el-table-column>
        <el-table-column label="重量" prop="goods_weight"> </el-table-column>
        <el-table-column label="添加时间" prop="add_time"> </el-table-column>
        <el-table-column label="更新时间" prop="upd_time"> </el-table-column>
        <el-table-column label="商品状态" prop="goods_state">
          <template slot-scope="scope">
            <el-tag :type=" scope.row.goods_state ? 'success' : 'danger'">
              {{scope.row.goods_state === 0 ? '未通过' : scope.row.goods_state === 1 ? '审核中' : '已审核'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否是热销" prop="is_promote">
          <template slot-scope='scope'>
            <i
              class='el-icon-success'
              v-if='scope.row.is_promote !== false'
              style='color: lightgreen'
            ></i>
            <i class='el-icon-error' v-else style='color: red'></i>
          </template>
        </el-table-column>
        <el-table-column label="热销量" prop="hot_mumber"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods',
  components: {},
  props: {},
  data() {
    return {
      // 商品列表
      goodsTable: [],
      // 分页参数
      queryInfo: {
        query: '',
        pagenum: 1,
        // 每页显示的数据个数
        pagesize: 2
      }
    };
  },
  filters: {},
  created() {},
  mounted() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！');
      }
      res.data.goods.map(item => {
        item.add_time = this.getLocalTime(item.add_time);
        item.upd_time = this.getLocalTime(item.upd_time);
      });
      this.goodsTable = res.data.goods;
      console.log(this.goodsTable);
    },
    getLocalTime(nS) {
      var date = new Date(nS * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return M + D + h + m + s;
    }
  }
};
</script>

<style lang="less" scoped>
.btn_bottom {
  margin-bottom: 10px;
}

</style>
