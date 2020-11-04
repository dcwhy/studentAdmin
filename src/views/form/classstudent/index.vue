/* eslint-disable no-constant-condition */
<template>
  <div class="top_option">
    <!-- 列表 -->
    <div class="table_divs">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :row-key="getRowKey"
        :data="all"
        style="width: 100%"
        @selection-change="selsChange"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="30"
        />
        <el-table-column prop="studentID" min-width="85" label="学号" />
        <el-table-column prop="name" min-width="80" label="姓名" />
        <el-table-column prop="sex" min-width="50" label="性别" />
        <el-table-column prop="age" min-width="50" label="年龄" />
        <el-table-column prop="study" min-width="50" label="学制" />
        <el-table-column prop="nativeplace" min-width="50" label="籍贯" />
        <el-table-column prop="major" min-width="50" label="专业" />
        <el-table-column prop="classes" min-width="80" label="班级" />
        <el-table-column prop="citycenter" min-width="80" label="市场部" />
        <el-table-column prop="chengji" width="80" label="当前成绩" />
        <el-table-column prop="graduation" width="80" label="还差成绩" />
        <el-table-column prop="failss" width="80" label="挂科次数" />
        <el-table-column prop="entryDate" min-width="100" label="入学时间" />
        <el-table-column v-if="power" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="update(scope.$index, scope.row)" />
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="remove(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改 -->
      <el-dialog title="修改操作" :visible.sync="show" width="30%">
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="ruleForm.age" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="2" />
          </el-form-item>
          <el-form-item label="班级" prop="major">
            <el-select v-model="ruleForm.classes" style="width: 100%;" placeholder="选择班级">
              <el-option v-for="site in allClass" :key="site" :label="site" :value="site" />
            </el-select>
          </el-form-item>
          <el-form-item label="当前成绩" prop="chengji">
            <el-input v-model="ruleForm.chengji" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="2" />
          </el-form-item>
          <el-form-item label="挂科次数" prop="failss">
            <el-input
              v-model="ruleForm.failss"
              oninput="value=value.replace(/[^\d.]/g,'')"
              maxlength="2"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="secede('ruleForm')">取 消</el-button>
          <el-button v-if="xgshow" type="primary" size="small" @click="submitForm()">修 改</el-button>
          <el-button v-if="plxgshow" type="primary" size="small" @click="plsubmitForm()">修 改</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="buju">
      <div v-if="power" style="position:fixed;bottom:20px;margin-left:10px;z-index:1000">
        <!-- 批量删除 -->
        <template>
          <el-button
            style="margin-top:10px"
            type="danger"
            size="small"
            :disabled="this.sels.length === 0"
            @click="soamdelstudent()"
          >批量删除</el-button>
        </template>
        <!-- 批量修改 -->
        <template>
          <el-button
            style="margin-top:10px"
            type="success"
            size="small"
            :disabled="this.sels.length === 0"
            @click="updatesomestudent()"
          >批量修改</el-button>
        </template>
        <!-- 添加 -->
        <template>
          <el-button style="margin-top:10px" type="primary" size="small" @click="addstudent()">添加学生</el-button>
        </template>
      </div>

      <div v-if="power" style="position:fixed;right:50px;bottom:20px;z-index:1000;">
        <!-- 导出 -->
        <el-button
          size="mini"
          type="success"
          round
          :loading="downloadLoading"
          @click="handleDownload"
        >导出当页excel</el-button>
        <!-- 导入 -->
        <Export3Excel ref="enterson" />
      </div>
      <pageCount
        ref="maxPage"
        style="position:fixed;left:600px;bottom:20px;z-index:1000"
        :total="total"
        :page-size="pageSize"
        :page-sizes="maxPage"
        :current-page="currentPage"
        @getcurrentPage="getcurrentPage"
      />
    </div>

    <div class="duplicate-item">
      <el-dialog
        title="重复学生名单"
        :visible.sync="dialogVisible"
        width="87%"
        :center="true"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div class="Duplicate">
          <table class="Duplicate-form">
            <tr>
              <th>学号</th>
              <th>姓名</th>
              <th>班级</th>
              <th>性别</th>
              <th>年龄</th>
              <th>专业</th>
              <th>市场部</th>
              <th>当前成绩</th>
              <th>还差成绩</th>
              <th>挂科次数</th>
              <th>学制</th>
              <th>籍贯</th>
              <th>入学时间</th>
            </tr>
            <div id="bao">
              <template v-for="item in exists">
                <tr v-for="(items,index) in item">
                  <template v-if="index==0">
                    <td>{{ items.studentID }}</td>
                    <td>{{ items.name }}</td>
                    <td>{{ items.classes }}</td>
                    <td>{{ items.sex }}</td>
                    <td>{{ items.age }}</td>
                    <td>{{ items.major }}</td>
                    <td>{{ items.citycenter }}</td>
                    <td>{{ items.chengji }}</td>
                    <td>{{ items.graduation }}</td>
                    <td>{{ items.failss }}</td>
                    <td>{{ items.study }}</td>
                    <td>{{ items.nativeplace }}</td>
                    <td>{{ items.entryDate }}</td>
                  </template>

                  <el-checkbox-group v-else id="Currentimport" v-model="checkList">
                    <el-checkbox class="Currentimport-checkbox" :label="items">
                      <td>{{ items.studentID }}</td>
                      <td>{{ items.name }}</td>
                      <td>{{ items.classes }}</td>
                      <td>{{ items.sex }}</td>
                      <td>{{ items.age }}</td>
                      <td>{{ items.major }}</td>
                      <td>{{ items.citycenter }}</td>
                      <td>{{ items.chengji }}</td>
                      <td>{{ items.graduation }}</td>
                      <td>{{ items.failss }}</td>
                      <td>{{ items.study }}</td>
                      <td>{{ items.nativeplace }}</td>
                      <td>{{ items.entryDate }}</td>
                    </el-checkbox>
                  </el-checkbox-group>

                </tr>
              </template>
            </div>

          </table>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Confirmreplacement">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入接口函数
import {
  updateAllstud,
  delAllStudent,
  updateStudent, // 批量修改
  selectAllstud, // 查询学生
  updateExcelstudent, // 导入修改
  getClass // 获取班级
} from '../../../api/api.js'
// 分页模块
import pageCount from '../../../components/Pagination/index'
// Excel模块
import UploadExcel from '../../../components/UploadExcel/index'
// 引入vuex 权限
import { mapGetters } from 'vuex'
export default {
  components: {
    pageCount
  },
  data() {
    return {
      xgshow: false,
      plxgshow: false,
      listLoading: true,
      downloadLoading: false,
      show: false, // 弹窗
      classes: [], // 获取所有班级
      allstudent: [], // 获取所有学生
      getClass: [],
      all: [], // 获取班级学生
      createClass: [], // 导入
      ruleForm: {
        age: '',
        classes: '',
        chengji: '',
        graduation: '',
        failss: '',
        id: ''
      },
      rowlist: [], // 修改旧值
      study: [], // 学制
      path: '/example/tree',
      sels: [], // 选中的值显示
      checkeds: [], // 批量删除选中id
      updateShow: 100000, // 最大匹配的值
      total: 1, // 数据总条数，默认给1
      pageSize: 5, // 数据的总条数，默认是6条
      maxPage: ['5', '10', '20', '30'], // 数据的总条数
      currentPage: 1, // 当前页数，默认是第1页
      b: [],
      power: true, // 操作按钮权限
      dialogVisible: false, // 导入时，重复的学生显示弹出框
      exists: [], // 导入-数据库中已存在的数据
      checkList: [], // 重复学生表单中的多选框
      delpage: [], // 页数
      allClass: '' // 所有班级
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
    // 接收存储数据
    this.getClass = JSON.parse(localStorage.getItem('data'))
    this.selectStud()
    this.listLoading = false
  },
  updated() {
    this.enterstu()
  },
  methods: {
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id
    },
    enterstu() {
      this.$refs.enterson.dialogVisible = this.dialogVisible
    },
    async selectStud() {
      const optionstu = await selectAllstud(this.currentPage, {
        classes: this.getClass
      })
      if (optionstu.data.code === 200) {
        this.all = optionstu.data.data
        this.total = optionstu.data.total
        this.delpage = optionstu.data.delpage
        this.listLoading = false
      }
      this.sliceJg(this.all)
    },
    // 删除学生
    remove(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [h('span', null, '您确定要移除这个学生吗？')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async res => {
          delAllStudent(row._id).then(async res => {
            if (res.data.code === 201) {
              this.$message.error(res.data.msg)
            } else {
              if (this.all.length === 1) {
                this.currentPage = this.currentPage - 1
              }
              this.selectStud()
              this.currentPage = this.currentPage + 1
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
          // eslint-disable-next-line handle-callback-err
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改
    async update(index, row) {
      const { data } = await getClass()
      this.allClass = data.data
      this.allClass.forEach((item, index) => {
        this.allClass[index] = item.classname
      })
      this.xgshow = true
      this.plxgshow = false
      this.rowlist = row
      this.show = true
      this.ruleForm.age = row.age
      this.ruleForm.classes = row.classes
      this.ruleForm.chengji = row.chengji
      this.ruleForm.failss = row.failss
      this.ruleForm.id = row._id
      this.study = row.study
    },
    // 确定修改
    async submitForm() {
      const graduation = this.study * 10 - this.ruleForm.chengji
      // 默认值
      const obj = {
        age: this.ruleForm.age,
        classes: this.ruleForm.classes,
        chengji: this.ruleForm.chengji,
        failss: this.ruleForm.failss,
        graduation: graduation
      }
      const ID = this.ruleForm.id
      const { data } = await updateAllstud(ID, obj)
      // 判断值是否改变
      if (
        obj.age === this.rowlist.age &&
        obj.classes === this.rowlist.classes &&
        obj.chengji === this.rowlist.chengji &&
        obj.failss === this.rowlist.failss
      ) {
        this.$message.info('没有任何修改')
        this.show = false
      } else if (data.code === 200) {
        this.$message.success('修改成功')
        this.selectStud()
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
    // 添加
    addstudent() {
      this.$router.push({
        path: this.path, // 跳转路由
        query: {
          value: '/form/classstudent'
        }
      })
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
    // 批量修改
    async updatesomestudent() {
      // 所有班级
      const { data } = await getClass()
      this.allClass = data.data
      this.allClass.forEach((item, index) => {
        this.allClass[index] = item.classname
      })
      // 选中学制
      this.sels.forEach((item, index) => {
        this.sels[index] = item.study
      })
      this.ruleForm.age = ''
      this.ruleForm.classes = ''
      this.ruleForm.chengji = ''
      this.ruleForm.failss = ''
      this.show = true
      this.xgshow = false
      this.plxgshow = true
    },
    // 确定批量修改
    async plsubmitForm() {
      const obj = {
        age: this.ruleForm.age,
        classes: this.ruleForm.classes,
        chengji: this.ruleForm.chengji,
        failss: this.ruleForm.failss
      }
      if (obj.age === '') {
        delete obj.classes
      }
      if (obj.classes === '') {
        delete obj.classes
      }
      if (obj.chengji === '') {
        delete obj.chengji
      } else {
        for (var i = 0; i < this.sels.length; i++) {
          if (this.sels.length > 1 && this.sels[0] !== this.sels[i]) {
            this.$message.error('年制不同，修改失败')
            this.show = false
            this.$refs.multipleTable.clearSelection()
            return false
          } else {
            const key = 'graduation'
            obj[key] = this.sels[i] * 10 - obj.chengji
          }
        }
      }
      if (obj.failss === '') {
        delete obj.failss
      }
      if (!obj.age && !obj.classes && !obj.chengji && !obj.failss) {
        this.$message.error('没有任何修改')
      } else {
        const { data } = await updateStudent(this.checkeds, obj)
        if (data.code === 200) {
          this.selectStud()
          this.$refs.multipleTable.clearSelection()
          this.$message.success('修改成功')
          this.show = false
        } else {
          this.$message.error(data.msg)
        }
      }
    },
    // 批量删除
    soamdelstudent() {
      this.$confirm('此操作将永久删除这几项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAllStudent(this.checkeds).then(async res => {
            if (res.data.code === 201) {
              this.$message.error(res.data.msg)
            } else {
              if (this.currentPage === Math.ceil(this.total / this.pageSize) && this.checkeds.length === this.all.length) {
                this.currentPage = this.currentPage - 1
              }
              this.$refs.multipleTable.clearSelection()
              this.selectStud()
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
        })
        .catch(() => {})
    },
    handleDownload() {
      this.downloadLoading = true
        import('../../../excel/Export2Excel.js').then(excel => {
          const tHeader = [
            '班级',
            '姓名',
            '性别',
            '年龄',
            '专业',
            '市场部',
            '当前成绩',
            '还差成绩',
            '挂科次数',
            '学制',
            '籍贯',
            '学号',
            '入学时间'
          ] // excel 表头
          const filterVal = [
            'classes',
            'name',
            'sex',
            'age',
            'major',
            'citycenter',
            'chengji',
            'graduation',
            'failss',
            'study',
            'nativeplace',
            'studentID',
            'entryDate'
          ] // 获取的数据字段名
          const list = this.all // 所要生成Excel数据源
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    // 调用子组件传过来的事件
    getcurrentPage(currentPage) {
      this.currentPage = currentPage
      this.selectStud()
      this.$refs.multipleTable.clearSelection()
    },
    // 切割籍贯函数
    sliceJg(Array) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < Array.length; i++) {
        if (
          Array[i].nativeplace === '' ||
          Array[i].nativeplace === null ||
          Array[i].nativeplace === undefined
        ) {
          continue
        } else if (
          Array[i].nativeplace.includes('黑龙江') ||
          Array[i].nativeplace.includes('内蒙古')
        ) {
          // eslint-disable-next-line no-undef
          Array[i].nativeplace = Array[i].nativeplace.slice(0, 3)
        } else {
          Array[i].nativeplace = Array[i].nativeplace.slice(0, 2)
        }
      }
      return Array
    },
    // 重复学生
    async Confirmreplacement() {
      const { data } = await updateExcelstudent(this.checkList)
      if (data.code === 200) {
        this.dialogVisible = false
        this.selectStud()
        this.$message.success(data.msg)
      }
    }
  }
}
</script>

<style scoped>
@import "./asset.scss";
</style>
