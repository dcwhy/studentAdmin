<!-- 登录强行修改密码页面 -->
<template>
  <div class="modify">
    <!-- vue-particles插件 粒子特效 -->
    <Background />
    <div class="modify-password">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="change-password">修改密码</div>
        <el-form-item label="新密码" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">返 回</el-button>
          <el-button
type="primary"
@click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Background from '@/components/background/index'
import { updateAdminPass } from '@/api/api'
import { mapGetters } from 'vuex'
import { removeToken } from '@/utils/auth'
export default {
  name: 'Changepassword',
  components: {
    Background
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var regularpassword = /(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!regularpassword.test(value)) {
        callback(new Error('格式为：数字+英文且不能小于6位不能大于16位'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    // 确认密码
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        // 修改密码
        pass: '',
        checkPass: ''
      },
      rules: {
        // 修改密码
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      dialogFormVisible: true, // 点击确定退出
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted() {
    // 清空本地存储 拿不到本地存储就不能通过 url地址跳转别的页面，只能去登录页面，达到拦截的效果
    removeToken()
  },
  methods: {
    errorHandler() {
      return true
    },
    //   点击确定修改密码
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data } = await updateAdminPass({
            _id: this.id,
            newpassword: this.ruleForm.pass
          })
          if (data.code === 201) {
            this.$message.error(data.msg)
          } else {
            this.$message({
              message: data.msg + ',2秒后跳转到登录页,重新登录！',
              type: 'success',
              duration: 1 * 3000
            })
            setTimeout(() => {
              this.logout() // 调用跳转到登陆页的方法
            }, 2000)
          }
        } else {
          return false
        }
      })
    },
    // 返回方法
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.logout() // 调用跳转到登陆页的方法
    },
    // 退出返回到登录页方法
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  },
  computed: {
    ...mapGetters(['id'])
  }
}
</script>

<style>
.modify {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.modify-password {
  width: 550px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #7c7e81;
  background: rgba(93, 94, 96, 0.7);
  border-radius: 50px;
}
.change-password {
  margin: auto;
  padding-top: 40px;
  font-size: 47px;
  font-family: 华文行楷;
  text-align: center;
  padding-bottom: 30px;
  margin-left: 30px;
  color: #dcdfe6;
}
.demo-ruleForm {
  width: 500px;
  text-align: center;
}
.el-form-item__label {
  color: #dcdfe6;
}
.el-button--primary {
  margin-right: 30px;
}
.el-button--default {
  margin-right: 30px;
}
</style>
