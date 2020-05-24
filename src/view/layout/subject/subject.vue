<template>
  <div>
    <el-card shadow="always">
      <el-form ref="subjectFormRef" :model="subjectForm" label-width="80px" inline>
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="subjectForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="subjectForm.status">
              <el-option label="禁用" :value="0"></el-option>
              <el-option label="启用" :value="1"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-button @click="search" type="primary">搜索</el-button>
            <el-button @click="clear">清除</el-button>
            <el-button @click="addSubject" type="primary">+新增学科</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:15px">
      <template>
        <el-table :data="subjectList" style="width: 100%">
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="学科编号" prop="rid"></el-table-column>
          <el-table-column label="学科名称" prop="name"></el-table-column>
          <el-table-column label="简称" prop="short_name"></el-table-column>
          <el-table-column label="创建者" prop="username"></el-table-column>
          <el-table-column label="创建日期" prop="create_time"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status === 0 ? 'red' : '#67c23a'}"
              >{{scope.row.status === 0 ? '禁用' : '启用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-row>
                <el-button @click="subjectEdit(scope.row)" type="primary">编辑</el-button>
                <el-button
                  @click="changeStatus(scope.row.id)"
                  :type="scope.row.status === 0 ? 'success' : 'info'"
                >{{scope.row.status === 0 ? '启用' : '禁用'}}</el-button>
                <el-button @click="remoseSubject(scope.row.id,scope.row.name)" type="primary">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:15px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 子组件 -->
    <addSubject ref="addSubject"></addSubject>
  </div>
</template>

<script>
import addSubject from "./subiect-add-or-pudate";
export default {
  components: {
    addSubject
  },
  data() {
    return {
      subjectForm: {
        rid: "", //学科编号
        name: "", //学科名称
        username: "", //创建者
        status: "" //状态
      },
      page: 1, //当前页码
      limit: 2, //当前页面显示的条数
      subjectList: [], //学科列表的信息
      total: 0 //总条数
    };
  },
  created() {
    this.getSubjectList();
  },
  methods: {
    //获取学科信息
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.subjectForm
        }
      });
      console.log(res);
      if (res.data.code === 200) {
        this.subjectList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    //搜索
    search() {
      this.page = 1;
      this.getSubjectList();
    },
    //清除
    clear() {
      this.$refs.subjectFormRef.resetFields();
      this.search();
    },
    //每页条数
    handleSizeChange(val) {
      this.limit = val;
      this.search();
    },
    //当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getSubjectList();
    },
    //更改状态
    async changeStatus(id) {
      const res = await this.$axios.post("/subject/status", { id });
      if (res.data.code === 200) {
        this.$message({
          message: "更改成功",
          type: "success"
        });
        this.getSubjectList();
      }
    },
    //删除
    remoseSubject(id, name) {
      this.$confirm(`此操作将会删除${name}文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/subject/remove", { id });
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getSubjectList();
          }
        })
        .catch(() => {});
    },
    //新增
    addSubject() {
      (this.$refs.addSubject.editForm = {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      }),
        (this.$refs.addSubject.mode = "add");
      this.$refs.addSubject.dialogVisible = true;
    },
    //编辑
    subjectEdit(row) {
      this.$refs.addSubject.mode = "add";
      this.$refs.addSubject.dialogVisible = true;
      this.$refs.addSubject.editForm = {...row};
    }
  }
};
</script>

<style>
