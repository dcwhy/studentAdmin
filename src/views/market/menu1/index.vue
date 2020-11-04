<template>
  <div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 150%">
      <el-table-column label="市场部">
        <template slot-scope="scope">
          <el-input v-if="scope.$index===updateShow" v-model="market" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].marketname }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="power" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" style="margin-top:3px;" @click="deleteOne(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="power" type="primary" class="addMarket" @click="open">添加市场部</el-button>
  </div>
</template>

<script>
import { getMarketAll, deleteMarket, addMarket } from '../../../api/headAll'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      listLoading: false,
      updateShow: 100000,
      tableData: [],
      market: '',
      power: true
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
  async mounted() {
    this.getMarketAlls()
  },
  methods: {
    // 获取所有市场部
    async getMarketAlls() {
      const { data } = await getMarketAll()
      if (data.code === 200) {
        this.tableData = data.data
      } else if (data.code === 203) {
        this.$message.error(data.message)
      }
    },
    // 添加市场部
    open() {
      this.$prompt('请输入市场部', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async({ value }) => {
        if (value.trim() === '') {
          this.$message.error('提交信息中存在空项!')
          return false
        }
        const { data } = await addMarket(value)
        // 判断如果所填项是否为空或为空格，提示用户提交信息中存在空项
        if (data.code === 200) {
          // 判度code码如果为200，提示用户添加成功，并清空信息
          this.$message.success(data.message)
          this.getMarketAlls()
        } else if (data.code === 203) {
          // 判度code码如果为203，提示用户该专业已经存在，并清空信息
          this.$message.error(data.message)
          return false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 删除市场部
    deleteOne(scope) {
      this.$confirm('此操作将永久删除该市场部, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const Id = this.tableData[scope.$index]._id
        const { data } = await deleteMarket(Id)
        if (data.code === 200) {
          // 如果code码为200，提示用户删除成功，并获取所有讲师
          this.$message.success(data.msg)
          this.getMarketAlls()
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

<style>

.addMarket{
  margin-top: 50px;
  float: right;
  margin-right: 50px;
}
</style>
