<template>
  <div class="top_option">
    <el-select v-model="value" placeholder="全部" style="margin: 10px 0; width: 100%" @change="changeTeacher">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" style="width: 100%" />
    </el-select>
    <el-table v-loading="listLoading" :data="tableData" style="width: 150%">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input v-if="scope.$index===updateShow" v-model="lecturername" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].lecturername }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <div v-if="scope.$index===updateShow" style="display:flex;">
            <el-radio v-model="lecturersex" label="男">男</el-radio>
            <el-radio v-model="lecturersex" style="margin-left:-15px;" label="女">女</el-radio>
          </div>
          <div v-else>{{ tableData[scope.$index].lecturersex }}</div>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <div v-if="scope.$index===updateShow">
            <el-input v-if="scope.$index===updateShow" v-model="lecturerage" size="mini" placeholder="请输入内容" />
          </div>
          <div v-else>{{ tableData[scope.$index].lecturerage }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入职时间">
        <template slot-scope="scope">
          <div v-if="scope.$index===updateShow">
            <el-select v-model="jointime" size="mini" placeholder="入职时间">
              <el-option size="mini" :value="item.value" />
            </el-select>
          </div>
          <div v-else>{{ tableData[scope.$index].entryDate }}</div>
        </template>
      </el-table-column>
      <el-table-column label="专业">
        <template slot-scope="scope">
          <div v-if="scope.$index===updateShow" style="display:flex;">
            <el-radio v-model="major" label="web">web</el-radio>
            <el-radio v-model="major" style="margin-left:-15px;" label="ui">ui</el-radio>
          </div>
          <div v-else>{{ tableData[scope.$index].major }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="power" align="center">
        <template slot="header" slot-scope="">操作</template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="open(scope)">修改</el-button>
          <el-button size="mini" type="danger" style="margin-top:3px;" @click="deleteOne(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="power" type="primary" class="addLecturer" @click="addLecturers">添加讲师</el-button>
    <!-- 分页模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 7, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="position:fixed;left:250px;bottom:20px;"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入接口函数
import { getTeacherAll, updateTeacher, deleteTeacher } from '../../../api/headAll'

//vuex
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      currentPage: 1, // 默认在第几页
      pageSize: 5, // 每页最大条数
      total: 1, // 根据最大条数切割
      dialogVisible: false, // 弹窗状态
      listLoading: false,
      tableData: [], // 所有讲师
      updateShow: 100000,
      lecturername: '', // 姓名
      lecturersex: '', // 性别
      lecturerage: '', // 年龄
      jointime: '', // 入职时间
      major: '', // 专业
      power: true, // 权限问题
      options: [{
        value: '全部讲师',
        label: '全部讲师'
      }, {
        value: 'web',
        label: 'web'
      }, {
        value: 'ui',
        label: 'ui'
      }],
      value: '全部讲师',
      selectflag: false, // 标识, 用来给查询使用
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    if (this.roles.includes('3')) {
      this.power = false
    }
  },
  mounted() {
      this.getTeacherAlls(this.currentPage,this.pageSize)
  },
  methods: {
    addLecturers() {
      this.$router.push({
        name: 'addLecturers'
      })
    },
    // 下拉框：全部讲师，视觉设计，WEB架构
    async changeTeacher(id) {
      const { data } = await getTeacherAll(this.currentPage,this.pageSize)
      this.tableData = data.data
      var list = []
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].major === id || id === '全部讲师') {
          list.push(this.tableData[i])
        }
      }
      this.tableData = list
    },
    //每页下拉显示数据调用
    handleSizeChange: function (size) {
      this.pageSize = size //每页下拉显示数据
      this.getTeacherAlls(this.currentPage,this.pageSize) 
    },
    //点击第几页调用
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage //点击第几页
      this.getTeacherAlls(this.currentPage,this.pageSize)
    },
    // 获取全部讲师
    async getTeacherAlls(page,pageSize) {
      const { data } = await getTeacherAll(page,pageSize)
      if (data.code === 202) {
        this.getTeacherAlls(this.currentPage,this.pageSize)
      }  else {
        this.tableData = data.data
        this.total = data.total
      }
    },
    // 修改讲师信息
    open(scope) {
      this.$prompt('修改班主任姓名:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async({ value }) => {
        // 如果value和之前一样，或填入空格，提示用户您没有做任何更改
        if (value === this.tableData[scope.$index].lecturername || value.trim() === '') {
          this.$message.error('您没有做任何更改!')
          return false
        }
        const Id = this.tableData[scope.$index]._id
        const { data } = await updateTeacher(Id, value)
        if (data.code === 200) {
          // 如果code码为200，提示用户修改成功，并获取所有讲师
          this.$message.success(data.msg)
          this.getTeacherAlls(this.currentPage,this.pageSize)
        } else {
          // 否则就修改失败，重试
          this.$message.error('修改失败，请重试!')
          return false
        }
      }).catch(() => {
        // 取消修改
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 删除讲师
    deleteOne(scope) {
      this.$confirm('此操作将永久删除该班主任, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const Id = this.tableData[scope.$index]._id
        const { data } = await deleteTeacher(Id)
        if (data.code === 200) {
          // 如果code码为200，提示用户删除成功，并获取所有讲师
          this.$message.success(data.msg)
          this.getTeacherAlls(this.currentPage,this.pageSize)
        } else if (data.code === 201) {
          // 如果code码为201，提示用户没有当前项
          this.$message.error('没有当前项!')
          return false
        } else if (data.code === 210) {
          //  如果code码为210，提示用户连接删除接口失败
          this.$message.error('连接删除接口失败')
          return false
        }
      }).catch(() => {
        // 取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style >
.el-table{
  width:100%;
  height:400px;
  overflow:auto
}
.addLecturer{
  margin-top: 50px;
  float: right;
  margin-right: 45px;
}
.top_option{
  position:absolute;
  bottom:0px;
  left:0px;
  width:100%;
  height:100%;
  overflow:hidden;
}
</style>
