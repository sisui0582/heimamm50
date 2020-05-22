<template>
  <div>
    <el-card shadow="always">
      <el-form :model="enterpriseForm" label-width="80px" ref="enterpriseFormRef" inline>
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="enterpriseForm.eid" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseForm.name" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="enterpriseForm.username" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="enterpriseForm.status" style="width:150px">
              <el-option label="禁用" :value="0"></el-option>
              <el-option label="启用" :value="1"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-button @click="search" type="primary">搜索</el-button>
            <el-button @click="clear">清除</el-button>
            <el-button @click="add" type="primary">+新增企业</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:15px">
      <template>
        <el-table :data="enterpriseList" style="width: 100%">
          <el-table-column label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="企业编号" prop="eid"></el-table-column>
          <el-table-column label="企业名称" prop="name"></el-table-column>
          <el-table-column label="创建者" prop="username"></el-table-column>
          <el-table-column label="创建日期" prop="create_time"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status === 0 ? 'red' : '#67c23a'}"
              >{{scope.row.status === 0 ? '禁用' :'启用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-row>
                <el-button @click="edmie(scope.row)" type="primary">编辑</el-button>
                <el-button
                  @click="changeStatus(scope.row.id)"
                  :type="scope.row.status === 0 ? 'success' : 'info'"
                >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button>
                <el-button @click="defaultName(scope.row.id,scope.row.name)" type="default">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:15px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[2, 3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <enterpriseEdit ref="enterpriseEdit"></enterpriseEdit>
  </div>
</template>

<script>
//导入子组件
import enterpriseEdit from "./enterprise-add-pudata";
export default {
  components: {
    enterpriseEdit
  },
  name: "enterprise",
  data() {
    return {
      enterpriseForm: {
        eid: "", //企业编号
        name: "", //企业名称
        username: "", //创建者
        status: "" //状态
      },
      page: 1, //当前页数
      limit: 2, //当前页面显示条数
      enterpriseList: [], //企业数据
      total: 0 //总条数
    };
  },
  created() {
    this.getEnterprise();
  },
  methods: {
    async getEnterprise() {
      const res = await this.$axios.get("/enterprise/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.enterpriseForm
        }
      });
      //console.log(res);
      if (res.data.code === 200) {
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    //搜索
    search() {
      this.page = 1;
      //从新加载
      this.getEnterprise();
    },
    //清除
    clear() {
      this.$refs.enterpriseFormRef.resetFields();
      //重新加载
      this.search();
    },
    //每页条数
    handleSizeChange(val) {
      this.limit = val;
      //从新加载
      this.search();
    },
    //当前页
    handleCurrentChange(val) {
      this.page = val;
      //重新加载
      this.getEnterprise();
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/enterprise/status", { id });
      //console.log(res);
      if (res.data.code === 200) {
        this.$message({
          message: "状态更改成功",
          type: "success"
        });
        //重新加载页面
        this.getEnterprise();
      }
    },
    defaultName(id, name) {
      this.$confirm(`确定删除 ${name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/enterprise/remove", { id });
          console.log(res);
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            //刷新页面
            this.getEnterprise();
          }
        })
        .catch(() => {});
    },
    //新增
    add() {
      //重置子组件的editForm
      this.$refs.enterpriseEdit.editForm = {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //企业备注
      },
      this.$refs.enterpriseEdit.dialogVisible = true;
      this.$refs.enterpriseEdit.mode = "add";
      this.$nextTick(() => {
        this.$refs.enterpriseEdit.$refs.editFormRef.clearValidate();
      });
    },
    //编辑
    edmie(row){
      this.$refs.enterpriseEdit.dialogVisible = true;
      this.$refs.enterpriseEdit.mode = "edit";
      this.$refs.enterpriseEdit.editForm = {...row}
      this.$nextTick(() => {
        this.$refs.enterpriseEdit.$refs.editFormRef.clearValidate();
      });
    }
  }
};
</script>

<style>
</style>