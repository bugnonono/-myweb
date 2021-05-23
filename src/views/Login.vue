<template>
  <el-container>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginFormRef"
      label-width="100px"
      class="login"
    >
      <div class="title">库存管理系统</div>
      <el-form-item label="用户名" prop="userName" class="col-w">
        <el-input
          v-model="loginForm.userName"
          prefix-icon="el-icon-user-solid"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPsw" class="col-w">
        <el-input
          type="password"
          v-model="loginForm.userPsw"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="userCode" class="col-w">
        <el-input
          prefix-icon="el-icon-unlock"
          v-model="loginForm.login_code"
          placeholder="请输入验证码"
        ></el-input>
        <!-- 引入验证码组件 -->
        <div @click="refreshCode()" style="margin: 10px">
          <identify :identifyCode="identifyCode"></identify>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" class="btnlogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog
      title="请选择要进入的应用"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span class="vis">
        <div>
          <img src="../assets/images/system_01.png" alt="" />
          <p>协同管理</p>
        </div>
        <div @click="goHome">
          <img src="../assets/images/system_02.png" alt="" />
          <p>仓储系统</p>
        </div>
        <div>
          <img src="../assets/images/system_03.png" alt="" />
          <p>报表引擎</p>
        </div>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import identify from "../components/identify"; // 引入子元素
export default {
  data: function () {
    return {
      loginForm: {
        userName: "",
        userPsw: "",
        login_code: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        userPsw: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      identifyCode: "",
      identifyCodes: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "l",
        "m",
        "n",
      ], //根据实际需求加入自己想要的字符
    };
  },
  components: {
    identify,
  },
  mounted: function () {
    this.refreshCode();
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("用户名或者密码错误");
          return false;
        }
        //  验证码校验
        if (this.identifyCode !== this.loginForm.login_code) {
          this.$message.error("验证码错误");
          return false;
        }
        var loginForm = this.$qs.stringify(this.loginForm);
        const { data: res } = await this.$http.post("sys/login", loginForm);

        //  将token存到本地sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 存储登录用的用户名
        window.sessionStorage.setItem("userName", res.data.name);
        //储存ID
        window.sessionStorage.setItem("userId", res.data.id);
        window.sessionStorage.setItem("nickName", res.data.nickName);
        //  this.$router.push('/home')
        this.dialogVisible = true;
      });
    },
    goHome() {
      this.$message({
        message: "登陆成功",
        type: "success",
      });
      this.$router.push("/welcome");
    },
    // 生成随机数
    randomNum(min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 更新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 随机生成验证码字符串
    makeCode(data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length - 1)
        ];
      }
    },
  },
};
</script>

<style scoped>
.el-container {
  widows: 100%;
  height: 100%;
  background-image: url(../assets/images/bj.jpg);
  position: relative;
}
.el-form{
  width: 30vw;
  height: 20vw;
  box-sizing: border-box;
  min-width: 500px;
  min-height: 500px;
  padding: 80px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.5);
}
.title{
  font-size: 40px;
  color:#fff;
  text-align: center;
  line-height: 150px;
  margin-top: -80px;
}
.vis{
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
}
.vis p{
  text-align: center;
  font-size: 16px;
  line-height: 30px;
}
</style>
