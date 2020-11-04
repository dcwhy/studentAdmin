<template>
  <div class="top_option">
    <el-table v-loading="listLoading" :data="tableData" style="width: 150%">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input
            v-if="scope.$index === updateShow"
            v-model="name"
            size="mini"
            placeholder="请输入内容"
          />
          <div v-else>{{ tableData[scope.$index].headname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow" style="display:flex;">
            <el-radio v-model="sex" label="男">男</el-radio>
            <el-radio
              v-model="sex"
              style="margin-left:-15px;"
              label="女"
            >女</el-radio>
          </div>
          <div v-else>{{ tableData[scope.$index].headsex }}</div>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow">
            <el-input
              v-if="scope.$index === updateShow"
              v-model="age"
              size="mini"
              placeholder="请输入内容"
            />
          </div>
          <div v-else>{{ tableData[scope.$index].headage }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入职时间">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow">
            <el-select v-model="jointime" size="mini" placeholder="入职时间">
              <el-option size="mini" :value="item.value" />
            </el-select>
          </div>
          <div v-else>{{ tableData[scope.$index].entryDate }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="power" align="center">
        <template slot="header" slot-scope="">操作</template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="open(scope)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-top:3px;"
            @click="deleteOne(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="power"
      type="primary"
      class="addHead"
      @click="addHeads"
    >添加班主任</el-button>
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
import { getHeadAll, updateHead, deleteHead } from '../../../api/headAll'

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
      tableData: [], // 所有班主任
      updateShow: 100000,
      name: '', // 姓名
      sex: '', // 性别
      age: '', // 年龄
      jointime: '', // 入职时间
      power: true // 权限问题
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
    this.getHeadAlls(this.currentPage,this.pageSize)
  },
  methods: {
    addHeads() {
      this.$router.push({
        name: 'addHeads'
      })
    },
    //每页下拉显示数据下拉事件调用
    handleSizeChange: function (size) {
      this.pageSize = size //每页下拉显示数据
      this.getHeadAlls(this.currentPage,this.pageSize) 
    },
    //点击第几页调用
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage //点击第几页
      this.getHeadAlls(this.currentPage,this.pageSize)
    },
    // 获取所有班主任
    async getHeadAlls(page,pageSize) {
      const { data } = await getHeadAll(page,pageSize)
      if (data.code === 202) {
        this.getHeadAlls(this.currentPage,this.pageSize)
      } else {
        this.tableData = data.data
        this.total = data.total
      }
    },
    // 修改班主任信息
    open(scope) {
      this.$prompt('修改班主任姓名:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async({ value }) => {
          // 判断如果value值和之前相同，或是填入空格，提示用户您没有做任何更改
          if (
            value === this.tableData[scope.$index].headname ||
            value.trim() === ''
          ) {
            this.$message.error('您没有做任何更改!')
            return false
          }
          const Id = this.tableData[scope.$index]._id
          const { data } = await updateHead(Id, value)
          if (data.code === 200) {
            // 如果code码为200，提示用户修改成功
            this.$message.success(data.msg)
            this.getHeadAlls(this.currentPage,this.pageSize)
          } else {
            // 否则就提示用户修改失败，请重试
            this.$message.error('修改失败，请重试!')
            return false
          }
        })
        .catch(() => {
          this.$message({
            // 取消修改
            type: 'info',
            message: '取消输入'
          })
        })
    },
    // 删除班主任
    deleteOne(scope) {
      this.$confirm('此操作将永久删除该班主任, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const Id = this.tableData[scope.$index]._id
          const { data } = await deleteHead(Id)
          if (data.code === 200) {
            // 如果code码为200，提示用户删除成功
            this.$message.success(data.msg)
            this.getHeadAlls(this.currentPage,this.pageSize)
          } else if (data.code === 201) {
            // 如果code码为201，提示用户没有当前项
            this.$message.error('没有当前项!')
            return false
          }
        })
        .catch(() => {
          this.$message({
            // 取消删除
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.el-table{
  width:100%;
  height:400px;
  overflow:auto
}
.addHead {
  margin-top: 50px;
  float: right;
  margin-right: 70px;
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
