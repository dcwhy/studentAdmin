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
import { addHead } from '../../../api/headAll'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      ruleForm: {
        name: '', // 姓名
        age: '', // 年龄
        time: '', // 入职时间
        sex: '男' // 性别
      },
      rules: {
        // 姓名
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        // 年龄
        age: [{ type: 'number', message: '年龄必须为数字值' }],
        // 入职时间
        time: [{ type: 'date', message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  methods: {
    btn() {
      // 入职时间
      return (
        new Date(this.ruleForm.time).getFullYear() +
        '-' +
        (new Date(this.ruleForm.time).getMonth() + 1) +
        '-' +
        new Date(this.ruleForm.time).getDate()
      )
    },
    // 添加班主任
    async submitForm(formName) {
      const person = {
        headname: this.ruleForm.name,
        headage: this.ruleForm.age,
        headsex: this.ruleForm.sex,
        entryDate: this.btn()
      }
      // 判断如果填入信息有一项为空，提示用户提交信息中存在空项
      if (person.headname.trim() === '') {
        this.$message.error('姓名不能为空')
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
      const { data } = await addHead(person)
      if (data.code === 200) {
        this.$confirm(`是否跳转至班主任列表页`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              name: 'toHeads',
              parmas: { maxpage: data.maxpages }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消跳转'
            })
          })
        // 如果code码为200，提示用户添加成功，并清空信息
        this.$message.success(data.message)
        this.$refs[formName].resetFields()
      } else if (data.code === 203) {
        // 如果code码为203，提示用户该班主任已经存在，并清空信息
        this.$message.error(data.message)
        this.$refs[formName].resetFields()
        return false
      }
    },
    resetForm(formName) {
      // 清空信息
      this.$refs[formName].resetFields()
    }
  }
}
</script>
