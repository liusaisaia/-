<template>
  <div class="breadList">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图区 -->
    <el-card>
      <!-- 头部警告卡片 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <div class="breadList">
        <!-- 选择商品分类 -->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类:</span>
            <div class="style-box">
              <el-cascader
                :height="200"
                class="cas_Sty"
                v-model="selectedCateKeys"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-col>
        </el-row>

        <!-- tab页签区 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数面板 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisbled"
              class="btn-mar"
              @click="addDialogVisible = true"
            >
              添加参数
            </el-button>
            <!-- 动态参数表格  -->
            <el-table :data="manyTabData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand"></el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button size="mini" type="primary" icon="el-icon-edit">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisbled"
              @click="addDialogVisible = true"
              class="btn-mar"
            >
              添加属性
            </el-button>
            <!-- 静态属性表格  -->
            <el-table :data="onlyTabData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand"></el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button size="mini" type="primary" icon="el-icon-edit">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   级联选择框双向绑定到的数组
      selectedCateKeys: [],
      activeName: 'many',
      // 动态参数的数据
      manyTabData: [],
      // 静态属性的数据
      onlyTabData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单验证
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    //   获取所有商品分类列表
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用返回true 否则返回falae
    isBtnDisbled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    }
  },
  methods: {
    // 获取所有商品列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！');
      }
      this.cateList = res.data;
    },
    // 级联选择框选中触发
    handleChange() {
      this.getParamsData();
    },
    // tab页签点击事件出来函数
    handleTabClick() {
      this.getParamsData();
      console.log(this.activeName);
    },
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      // 根据所选的分类id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！');
      }

      // 判断数据
      if (this.activeName === 'many') {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    }
  }
};
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.cas_Sty {
  height: 50px;
}
.style-box .el-cascader-panel {
  max-height: 200px !important;
  top: 0;
}
.btn-mar {
  margin: 10px 0;
}
</style>
