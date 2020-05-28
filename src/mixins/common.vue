<script>
export default {
  methods: {
    async changeStatus(url, id) {
      const res = await this.$axios.post(url, { id });
      if (res.data.code === 200) {
        this.$message({
          message: "更改成功",
          type: "success"
        });
        this.search();
      }
    },
    remove(url, id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post(url, { id });
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search();
          }
        })
        .catch(() => {});
    }
  }
};
</script>