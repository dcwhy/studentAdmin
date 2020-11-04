<template>
  <div class="app-container">
    <!-- 权限 -->
    <div class="option">
      <el-radio v-model="ruleForm.power" label="2">管理员</el-radio>
      <el-radio v-model="ruleForm.power" label="3">普通用户</el-radio>
    </div>
    <!-- 用户名与密码 -->
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="text" placeholder="请输入密码" autocomplete="off" />
        <!-- ？图标 -->
        <el-tooltip class="item" effect="dark" content="您的密码默认为：000000" placement="right">
          <el-button plain class="xx">
            <img class="password-picture" src="../../icons/bangzhu.png" alt />
          </el-button>
        </el-tooltip>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <!-- 复制 -->
      <el-dialog title="创建成功" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <p class="el-dialog__body-mess1">用户名：{{ this.message.message1 }}</p>
        <p class="el-dialog__body-mess2">密码：{{ this.message.message2 }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            v-clipboard:copy="
              `用户名：${message.message1} 密码：${message.message2}`
            "
            v-clipboard:success="copy"
            type="primary"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { register } from "@/api/user";
import { Message } from "element-ui";
export default {
  data() {
    // 用户名
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      if (this.ruleForm.name !== "" && this.username !== value) {
        this.username = value;
        this.ruleForm.pass = "";
        callback();
      } else {
        callback();
      }
    };
    // 用户密码
    var validatePass = (rule, value, callback) => {
      var regularpassword = /(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,16}$/;
        if(value && !regularpassword.test(value)){
          callback(new Error("格式为：数字+英文且不能小于6位不能大于16位"));
        }
        callback()
      }
    return {
      ruleForm: {
        name: "", // 用户名
        pass: "", // 密码
        power: "2", // 权限
        loginFlag: true // 第一次登录的标识
      },
      username: "",
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        name: [{ validator: checkAge, trigger: ["blur", "change"] }]
      },
      dialogVisible: false, // 控制创建成功的提示框
      message: {
        message1: "",
        message2: ""
      }
    };
  },
  methods: {
    // 点击提交
    submitForm(formName, callback) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 给用户添加 标识，如果是默认密码为：true 如果是自己设置的密码为 false
          // 如果创建不输入密码，就给用户默认密码 为六个零
          if(!this.ruleForm.pass){
            this.ruleForm.pass = "000000"
            this.ruleForm.loginFlag = true;
          }else
          {
            this.ruleForm.loginFlag = false;
          }

          const { data } = await register(this.ruleForm);
          if (data.code === "200") {
            // eslint-disable-next-line no-sequences
            (this.dialogVisible = true),
              (this.message.message1 = data.message1);
            this.message.message2 = data.message2;
            setTimeout(() => {
              this.resetForm(formName);
            }, 1000);
          } else {
            Message({
              message: data.message,
              type: "error",
              duration: 2 * 1000
            });
            this.ruleForm.pass = "";
          }
        } else {
          return false;
        }
      });
    },
    // 重置 input框
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击 X 图标
    handleClose(done) {
      this.dialogVisible = false; // 让弹出框隐藏
    },
    // 复制成功
    copy() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>

<style scoped>
.app-container {
  width: 600px;
}
.line {
  text-align: center;
}
.option {
  width: 355px;
  margin: 20px auto;
}
.xx {
  position: absolute;
  top: 0px;
  left: 462px;
  border: none;
}
.password-picture {
  width: 20px;
  height: 20px;
}
.el-dialog__body-mess1,
.el-dialog__body-mess2 {
  text-align: center;
}
</style>
