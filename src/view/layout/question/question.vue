<template>
  <div>
    <el-card shadow="always">
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="50px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subject">
              <template>
                <el-select v-model="searchForm.subject" placeholder="请选择" style="width:150px">
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
              <el-select v-model="searchForm.step" placeholder="请选择阶段" style="width:150px">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业" style="width:150px">
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
              <el-select v-model="searchForm.type" placeholder="请选择题型" style="width:150px">
                <el-option
                  v-for="(value,name) in typeObj"
                  :key="name"
                  :label="value"
                  :value="+name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度" style="width:150px">
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
              <el-input v-model="searchForm.username" style="width:150px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <template>
                <el-select v-model="searchForm.status" placeholder="请选择状态" style="width:150px">
                  <el-option label="禁用" :value="0"></el-option>
                  <el-option label="启用" :value="1"></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <template>
                <el-date-picker
                  v-model="searchForm.create_date"
                  type="date"
                  placeholder="选择日期"
                  style="width:150px"
                ></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input style="width:388px" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button @click="search" type="primary">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button @click="add" type="primary">+新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:15px">
      <template>
        <el-table :data="questionList" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="题目" width="280">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column label="学科.阶段" prop="subject_name.step" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.subject_name}}.{{stepObj[scope.row.step]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="题型">
            <template slot-scope="scope">
              <span>{{typeObj[scope.row.type]}}</span>
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
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-row>
                <el-button @click="questionEdit(scope.row)" type="primary">编辑</el-button>
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
      <div style="margin-top:15px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <questionAdd
      ref="questionAdd"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
    ></questionAdd>
  </div>
</template>

<script>
import questionAdd from "./question-add-or-pudate";
export default {
  components: {
    questionAdd
  },
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
      limit: 1, //每页显示的条数
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
      //console.log(res);
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
    //每页多少条
    handleSizeChange(val) {
      this.limit = val;
      this.search();
    },
    //当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getQuestionList();
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
    },
    //新增
    add() {
      this.$refs.questionAdd.mode = "add";
      this.$refs.questionAdd.questionForm = {
        // 这个里面的所有值，将来是传递给服务器的
        subject: "", //学科
        step: "", //阶段
        enterprise: "", //企业
        city: [], //城市
        type: 1, //题型
        difficulty: 1, //难度
        title: "", // 标题
        single_select_answer: "", // 单选答案
        multiple_select_answer: [], // 多选答案
        short_answer: "", // 简答答案
        answer_analyze: "", // 答案解析
        video: "", //视频路径
        remark: "", // 答案备注
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ]
      };
      this.$refs.questionAdd.dialogVisible = true;
    },
    //编辑
    questionEdit(row) {
      this.$refs.questionAdd.mode = "edit";
      this.$refs.questionAdd.questionForm = JSON.parse(JSON.stringify(row));
      if (row.city) {
        this.$refs.questionAdd.questionForm.city = row.city.split(",");
      } else {
        this.$refs.questionAdd.questionForm.city = [];
      }
      if (row.multiple_select_answer) {
        this.$refs.questionAdd.questionForm.multiple_select_answer = row.multiple_select_answer.split(",");
      } else {
        this.$refs.questionAdd.questionForm.multiple_select_answer = [];
      }
      this.$refs.questionAdd.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>