<template>
  <div class="userEdit">
    <el-dialog :visible.sync="dialogVisible" width="477px">
      <div slot="title" class="title">{{mode === 'add' ? '新增学科' : '编辑学科'}}</div>
      <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="editForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="editForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="editForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sunmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: "", //add新增,edit编辑
      dialogVisible: false, //是否显示
      editForm: {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      },
      rules: {
        //编号
        rid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  watch: {
      dialogVisible(newValue) {
      // if (newValue) {
      //   this.$nextTick(() => {
      //     this.$refs.enterpriseFormRef.clearValidate();
      //   });
      // }
      if (!newValue) {
        this.$refs.enterpriseFormRef.clearValidate();
      }
    },
  },
  methods: {
    //新增
    submit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;

        let res = null;
        if (this.mode === "add") {
          res = await this.$axios.post("/subject/add", this.editForm);
        } else {
          //编辑
          res = await this.$axios.post("/subject/edit", this.editForm);
        }

        if (res.data.code === 200) {
          this.$message({
            message: this.mode === "add" ? "新增成功" : "编辑成功",
            type: "success"
          });
          //关闭当前对话框
          this.dialogVisible = false;
          //刷新页面
          this.$parent.search();
        } else {
          this.$message.error(res.data.message);
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