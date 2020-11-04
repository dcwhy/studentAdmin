<template>
  <div style="padding:30px;">
    <el-alert :closable="false">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name" :rules="rules.name">
          <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age" :rules="rules.age">
          <el-input v-model.number="ruleForm.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="专业" prop="major" :rules="rules.major">
          <el-select v-model="ruleForm.major" placeholder="请选择专业">
            <el-option v-for="item in major" :key="item._id" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" :rules="rules.time">
          <el-col :span="11">
            <el-form-item prop="time">
              <el-date-picker v-model="ruleForm.time" :editable="false" type="date" placeholder="请选择日期" :picker-options="pickerOptions" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm'), btn">确定</el-button>
          <el-button @click="resetForm('ruleForm')">清空</el-button>
        </el-form-item>
      </el-form>
    </el-alert>
  </div>
</template>

<script>
import { addTeacher, getMajor } from '../../../api/headAll'
export default {
  data() {
    return {
      // 入职时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      ruleForm: {
        name: '', // 姓名
        age: '', // 年龄
        time: '', // 入职时间
        sex: '男', // 性别
        major: '' // 专业
      },
      major: [], // 专业
      rules: {
        // 姓名
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        // 年龄
        age: [{ type: 'number', message: '年龄必须为数字值' }],
        // 时间
        time: [{ type: 'date', message: '请选择日期', trigger: 'blur' }],
        // 专业
        major: [{ required: true, message: '请选择专业', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getmajor()
  },
  methods: {
    btn() {
      // 入职时间格式
      return new Date(this.ruleForm.time).getFullYear() + '-' + (new Date(this.ruleForm.time).getMonth() + 1) + '-' + new Date(this.ruleForm.time).getDate()
    },
    // 添加讲师
    async submitForm(formName) {
      const person = {
        lecturername: this.ruleForm.name,
        lecturerage: this.ruleForm.age,
        lecturersex: this.ruleForm.sex,
        entryDate: this.btn(),
        major: this.ruleForm.major
      }
      // 判断如果所填项是否为空或为空格，提示用户提交信息中存在空项
      if (person.lecturername.trim() === '') {
        this.$message.error('姓名不能为空')
        return false
      } else if (person.major === '') {
        this.$message.error('专业不能为空')
        return false
      }
      if (person.entryDate === 'NaN-NaN-NaN') {
        const date = new Date()
        person.entryDate =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
      }
      // 获取所有讲师
      const { data } = await addTeacher(person)
      if (data.code === 200) {
        this.$confirm(`是否跳转至班主任列表页`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              name: 'toLecturers',
              parmas: { maxpage: data.maxpages }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消跳转'
            })
          })
        // 判度code码如果为200，提示用户添加成功，并清空信息
        this.$message.success(data.message)
        this.$refs[formName].resetFields()
      } else if (data.code === 203) {
        // 判断code码如果为203，提示用户该讲师已经存在，并清空信息
        this.$message.error(data.message)
        this.$refs[formName].resetFields()
        return false
      }
    },
    // 清空信息
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取专业
    async getmajor() {
      const { data } = await getMajor()
      for (let i = 0; i < data.data.length; i++) {
        this.major.push({
          value: data.data[i].majorname
        })
      }
    }
  }
}
</script>
