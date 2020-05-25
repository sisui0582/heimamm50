<template>
  <div>
    <el-card shadow="always">
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="50px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subject">
              <template>
                <el-select v-model="searchForm.subject" placeholder="请选择">
                  <el-option
                    v-for="item in subjectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型" prop="type">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者" prop="username">
              <el-input v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <template>
                <el-select v-model="searchForm.status" placeholder="请选择状态">
                  <el-option label="禁用" :value="0"></el-option>
                  <el-option label="启用" :value="1"></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <template>
                <el-date-picker v-model="searchForm.create_date" type="date" placeholder="选择日期"></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input style="width:500px" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button @click="search" type="primary">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary">+新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:15px">
      <template>
        <el-table :data="questionList" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="题目">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column label="学科,阶段" prop="subject_name,step">
            <template slot-scope="scope">
              {{scope.row.subject_name}}
              <span v-if="scope.row.step === 1">,初级</span>
              <span v-if="scope.row.step === 2">,中级</span>
              <span v-if="scope.row.step === 3">,高级</span>
            </template>
          </el-table-column>
          <el-table-column label="题型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">单选</span>
              <span v-if="scope.row.type === 2">多选</span>
              <span v-if="scope.row.type === 3">简答</span>
            </template>
          </el-table-column>
          <el-table-column label="企业" prop="enterprise_name"></el-table-column>
          <el-table-column label="创建者" prop="username"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status === 0 ? 'red' : '#67c23a'}"
              >{{scope.row.status === 0 ? '禁用' : '启用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="访问量" prop="is_del"></el-table-column>
          <el-table-column label="访问量" width="280">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary">编辑</el-button>
                <el-button
                  @click="changeStatus(scope.row.id)"
                  :type="scope.row.status === 0 ? 'success' : 'info'"
                >{{scope.row.status === 0 ? '启用' : '禁用'}}</el-button>
                <el-button @click="remove(scope.row.id,scope.row.title)" type="primary">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      subjectList: [], //学科列表
      enterpriseList: [], //企业列表
      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" }, //难度
      searchForm: {
        //搜索的时候传递给后台
        subject: "", // 学科
        enterprise: "", // 企业
        step: "", //阶段
        type: "", //题型
        difficulty: "", //难度
        username: "", //作者
        status: "", //状态
        create_date: "", //日期
        title: "" //标题
      },
      page: 1, //页码
      limit: 2, //每页显示的条数
      questionList: [], //题库列表
      total: 0 //总条数
    };
  },
  created() {
    // 获取所有的学科
    this.getSubjectListData();
    // 获取所有的企业
    this.getEnterpriseListData();
    //获取题库列表
    this.getQuestionList();
  },
  methods: {
    async getSubjectListData() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code === 200) {
        this.subjectList = res.data.data.items;
      }
    },
    async getEnterpriseListData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code === 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    //获取题库列表
    async getQuestionList() {
      const res = await this.$axios.get("/question/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      console.log(res);
      if (res.data.code === 200) {
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    search() {
      this.page = 1;
      this.getQuestionList();
    },
    clear() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    //删除
    remove(id, title) {
      this.$confirm(`确定删除${title}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/question/remove", { id });
          if (res.data.data === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //状态
    async changeStatus(id) {
      const res = await this.$axios.post("/question/status", { id });
      if (res.data.code === 200) {
        this.$message({
          type: "success",
          message: "状态修改成功"
        });
        this.getQuestionList();
      }
    }
  }
};
</script>

<style>
</style>