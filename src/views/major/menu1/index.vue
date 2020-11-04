<template>
  <div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 150%">
      <el-table-column label="专业">
        <template slot-scope="scope">
          <el-input v-if="scope.$index===updateShow" v-model="major" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].majorname }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="power" type="primary" class="addMajor" @click="open">添加专业</el-button>
  </div>
</template>

<script>
// 引入接口函数
import { getMajor, addMajor } from '../../../api/headAll'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      listLoading: false,
      tableData: [], // 所有专业
      updateShow: 100000,
      major: '', // 专业
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
  // 获取所有专业
  mounted() {
    this.getMajorAll()
  },
  methods: {
    async getMajorAll() {
      const { data } = await getMajor()
      if (data.code === 200) {
        this.tableData = data.data
      } else if (data.code === 201) {
        this.$message.error(data.message)
      }
    },
    // 添加专业
    open() {
      this.$prompt('请输入专业', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async({ value }) => {
        if (value.trim() === '') {
          this.$message.error('提交信息中存在空项!')
          return false
        }
        const { data } = await addMajor(value)
        // 判断如果所填项是否为空或为空格，提示用户提交信息中存在空项
        if (data.code === 200) {
          // 判度code码如果为200，提示用户添加成功，并清空信息
          this.$message.success(data.message)
          this.getMajorAll()
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
    }
  }
}
</script>

<style >
.addMajor{
  margin-top: 50px;
  float: right;
  margin-right: 50px;
}
</style>
