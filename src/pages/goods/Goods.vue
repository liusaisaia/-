<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row class="btn_bottom">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="AddDialogVisible = true"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品列表 -->
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
            <el-tag
              :type="scope.row.goods_state === 0
                  ? 'danger'
                  : scope.row.goods_state === 1
                  ? 'warning'
                  : 'success'"
            >
              {{
                scope.row.goods_state === 0
                  ? '未通过'
                  : scope.row.goods_state === 1
                  ? '审核中'
                  : '已审核'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否是热销" prop="is_promote">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.is_promote !== false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="热销量" prop="hot_mumber"> </el-table-column>
        <el-table-column label="操作"  width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editorRoleOpen(scope.row)"
              ></el-button
            >
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteRole(scope.row)"
              ></el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品弹出层 -->
    <el-dialog
      title="添加商品"
      :visible.sync="AddDialogVisible"
      :rules="addFormRules"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.goods_cat"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="addNumber">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="addNumber">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="addNumber">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="form.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Addlist">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods',
  components: {},
  props: {},
  data() {
    var addNumber = (rule, value, cd) => {
      const regNumber = /^[0-9]*$/;
      if (regNumber.test(value)) {
        return cd();
      }
      cd(new Error('请输入数字！'));
    };
    return {
      // 商品列表
      goodsTable: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        // 每页显示的数据个数
        pagesize: 2
      },
      // 分页参数
      queryInfo: {
        query: '',
        pagenum: 1,
        // 每页显示的数据个数
        pagesize: 5
      },
      // 添加商品弹出层
      AddDialogVisible: false,
      // 添加商品表单
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: ''
      },
      // 添加表单验证
      addFormRules: {
        addNumber: [
          { required: true, message: '请输入数字', trigger: 'blur' },
          { validator: addNumber, trigger: 'blur' }
        ]
      },
      total: 0
    };
  },
  filters: {},
  created() {},
  mounted() {
    this.getGoodsList();
  },
  methods: {
    // 上一页
    prevClick(e) {
      this.queryInfo.pagenum = e;
      this.getGoodsList();
    },
    // 下一页
    nextClick(e) {
      this.queryInfo.pagenum = e;
      this.getGoodsList();
    },
    // 当前页
    currentChange(e) {
      this.queryInfo.pagenum = e;
      this.getGoodsList();
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！');
      }
      res.data.goods.map(item => {
        item.add_time = this.getLocalTime(item.add_time);
        item.upd_time = this.getLocalTime(item.upd_time);
      });
      this.goodsTable = res.data.goods;
      this.total = res.data.total;
    },
    // 时间戳转换
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
    },
    // 弹出层事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 添加商品
    async Addlist() {
      if (!this.form.goods_name) {
        return this.$message.error('商品名称不能为空！');
      }
      if (!this.form.goods_cat) {
        return this.$message.error('商品分类不能为空！');
      }
      if (!this.form.goods_price) {
        return this.$message.error('商品价格不能为空！');
      }
      if (!this.form.goods_number) {
        return this.$message.error('商品数量不能为空！');
      }
      if (!this.form.goods_weight) {
        return this.$message.error('商品重量不能为空！');
      }
      const params = {
        goods_name: this.form.goods_name,
        goods_cat: '1,2,3',
        goods_price: Number(this.form.goods_price),
        goods_number: Number(this.form.goods_number),
        goods_weight: Number(this.form.goods_weight),
        goods_introduce: this.form.goods_introduce,
        pics: [],
        attrs: []
      };
      const { data: res } = await this.$http.post('goods', params);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success('添加商品成功！');
      this.form = {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: ''
      };
      this.getGoodsList();
      this.AddDialogVisible = false;
    },
    // 搜索商品
    async getUserList() {
      if (this.queryInfo.query === '') {
        return this.getGoodsList();
      }
      const { data: res } = await this.$http.get(
        'goods/' + this.queryInfo.query
      );
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败！');
      }
      this.goodsTable = [];
      this.goodsTable.push(res.data);
      this.goodsTable.map(item => {
        item.add_time = this.getLocalTime(item.add_time);
        item.upd_time = this.getLocalTime(item.upd_time);
      });
    },
    async deleteRole(e) {
      const id = e.goods_id;
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);

      // 如果用户确认删除返回字符串confirm
      // 如果用户取消删除返回字符串cancle
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data: res } = await this.$http.delete(
        `goods/` + id
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！');
      }
      this.$message.success('删除商品成功！');
      this.getGoodsList();
    }
  }
};
</script>

<style lang="less" scoped>
.btn_bottom {
  margin-bottom: 10px;

  .el-col-5 {
    margin-left: 10px;
  }
}
</style>
