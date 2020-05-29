<template>
  <div class="questionType">
    <div v-if="questionForm.type == 1">
      <div v-for="item in questionForm.select_options" :key="item.label" class="item">
        <!-- radio -->
        <el-radio
          v-model="questionForm.single_select_answer"
          :label="item.label"
          @change="changeValue"
        >{{item.label}}</el-radio>
        <!-- input -->
        <el-input v-model="item.text"></el-input>
        <!-- 上传的子组件 -->
        <upload style="margin-left:15px;" v-model="item.image"></upload>
      </div>
    </div>
    <div v-if="questionForm.type == 2">
      <div v-for="item in questionForm.select_options" :key="item.label" class="item">
        <!-- checkbox -->
        <el-checkbox
          v-model="questionForm.multiple_select_answer"
          :label="item.label"
          @change="changeValue"
        ></el-checkbox>
        <!-- input -->
        <el-input style="margin-left:15px;" v-model="item.text"></el-input>
        <!-- 上传的子组件 -->
        <upload v-model="item.image"></upload>
      </div>
    </div>
    <div v-if="questionForm.type == 3">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="questionForm.short_answer"
        @change="changeValue"
      ></el-input>
    </div>
  </div>
</template>

<script>
import upload from "./upload-file";
export default {
  components: {
    upload
  },
  name: "QuestionType",
  props: ["questionForm"],
  methods: {
    changeValue(){
      this.$emit('changeValue')
    }
  },
};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>