<template>
  <div class="userEdit">
    <el-dialog :visible.sync="dialogVisible" width="477px" center>
      <div slot="title" class="title">{{mode === 'add' ? '新增企业' : '编辑企业'}}</div>
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="editForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="editForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="editForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "add",
  data() {
    return {
      dialogVisible: false, //是否显示
      mode: "", //是 新增,还是 编辑
      editForm: {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //企业备注
      },
      //校验
      rules: {
        eid: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        remark: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    //新增
    submit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;

        let res = null;
        if (this.mode === "add") {
          res = await this.$axios.post("/enterprise/add", this.editForm);
          console.log(res);
        } else {
          //编辑
          res = await this.$axios.post("/enterprise/edit", this.editForm);
        };
        if (res.data.code === 200) {
          this.$message({
            message: this.mode === 'add' ? '新增成功' : '编辑成功',
            type: "success"
          });
          //关闭当前对话框
          this.dialogVisible = false;
          //刷新页面
          this.$parent.search();
        } else {
          this.$message.error(`${res.data.message}`);
        }
      });
    }
  }
};
</script>

<style lang="less">
.userEdit {
  .title {
    height: 53px;
    text-align: center;
    color: #fff;
    background-color: #0e9cfa;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>