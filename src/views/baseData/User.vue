<template>
  <div class="container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="removeManyUser"
          >批量删除</el-button
        >
        <el-button type="primary" @click="addUser">添加</el-button>
        <el-input placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
      <el-table
        :data="userList"
        stripe
        height="600px"
        max-height="600px"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%"
        ref="userListTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="id"
          fixed
          label="用户ID"
          width="80px"
        ></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <span v-if="scope.row.role == 0">普通用户</span>
            <span v-else>超级管理员</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updateDate"
          label="更新时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加用户" :visible.sync="addUserVisible" width="40%">
        <span>
          <el-form
            :model="addUserForm"
            :rules="addUserrules"
            ref="addUserRef"
            label-width="100px"
          >
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="addUserForm.nickName"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addUserForm.userName"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addUserHandler">确 定</el-button>
          <el-button @click="addUserCancel">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      userList: [],
      addUserVisible: false,
      addUserForm: {
        nickName: "",
        userName: "",
      },
      addUserrules: {
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      multipleSelection: [],
    };
  },
  computed: {
    total() {
      return this.userList.length;
    },
  },
  created: function () {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const { data: res } = await this.$http.get("user/getAll");
      this.userList = res.data;
    },
    addUser() {
      this.addUserVisible = true;
    },
    addUserCancel() {
      this.$refs.addUserRef.resetFields();
      this.addUserVisible = false;
    },
    async addUserHandler() {
      //  添加用户请求
      var addUserForm = this.$qs.stringify(this.addUserForm);
      const { data: res } = await this.$http.post("user/add", addUserForm);
      if (res.code === 0) {
        this.$message({
          message: res.message,
          type: "success",
        });
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
      }
      this.addUserCancel();
      this.getUsers();
    },
    removeUser(id) {
      //  删除用户
      // console.log(id)
      this.$confirm("确认要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("user/del/" + id);
          if (res.code === 1) {
            this.getUsers();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    removeManyUser() {
      var flag = true;
      this.$confirm("确认要删除多个用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //  批量删除
          this.multipleSelection.forEach(async (item) => {
            // item.id
            const { data: res } = await this.$http.delete(
              "user/del/" + item.id
            );
            if (res.code !== 1) {
              flag = false;
              return;
            }
          });
          if (flag === true) {
            this.getUsers()
            this.$message({
              
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  margin-left: 20px;
  display: inline-block;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
