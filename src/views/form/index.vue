<template>
  <div class="top_option">
    <el-select v-model="value" class="why_select" @change="op_click">
      <el-option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.label"
        :disabled="item.disabled"
      />
    </el-select>

    <div class="table_div">
      <el-table v-loading="listLoading" :data="classes" style="width: 100%">
        <el-table-column prop="classname" label="班级名称" />
        <el-table-column prop="createDate" label="创建日期" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="lecturer" label="讲师" />
        <el-table-column prop="headteacher" label="班主任" />
        <el-table-column label="班级成员">
          <template slot-scope="scope">
            <span class="go_student" @click="member(scope.row)">详 情</span>
          </template>
        </el-table-column>
        <el-table-column v-if="power" label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="update(scope.$index, scope.row)"
            >修 改</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="remove(scope.row, scope.row._id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-dialog title="修改操作" :visible.sync="show" width="30%">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="讲师" prop="lecturer">
            <el-input v-model="ruleForm.lecturer" />
          </el-form-item>
          <el-form-item label="班主任" prop="headteacher">
            <el-input v-model="ruleForm.headteacher" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="secede('ruleForm')">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitForm()"
          >修 改</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 转移学生 -->
    <el-dialog
      class="allstulog"
      title="转移学生"
      :visible.sync="zyStu"
      width="40%"
      :before-close="handleClose"
    >
      <el-table
        ref="multipleTable"
        highlight-current-row
        style="width: 100%"
        class="allstutab"
        :data="all"
        height="300"
        :row-key="getRowKey"
        @selection-change="selsChange"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          min-width="50"
        />
        <el-table-column prop="name" label="姓名">
          <template slot-scope="scope">
            <div style="height:100%">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="chengji" label="成绩">
          <template slot-scope="scope">
            <div>{{ scope.row.chengji }}</div>
          </template>
        </el-table-column>
      </el-table>
      <p class="allp">转移到</p>

      <div style="position:relative">
        <el-select
          v-model="value1"
          style="padding-left:10px"
          filterable
          placeholder="请选择"
          @change="changeClass"
        >
          <el-option
            v-for="item in allClass"
            :key="item._id"
            :label="item.classname"
            :value="item.classname"
            :disabled="item.disabled"
          />
        </el-select>
        <br>
        <el-button
          style="margin:0px 10px;width:92%;position:absolute;bottom:0;"
          type="primary"
          @click="zyStus"
        >转移</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="zyStu = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="position:fixed;left:250px;bottom:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// 引入接口函数
import {
  delClass, // 删除班级
  updateClass, // 修改班级信息
  allstudent, // 所有学生信息
  updateStudent, // 批量修改
  // eslint-disable-next-line no-unused-vars
  classPage, // 班级分页
  getMajor //获取专业
} from '../../api/api.js'

// 引入vuex权限
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      zyStu: false,
      listLoading: true,
      show: false, // 弹窗
      classes: [], // 获取所有班级
      allstudent: [], // 获取所有学生
      classstudents: [],
      expands: [], // 要展开的行，数值的元素是row的key值
      xzmajor: '', // 选择专业
      majors: [], //所有专业
      options: [
        {
          value: '全部班级',
          label: '全部班级'
        }
      ],
      value: '全部班级',
      value1: '全部班级',
      path: '/form/classstudent',
      ruleForm: {
        lecturer: '',
        headteacher: '',
        id: ''
      },
      rules: {
        lecturer: [
          { required: true, message: '请输入讲师', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        headteacher: [
          { required: true, message: '请输入班主任', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      rowlist: [], // 修改旧值
      all: [], // 班级内的学生
      allClass: [], // 所有班级
      zystuclass: [], // 转移学生
      play: false, // 控制显示隐藏
      changeStuClass: '', // 转移选择班级
      multipleSelection: '',
      sels: [], // 选中的值显示
      currentRow: null,
      currentPage: 1, // 默认在第几页
      pageSize: 5, // 每页最大条数
      total: 1, // 根据最大条数切割
      checkeds: [], // 批量转移选中id
      power: true // 操作按钮权限
    }
  },
  // vuex 权限
  computed: {
    ...mapGetters(['roles'])
  },
  // '3' 代表的普通用户，普通用户登录会将操作按钮隐藏
  created() {
    if (this.roles.includes('3')) {
      this.power = false
    }
  },
  async mounted() {
    // 获取所有专业
    this.getmajors()
    // 分页加班级接口调用
    this.classPage(this.currentPage, this.pageSize)
    // 获取全部专业进行筛选
    this.listLoading = false
  },
  methods: {
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id
    },
    // 删除班级
    async remove(e, id) {
      const { data } = await allstudent()
      this.all = data.data.filter(item => item.classes === e.classname)
      if (data.code === 200) {
        // 判断班里是否有学生
        if (this.all.length !== 0) {
          // 若有学生，转移学生
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, [h('span', null, '删除班级前请先转移学生')]),
            showCancelButton: true,
            confirmButtonText: '转移',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async res => {
              this.zyStu = true
              this.$refs.multipleTable.clearSelection()
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          this.classstudents = []
        } else {
          // 若没有学生,直接删除
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, [h('span', null, '您确定要移除这个班吗？')]),
            showCancelButton: true,
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async res => {
              const { data } = await delClass(id)
              if (data.code === 200) {
                this.classPage(this.currentPage, this.pageSize)
                return this.$message.success(data.msg)
              }
              this.$message({
                message: data.msg,
                type: 'error'
              })
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    },
    // 班级成员
    async member(e) {
      localStorage.setItem('data', JSON.stringify(e.classname))
      this.$router.push({
        path: this.path // 跳转路由
      })
    },
    // 选择专业
    async op_click(vel) {
      this.xzmajor = vel
      this.currentPage = 1
      // 调用全部班级接口
      this.classPage(this.currentPage,this.pageSize)
    },
    // 修改
    update(index, row) {
      this.rowlist = row
      this.show = true
      this.ruleForm.lecturer = row.lecturer
      this.ruleForm.headteacher = row.headteacher
      this.ruleForm.id = row._id
    },
    // 确定修改
    async submitForm() {
      const obj = {
        _id: this.ruleForm.id,
        lecturer: this.ruleForm.lecturer,
        headteacher: this.ruleForm.headteacher
      }
      const { data } = await updateClass(obj)
      if (
        obj.lecturer === this.rowlist.lecturer &&
        obj.headteacher === this.rowlist.headteacher
      ) {
        this.$message.success('没有任何修改')
        this.show = false
      } else if (data.code === 200) {
        if (this.xzmajor) {
          this.op_click(this.xzmajor)
        } else {
          this.xzmajor = '全部班级'
          this.op_click(this.xzmajor)
        }
        this.$message.success('修改成功')
        this.show = false
      } else {
        this.$message.error(data.msg)
        return false
      }
    },
    // 取消修改
    secede(formName) {
      this.$refs[formName].resetFields()
      this.$message({
        type: 'info',
        message: '已取消修改'
      })
      this.show = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 选择的班级
    changeClass(vel) {
      this.changeStuClass = vel
    },
    // 点击转移
    async zyStus() {
      this.sels.forEach((item, index) => {
        this.sels[index] = item._id
      })
      if (!this.checkeds[0]) {
        this.$message({
          type: 'info',
          message: '请选择学生'
        })
        return false
      }
      if (this.changeStuClass === '') {
        this.$message({
          type: 'info',
          message: '请选择班级'
        })
        return false
      }
      const obj = {
        classes: this.changeStuClass
      }
      if (this.all[0].classes === this.changeStuClass) {
        this.$message({
          type: 'info',
          message: '不能转移到本班'
        })
      } else {
        const success = await updateStudent(this.checkeds, obj)
        if (success.data.code === 200) {
          this.$message.success('转移成功！')
          const { data } = await allstudent()
          this.all = data.data.filter(item => item.classes !== obj.classes)
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    // 选择项
    selsChange(sels) {
      this.sels = sels
      const all_Id = []
      for (let i = 0; i < sels.length; i++) {
        all_Id.push(sels[i]._id)
      }
      this.checkeds = all_Id
    },
    handleSizeChange: function(size) {
      this.pageSize = size // 每页下拉显示数据
      this.classPage(this.currentPage, this.pageSize)
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage // 点击第几页
      this.classPage(this.currentPage, this.pageSize)
    },
    async getmajors(){
      const lists = await getMajor()
      for(let i=0;i<lists.data.data.length;i++){
        let majors = {
            value: lists.data.data[i].majorname,
            label: lists.data.data[i].majorname
        }
        this.options.push(majors)
      }
    },
    // 分页加班级接口调用
    async classPage(page, pageSize) {
      if (this.xzmajor === '全部班级') {
        this.xzmajor = ''
      }
      const { data } = await classPage(page, this.xzmajor, pageSize)
      if (data.code === 202) {
        this.classes = []
        return false
      } else if (data.code === 200) {
        this.classes = data.data
        this.allClass = data.dataList
        this.total = data.total
      }
    }
  }
}
</script>

<style scoped>
.el-table{
    width:100%;
    height:400px;
    overflow:auto
  }
@import "./asset.scss";
</style>
