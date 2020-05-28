<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" inline>
        <el-form-item label="用户名称" prop="username">
          <el-input style="width:150px" v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input style="width:150px" v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select placeholder="请选择" v-model="searchForm.role_id" style="width:150px">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">搜索</el-button>
          <el-button @click="creale" type="default">清除</el-button>
          <el-button @click="add" type="primary">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card shadow="always" style="margin-top:20px">
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话" ></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:red">禁用</span>
            <span v-if="scope.row.status === 1" style="color:#6ac144">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row)" type="primary">编辑</el-button>
            <!-- <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button> -->
            <el-button
              @click="changeStatus('/user/status',scope.row.id)"
              :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button>
            <el-button @click="remove('/user/remove',scope.row.id)" type="default">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <UserEdit ref="userEditRef"></UserEdit>
  </div>
</template>

<script>
//引入 user-or-update.vue子组件
import UserEdit from "./user-add-or-pudate";
import common from '@/mixins/common'
export default {
  mixins:[
    common
  ],
  components: {
    UserEdit
  },
  name: "user",
  data() {
    return {
      searchForm: {
        username: "", //用户名称
        email: "", //邮箱
        role_id: "" // 角色数字 1、超级管理员 2管理员、3老师、 4学生
      },
      page: 1, // 查询时候的页码
      limit: 1, // 查询时候的页容量(每页查询多少条)
      userList: [], // 展示用户列表所需要的数据
      total: 0 // 总条数，分页时候用得着
    };
  },
  created() {
    this.getUserListData();
  },

  methods: {
    //搜索
    search() {
      this.page = 1;
      this.getUserListData();
    },
    creale() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    async getUserListData() {
      const res = await this.$axios.get("/user/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      console.log(res);
      if (res.data.code === 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 分页条的页容量发生了改变
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
     // 分页条的当前页发生了改变
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserListData();
    },
    //更改当前状态
    // async changeStatus(id) {
    //   const res = await this.$axios.post("/user/status", { id });
    //   //console.log(res);
    //   if (res.data.code === 200) {
    //     this.$message({
    //       message: "更改状态成功~",
    //       type: "success"
    //     });

    //     //重新查询
    //     this.search();
    //   }
    // },
    // deleteUser(id, username) {
    //   this.$confirm(`确定删除 ${username} 该用户吗？`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(async () => {
    //       const res = await this.$axios.post("/user/remove", { id });
    //       if (res.data.code === 200) {
    //         this.$message({
    //           message: "删除成功~",
    //           type: "success"
    //         });
    //         // 重新查询
    //         this.search();
    //       }
    //     })
    //     .catch(() => {});
    // },
    add() {
      //重置addForm
      this.$refs.userEditRef.addForm = {
        username: "", //用户名
        email: "", //邮箱
        phone: "", //手机号
        role_id: "", //角色
        status: "", //状态
        remark: "" //备注
      };
      //清楚校验规则
      this.$nextTick(() =>{
        //dialog中的form表单渲染完毕后,会自动执行改回调函数
        this.$refs.userEditRef.$refs.addFormRef.clearValidate()
      })
      // 让新增用户的对话框显示出来
      this.$refs.userEditRef.dialogVisible = true;
      this.$refs.userEditRef.mode = "add";
    },
    //编辑用户
    editUser(row){
      // 让新增用户的对话框显示出来
      this.$refs.userEditRef.dialogVisible = true;
      this.$refs.userEditRef.mode = "edit";
      // this.$refs.userEditRef.addForm = JSON.parse(JSON.stringify(row))
      this.$refs.userEditRef.addForm = {...row}
      //清楚校验规则
      this.$nextTick(() =>{
        //dialog中的form表单渲染完毕后,会自动执行改回调函数
        this.$refs.userEditRef.$refs.addFormRef.clearValidate()
      })
    }
  }
};
</script>

<style>
</style>