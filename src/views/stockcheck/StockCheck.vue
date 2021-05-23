<template>
  <div class="container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
      <el-breadcrumb-item>盘点计划</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" plain size="medium" @click="showAddStockOut"
          >新增盘点单</el-button
        >
      </el-row>
      <el-table
        :data="stockOutTableData"
        border
        stripe
        hover
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" fixed width="150">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" fixed width="150">
        </el-table-column>
        <el-table-column prop="code" label="单据编号" width="150">
        </el-table-column>
        <el-table-column prop="makerName" label="制单人" width="150">
        </el-table-column>
        <el-table-column prop="orderDate" label="制单时间" width="150">
        </el-table-column>
        <el-table-column prop="storeId" label="仓库编号" width="150">
        </el-table-column>
        <el-table-column prop="updateDate" label="更新时间" width="150">
        </el-table-column>
        <el-table-column label="单据状态" width="150">
          <template slot-scope="scope">
            <div>
              <el-tag type="danger" round v-if="scope.row.status === 1"
                >未审核</el-tag
              >
              <el-tag type="primary" round v-else>审核</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核" width="150">
          <template slot-scope="scope">
            <div>
              <el-button
                type="success"
                size="medium"
                round
                @click="checkOrder(scope.row.id)"
                >审核</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="反审核" width="150">
          <template slot-scope="scope">
            <el-button
              type="danger"
              round
              size="small"
              @click="uncheckOrder(scope.row.id)"
              >反审核</el-button
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="editOrderVisible(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeStockOut(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
        :parentCurrentPage="pages.page"
        :parentPageSizes="pages.pages"
        :parentPageSize="pages.rows"
        :parentTotal="pages.count"
        @parentGetData="getStockOutData"
      ></my-pagination>
      <el-dialog
        title="添加盘点单"
        :visible.sync="stockOutDialogVisible"
        width="50%"
        @close="cancelStockOut"
      >
        <span>
          <el-form
            :model="stockOutForm"
            :rules="stockOutrules"
            ref="stockOutRef"
            label-width="100px"
          >
            <el-form-item label="盘点单号" prop="code">
              <el-input v-model="stockOutForm.code"></el-input>
            </el-form-item>
            <el-form-item label="仓库ID" prop="storeId">
              <el-select v-model="stockOutForm.storeId">
                <el-option label="上海仓库" value="1"></el-option>
                <el-option label="北京仓库" value="2"></el-option>
                <el-option label="华北仓库" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制单人ID" prop="makerName">
              <el-input v-model="makerName" disabled></el-input>
            </el-form-item>
            <el-form-item label="制单时间" prop="orderDate">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="stockOutForm.orderDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelStockOut">取 消</el-button>
          <el-button type="primary" @click="addStockOut">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 抽屉 -->
      <el-drawer
        title="编辑盘点单"
        :visible.sync="stockOutVisible"
        :direction="direction"
        :before-close="handleClose"
      >
        <span>
          <el-form
            :model="editOrderList"
            :rules="editOrderListRules"
            ref="editOrderListRef"
            label-width="100px"
          >
            <el-form-item label="订单ID" prop="id">
              <el-input v-model="editOrderList.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单编号" prop="code">
              <el-input v-model="editOrderList.code"></el-input>
            </el-form-item>
            <el-form-item label="制单人ID" prop="makerId">
              <el-input v-model="editOrderList.makerId"></el-input>
            </el-form-item>
            <el-form-item label="制单时间" prop="orderDate">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="editOrderList.orderDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="仓库ID" prop="storeId">
              <el-input v-model="editOrderList.storeId"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="editStockOut">确 定</el-button>
        </span>
      </el-drawer>
  </div>
</template>

<script>
import MyPagination from "../../components/Pagination.vue";
export default {
  data:function() {
    return {
      stockOutVisible: false,
      direction: "rtl",
      formInLine: {
        code: "",
        time: [],
        maker: "",
        status: "",
        storeId: "",
      },
      pages: {
        count: 0, //总记录的条数
        page: parseInt(window.sessionStorage.getItem("newSize")) || 1, //第几页
        rows: parseInt(window.sessionStorage.getItem("newSize")) || 5, //显示条数
        pages: [5, 10, 15, 20],
      },
      stockOutTableData: [],
      stockOutDialogVisible: false,
      stockOutForm: {
        code: "",
        storeId: "",
        makerId: window.sessionStorage.getItem("userId"),
        orderDate: "",
      },
      makerName: window.sessionStorage.getItem("nickName"),
      stockOutrules: {
        code: [
          { required: true, message: "请输入盘点单号", trigger: "blur" },
          {
            min: 8,
            max: 15,
            message: "长度在 8 到 15 个字符",
            trigger: "blur",
          },
        ],
        stocskId: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        makerId: [
          { required: true, message: "请输入制单人ID", trigger: "blur" },
        ],
        orderDate: [
          { required: true, message: "请输入仓库ID", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      editOrderList: {
        code: "",
        id: 0,
        makerId: 1,
        orderDate: "",
        storeId: 1,
      },
      editOrderListRules: {
        code: [
          { required: true, message: "请输入盘点单号", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        stocskId: [
          { required: true, message: "请选择仓库", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        makerId: [
          { required: true, message: "请输入制单人ID", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        orderDate: [
          { required: true, message: "请输入仓库ID", trigger: "blur" },
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
  components: {
    MyPagination,
  },
  methods: {
    async getStockOutData(page, rows) {
      //  设置盘点请求参数
      let { code, time, maker, status, storeId } = this.formInLine;
      let params = {
        code,
        startDate: time ? time[0] : "",
        endDate: time ? time[1] : "",
        maker,
        status,
        storeId,
        page: this.pages.page,
        rows: this.pages.rows,
      };
      params.page =
        page ||
        parseInt(window.sessionStorage.getItem("newPage")) ||
        this.pages.page;
      params.rows =
        rows ||
        parseInt(window.sessionStorage.getItem("newSize")) ||
        this.pages.rows;
      params = this.$qs.stringify(params);
      const { data: res } = await this.$http.get(`stockcheck/list?${params}`);
      this.stockOutTableData = res.data.data;

      this.pages.count = res.data.page.count;
    },
    async removeStockOut(id) {
      //  console.log(id)
      //  删除前去确认
      // 返回promise对象，优化异步函数
      const confirmResult = await this.$confirm(
        "此操作将永久删除该盘点单, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果确认删除返回confirm字符串，点击取消返回cancel
      // 会触发$confirm中的错误，使用catch捕获错误
      if (confirmResult !== "confirm") {
        return this.$message("取消删除");
      }
      var params = {
        id,
      };
      params = this.$qs.stringify(params);
      const res = await this.$http.delete("stockcheck?" + params);
      if (res.data.code === 1) {
        this.$message({
          message: "删除盘点单成功",
          type: "success",
        });
        this.getStockOutData();
      } else {
        this.$message({
          message: "删除盘点单失败",
          type: "error",
        });
      }
    },
    showAddStockOut() {
      this.stockOutDialogVisible = true;
    },
    cancelStockOut() {
      this.$refs.stockOutRef.resetFields();
      this.stockOutDialogVisible = false;
    },
    addStockOut() {
      this.$refs.stockOutRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("添加失败");
          return false;
        }
        let stockOutForm = this.$qs.stringify(this.stockOutForm);
        const { data: res } = await this.$http.post("stockcheck", stockOutForm);
        if (res.code === 1) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.stockOutDialogVisible = false;
          this.getStockOutData();
        } else {
          this.$message({
            message: "添加失败",
            terrorype: "error",
          });
        }
      });
    },
    handleSizeChange(newSize) {
      this.pages.rows = newSize;
      window.sessionStorage.setItem("newSize", newSize);
      if (Math.ceil(this.parentTotal / newSize) > this.currentPage) {
        this.$emit("parentGetData", this.currentPage, this.pageSize);
      } else {
        this.$emit("parentGetData", 1, this.pageSize);
      }
      this.getStockOutData();
    },
    handleCurrentChange(newPage) {
      this.pages.page = newPage;
      this.getStockOutData();
    },
    async checkOrder(id) {
      let params = {
        id,
      };
      params = this.$qs.stringify(params);
      const { data: res } = await this.$http.put("stockcheck/check?" + params);
      //  console.log(res)
      if (res.code === 1) {
        this.$message({
          message: "审核成功",
          type: "success",
        });
        this.getStockOutData();
      } else {
        this.$message({
          message: "审核失败",
          type: "error",
        });
      }
    },
    async uncheckOrder(id) {
      let params = { id };
      params = this.$qs.stringify(params);
      const { data: res } = await this.$http.put(
        "stockcheck/uncheck?" + params
      );
      if (res.code === 1) {
        this.$message({
          message: "反审核成功",
          type: "success",
        });
        this.getStockOutData();
      } else {
        this.$message({
          message: "反审核失败",
          type: "error",
        });
      }
    },
    goDetail(id) {
      this.$router.push("/stockcheck/detail/" + id);
    },
    editOrderVisible(id) {
      this.stockOutVisible = true;
      this.editOrderList.id = id;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async editStockOut() {
      // 发请求--编辑单据
      let params = this.editOrderList;
      params = this.$qs.stringify(params);

      const { data: res } = await this.$http.post("stockcheck/update", params);

      if (res.code === 1) {
        this.$message({
          message: "修改订单成功",
          type: "success",
        });
        this.stockOutVisible = false;
        this.getStockOutData();
      } else {
        this.$message({
          message: "修改订单失败",
          type: "error",
        });
      }
    },
  },
  created: function() {
    this.getStockOutData();
  },
};
</script>

<style scoped></style>
