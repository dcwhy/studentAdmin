<template>
  <div class="student">
    <vue-canvas-nest id="canvasNest" :config="config" />
    <div class="Student-inquiry-box">
      <h1 class="student-Title">学生查询</h1>
      <div>
        <el-input v-model="ruleForm.studentID" placeholder="请输入学号" class="student-input" />
        <el-button type="primary" @click="query"> 查询</el-button>
      </div>
    </div>
    <!-- 抽屉-展示学生个人信息 -->
    <el-drawer title="个人信息" :visible.sync="table" direction="btt" size="50%" style="overflow-y: hidden;">
      <el-table :data="studentData" row-key="index" style="width: 100%" class="information">
        <el-table-column prop="studentID" label="学号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="study" label="学制" />
        <el-table-column prop="classes" label="班级" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="citycenter" label="市场部" />
        <el-table-column prop="chengji" label="已有成绩" />
        <el-table-column prop="graduation" label="还差成绩" />
        <el-table-column prop="failss" label="挂科次数" />
        <el-table-column prop="entryDate" label="入学时间" />
        <el-table-column prop="nativeplace" label="籍贯" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import {
  selectOneStudent
} from '@/api/api.js'
import vueCanvasNest from 'vue-canvas-nest'
export default {
  components: {
    vueCanvasNest
  },
  data() {
    return {
      config: {
        color: '124,252,0',
        count: 150,
        opacity: 0.9,
        zIndex: 0
      },
      ruleForm: {
        studentID: ''
      },
      studentData: [], // 学生数据
      table: false // 控制抽屉显示隐藏
    }
  },
  methods: {
    // 查询
    async query() {
      if (this.ruleForm.studentID === '') {
        return this.$message.error('学号，不能为空')
      }
      const {
        data
      } = await selectOneStudent(this.ruleForm)
      if (data.code === 200) {
        this.studentData = data.data
        this.ruleForm.studentID = ''
        this.table = true
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>

<style lang="scss" >
// scoped
  .el-table td,
  .el-table th {
    text-align: center;
  }

  .student {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    /*  使子项目水平居中 */
    align-items: center;
    /*  使子项目垂直居中 */
    overflow-y: hidden;
    #canvasNest {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
      background: #000;
    }
    .Student-inquiry-box {
      width: 30%;
      height: 200px;
      z-index: 9;

      .student-Title {
        text-align: center;
        font-size: 45px;
        font-family: 华文行楷;
        margin-bottom: 30px;
      }

      .student-input {
        width: 80%;
      }
    }

  }

.el-dialog__wrapper{
  .el-drawer__container,.el-drawer__open{
    // 全部背景
    .el-drawer {
      background: rgba(39, 39, 39, 0.4) !important;
      // 个人信息 与 x
      .el-drawer__header {
        color: #fff;
      }
      // 学生信息
      .el-drawer__body{
        .information {
          background: rgba(39, 39, 39, 0.4);
          thead {
            color: #fff;
          }
          .el-table__row{
                background: rgba(39, 39, 39, 0.4)!important;
                /* 阻止hover效果 */
                pointer-events: none;
                td  {
                  color: #fff;
                }
          }

          .is-leaf{
            border-bottom: none !important;
          }
        }
        .el-table th, .el-table tr{
          background: rgba(39, 39, 39, 0.4)!important;
        }
        .el-table--border::after, .el-table--group::after, .el-table::before{
            background-color: #272727;
        }
      }
    }
  }
}
</style>
