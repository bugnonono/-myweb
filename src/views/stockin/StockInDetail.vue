<template>
  <div>
    <el-card>
      <el-table :data="stockInDetail" border stripe hover style="width: 100%">
        <el-table-column prop="id" label="ID" width="150"> </el-table-column>
        <el-table-column prop="itemId" label="品相类别" width="150">
        </el-table-column>
        <el-table-column prop="itemName" label="名称" width="150">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="150">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data:function() {
    return {
      stockInDetail: [],
    };
  },
  components: {},
  methods: {
    async getStockInData() {
      let params = { id: this.$route.params.id };
      params = this.$qs.stringify(params);
      const { data: res } = await this.$http.get(
        "stockin/detail/list?" + params
      );
      console.log(res);
      if (res.code === 1) {
        this.stockInDetail = res.data;
      }
    },
  },
  created: function() {
    this.getStockInData();
  },
};
</script>

<style scoped></style>
