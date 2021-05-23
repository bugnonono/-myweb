<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="parentCurrentPage"
      :page-sizes="parentPageSizes"
      :page-size="parentPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parentTotal"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSizes: [],
      pageSize: 5,
    };
  },
  props: {
    parentCurrentPage: {
      type: Number,
      default: 1,
    },
    parentPageSizes: {
      type: Array,
      default: () => {
        return [5, 10, 15, 20];
      },
    },
    parentPageSize: {
      type: Number,
      default: 5,
    },
    parentTotal: {
      type: Number,
    },
  },
  created() {
    this.change();
  },
  methods: {
    //  修改参数
    change() {
      this.currentPage = this.parentCurrentPage;
      this.pageSizes = this.parentPageSizes;
      this.pageSize = this.parentPageSize;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      window.sessionStorage.setItem("newSize", newSize);
      this.$emit("parentGetData", this.currentPage, this.pageSize);
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      window.sessionStorage.setItem("newPage", newPage);
      this.$emit("parentGetData", this.currentPage, this.pageSize);
    },
  },
  components: {},
};
</script>

<style scoped></style>
