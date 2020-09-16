<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->

        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editorRoleOpen(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- s树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 角色编辑 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editorDialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="editor_input">
        <span>
          角色名称:
        </span>
         <el-input v-model="editorName" placeholder="请输入内容"></el-input>
      </div>
      <div class="editor_input">
        <span>
          角色描述:
        </span>
         <el-input v-model="editorMain" placeholder="请输入内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限的对话框
      setRightDialogVisible: false,
      // 控制编辑角色对话框
      editorDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件树形绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的数组
      defKeys: [],
      // 当前即将分配角色的id
      roleId: '',
      // 角色名称
      editorName: '',
      // 角色描述
      editorMain: '',
      // 当前编辑角色id
      editorId: '',
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败');
      }

      this.roleList = res.data;
    },

    // 根据id删除权限
    async removeRightById(role, rightId) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除');
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！');
      }
      role.children = res.data;
    },

    // 展示分配权限弹框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree');

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树失败');
      }

      // 获取到的权限数据
      this.rightsList = res.data;

      // 开始递归调用三级节点
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    // 通过递归形式获取三级节点下的id
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性
      if (!node.children) {
        return arr.push(node.id);
      }

      // 调用递归
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(',');
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败');
      }
      this.$message.success('分配权限成功');

      this.getRolesList();

      this.setRightDialogVisible = false;
    },
    // 删除角色
    async deleteRole(e) {
      const id = e.id;
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
        `roles/` + id
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！');
      }
      this.$message.success('删除角色成功！');
      this.getRolesList();
    },
    // 编辑角色信息 赋值
    async editorRoleOpen(e) {
      this.editorDialogVisible = true;
      this.editorName = e.roleName;
      this.editorMain = e.roleDesc;
      this.editorId = e.id;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 更改角色信息
    async editorDialog() {
      const { data: res } = await this.$http.put(
        `roles/` + this.editorId,
        {
          roleName: this.editorName,
          roleDesc: this.editorMain
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色失败！');
      }
      this.$message.success('编辑角色成功！');
      this.getRolesList();
      this.editorDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.editor_input {
  display: flex;
  margin-top: 10px;

  span {
    display: block;
    width: 100px;
    line-height:40px;
  }
}
</style>
