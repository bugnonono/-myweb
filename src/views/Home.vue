<template>
  <el-container class="home-container">
    <el-header height="80px">
      <div class="grid-content bg-purple">
        <i class="el-icon-menu systemSelect" @click="toggleCollapse"></i>
        <p class="logo-txt">仓储管理系统</p>
      </div>
      <div class="grid-content bg-purple">
        <el-tooltip placement="bottom" effect="light">
          <div slot="content" class="pan">
            <p @click="changePwd">修改密码</p>
            <div class="line"></div>
            <p @click="logout">退出登录</p>
          </div>
          <el-button class="btn">{{ nickName }}</el-button>
        </el-tooltip>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          :default-active="activePath"
          background-color="#324157"
          text-color="#fff"
          active-text-color="#0000E3"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-eleme"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              :index="subItem.url"
              v-for="subItem in item.menuList"
              :key="subItem.id"
              @click="savePath(subItem.url)"
              >{{ subItem.name }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePwdDialogVisible"
      width="50%"
    >
      <span>
        <el-form
          :model="changePwdForm"
          :rules="changePwdRules"
          ref="changePwdRef"
          label-width="100px"
        >
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="changePwdForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="changePwdForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="changePwdForm.userName"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePwdCancel">取 消</el-button>
        <el-button type="primary" @click="changePwdHandler">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data:function() {
    return {
      userName: sessionStorage.getItem("userName"),
      nickName: sessionStorage.getItem("nickName"),
      menuList: [],
      activePath: "",
      isCollapse: false,
      changePwdDialogVisible: false,
      changePwdForm: {
        newPwd: "",
        oldPwd: "",
        userName: "",
      },
      changePwdRules: {
        newPwd: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        oldPwd: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created:function(){
    this.getMenuList();
    window.sessionStorage.setItem("activePath", "/user");
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menu/list");

      this.menuList = res.data;
    },
    savePath(path) {
      //  将激活状态的路由path，存入本地存储
      window.sessionStorage.setItem("activePath", path);
      this.activePath = path;
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    changePwd() {
      this.changePwdDialogVisible = true;
    },
    changePwdCancel() {
      this.$refs.changePwdRef.resetFields();
      this.changePwdDialogVisible = false;
    },
    async changePwdHandler() {
      var changePwdForm = this.$qs.stringify(this.changePwdForm);
      // 发请求
      const { data: res } = await this.$http.put(
        "user/changePwd",
        changePwdForm
      );
      this.changePwdDialogVisible = false;
      this.logout();
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100% !important;
}
.el-header {
  background-color: #242f42;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-aside {
  background-color: #324157;
}
.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}
.systemSelect {
  font-size: 30px;
  padding-left: 20px;
}
.logo-txt {
  margin-left: 20px;
}
.logo-wrapper {
  display: flex;
}
.iconfont {
  margin-right: 10px;
}
.btn {
  background-color: rgb(60, 61, 66);
  color: #fff;
}
.pan {
  cursor: pointer;
}
</style>
