<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to='{ path: "/home" }'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click='showAddCatDialog' type='primary'>添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格-->
      <tree-table
        class='treeTable'
        :data='cateList'
        :columns='columns'
        :selection-type='false'
        :expand-type='false'
        :show-index='true'
        index-text='#'
        border
        :show-row-hover='false'
      >
        <!-- 是否有效 -->
        <template slot='isok' slot-scope='scope'>
          <i
            class='el-icon-success'
            v-if='scope.row.cat_deleted === false'
            style='color: lightgreen'
          ></i>
          <i class='el-icon-error' v-else style='color: red'></i>
        </template>
        <!-- 排序 -->
        <template slot='order' slot-scope='scope'>
          <el-tag size='mini' v-if='scope.row.cat_level === 0'>一级</el-tag>
          <el-tag type='success' size='mini' v-else-if='scope.row.cat_level === 1'>二级</el-tag>
          <el-tag type='warning' size='mini' v-else>三级</el-tag>
        </template>、
        <!-- 操作 -->
        <template slot='opt'>
          <el-button type='primary' icon='el-icon-edit' size='mini'>编辑</el-button>
          <el-button type='danger' icon='el-icon-delete' size='mini'>删除</el-button>
        </template>
      </tree-table>

      <!-- 分页站位 -->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='querInfo.pagenum'
        :page-sizes='[3, 5, 10, 15]'
        :page-size='querInfo.pagesize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'
      ></el-pagination>
    </el-card>

    <!-- 卡片式图对话框 -->
    <el-dialog title='添加分类' :visible.sync='addCateDialogVisible' width='50%' @close="addCateDialogClose">
      <!-- 添加分类的表单 -->
      <el-form
        :model='addCateForm'
        :rules='addCateFormRules'
        ref='addcateFormRef'
        label-width='100px'
      >
        <el-form-item label='分类名称' prop='name'>
          <el-input v-model='addCateForm.cat_name'></el-input>
        </el-form-item>
        <el-form-item label='父级分类'>
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            clearable
            v-model='selectedKeys'
            :options='parentCateList'
            :props='cascaderProps'
            @change='parentCateChanged'
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addCateDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='addCate'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        tyep: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cateList: [],
      // 总数据层数
      total: 0,
      // table指定定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        //   表示当前列定义为模板列
        type: 'template',
        //   表示当前这一列使用模板名称
        template: 'isok'
      },
      {
        label: '排序',
        //   表示当前列定义为模板列
        type: 'template',
        //   表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        //   表示当前列定义为模板列
        type: 'template',
        //   表示当前这一列使用模板名称
        template: 'opt'
      }],
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认添加一级
        cat_level: 0
      },
      //   添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //   父级分类列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true // 是否允许父级选中
      },
      //   选中的父级分类id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('查询数据失败！')
      }
      // 数据列表赋值
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize发生改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击出现对话框
    showAddCatDialog() {
      // 先获取父级分类数据列表
      this.getParentCateList()
      // 在展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 大于0 选中了父级分类 反之没有选中
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length

        return
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加分类
    async addCate() {
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      if (res.meta.status !== 201) {
        this.$message.error('添加分类失败！')
        this.addCateDialogVisible = false
        return
      }
      this.$message.success('添加分类成功！')
      this.addCateForm = {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认添加一级
        cat_level: 0
      }
      this.getCateList()
      this.selectedKeys = []
      this.addCateDialogVisible = false
    },
    // 监听对话框关闭事件
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 14px;
}
</style>
