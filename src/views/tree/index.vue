<template>
  <!-- 添加的显示模块 -->
  <div v-show="addshow" class="demo-input-size">
    <div class="demo-input-smallsize">
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:20px;"
      >
        <div style="margin:5px;">学号：</div>
        <el-input v-model="xuehao" size="mini" placeholder="学号" />
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:20px;"
      >
        <div style="margin:5px;">姓名：</div>
        <el-input v-model="newName" size="mini" placeholder="姓名" />
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:20px;"
      >
        <div style="margin-top:12px;margin-left:5px;">籍贯：</div>
        <el-cascader
          ref="cascaderAddr"
          v-model="jiguan"
          style="width:35%;height:28px;margin-right:355px;"
          :options="options"
          placeholder="请选择籍贯"
        />
      </div>
      <div style="margin-left:15px;margin-top:30px;">
        <!-- 性别模块 -->
        <span style="margin-right:50px;margin-top:10px;margin-left:5px;">性别：</span>
        <el-radio v-model="sex" label="男">男</el-radio>
        <el-radio v-model="sex" label="女">女</el-radio>
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:5px;">年龄：</div>
        <el-input v-model="newAge" size="mini" placeholder="年龄" />
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:5px;">学制：</div>
        <el-select v-model="study" size="mini" placeholder="学制">
          <el-option
            v-for="item in studys"
            :key="item.value"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:5px;">专业：</div>
        <el-select v-model="major" size="mini" placeholder="专业">
          <el-option
            v-for="item in majors"
            :key="item.value"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:5px;">班级：</div>
        <el-select v-model="newclass" size="mini" placeholder="班级">
          <el-option
            v-for="item in classs"
            :key="item.value"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:5px;">市场部:</div>
        <el-select v-model="cityCenter" size="mini" placeholder="市场部">
          <el-option
            v-for="item in cityCenters"
            :key="item.value"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;"
      >
        <div style="margin:10px;">当前成绩：</div>
        <el-input-number
          v-model="chengji"
          style="width:20%;height:28px;margin-right:460px;"
          :step="1"
          step-strictly
          :min="0"
          :max="40"
          label="当前成绩"
        />
      </div>
      <div style="margin-left:15px;width:70%;display:flex;justify-content: space-between;margin-top:30px;">
        <div style="margin:10px;">入学时间：</div>
        <el-date-picker
          v-model="intime"
          type="date"
          placeholder="选择日期"
          style="width:20%;height:28px;margin-right:460px;"
        />
      </div>
      <el-button
        type="primary"
        style="width:90px;height:38px;line-height:0;margin-left:500px;margin-top:20px;"
        @click="Determine(), btn"
      >确定</el-button>
      <el-button
        type="warning"
        style="width:90px;height:38px;line-height:0;margin-left:10px;margin-top:20px;"
        @click="clearList"
      >清空</el-button>
    </div>
  </div>
</template>

<script>
// 引入接口函数
import { getMajor, getMarketing, getClass, getStudent } from '@/api/api'

// 引入全国各地区js文件
// eslint-disable-next-line no-unused-vars
import City from '../../assets/Ctiy/citys.json'

export default {
  data() {
    return {
      addshow: true, // 添加模块是否显示
      xuehao: '', // 学号
      jiguan: [], // 籍贯
      newName: '', // 姓名
      sex: '男', // 性别单选框
      newAge: '', // 年龄
      study: '', // 学制选项
      major: '', // 专业选项
      newclass: '', // 班级选项
      cityCenter: '', // 市场部选项
      chengji: '', // 已有成绩
      intime: '', // 入学时间
      // select中value才是选中的那个值
      // 学制选项
      studys: [
        {
          value: '1'
        },
        {
          value: '2'
        },
        {
          value: '3'
        },
        {
          value: '4'
        }
      ],
      // 专业选项
      majors: [],
      // 班级选项
      classs: [],
      // 市场部选项
      cityCenters: [],
      // 地区选项
      options: [],
      patho: [] // 班级路径
    }
  },
  mounted() {
    this.getRouterData()
    this.Majors() // 专业接口调用
    this.Classs() // 班级接口调用
    this.CityCenters() // 市场部调用
    this.options = City // 地区调用
  },
  methods: {
    btn() {
      // 入职时间格式
      return new Date(this.intime).getFullYear() +
      '-' +
      (new Date(this.intime).getMonth() + 1) +
      '-' +
      new Date(this.intime).getDate()
    },
    getRouterData() {
      this.patho = this.$route.query.value
    },
    async Majors() {
      // 获取专业
      const { data } = await getMajor()
      for (let i = 0; i < data.data.length; i++) {
        this.majors.push({
          value: data.data[i].majorname
        })
      }
    },
    async Classs() {
      // 获取班级
      const { data } = await getClass()
      for (let i = 0; i < data.data.length; i++) {
        this.classs.push({
          value: data.data[i].classname
        })
      }
    },
    async CityCenters() {
      // 获取市场部
      const { data } = await getMarketing()
      for (let i = 0; i < data.data.length; i++) {
        this.cityCenters.push({
          value: data.data[i].marketname
        })
      }
    },
    // 确定(添加学生)
    async Determine() {
      const obj = {
        name: this.newName,
        age: this.newAge,
        sex: this.sex,
        study: this.study,
        major: this.major,
        classes: this.newclass,
        citycenter: this.cityCenter,
        chengji: this.chengji,
        studentID: this.xuehao,
        nativeplace: this.jiguan,
        entryDate: this.btn()
      }
      if (obj.entryDate === 'NaN-NaN-NaN') {
        const date = new Date()
        obj.entryDate =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
      }
      if (
        this.newName === '' ||
        this.newAge === '' ||
        this.sex === '' ||
        this.study === '' ||
        this.major === '' ||
        this.newclass === '' ||
        this.cityCenter === '' ||
        this.chengji === '' ||
        this.xuehao === '' ||
        this.jiguan === [] ||
        this.intime === ''
      ) {
        this.$message.error('有空项请填写完整!')
        return false
      } else if (/^[0-9]{1,2}$/.test(this.studentID)) {
        this.$message.error('学号必须是数字!')
        return false
      } else if (/^[0-9]{1,2}$/.test(this.age)) {
        this.$message.error('年龄必须是数字!')
        return false
      } else if (/.*[\u4e00-\u9fa5]+.*$/.test(this.chengji)) {
        this.$message.error('成绩不必带单位!')
        return false
      } else {
        obj.nativeplace = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels.join('')
        const success = await getStudent(obj)
        if (success.data.code === 200) {
          this.clearList()
          if (this.patho === undefined) {
            this.$confirm(`${success.data.msg},是否跳转至学生列表页`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.push({
                  name: 'All',
                  params: { maxpage: success.data.maxpages }
                }) // 如果想在push里传递params参数，就必须用路由对应的name跳转
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消跳转'
                })
              })
          } else {
            this.$confirm(`${success.data.msg},是否跳转至班级学生页`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.push({
                  name: '班级成员',
                  params: { maxpage: success.data.maxpages }
                }) // 如果想在push里传递params参数，就必须用路由对应的name跳转
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消跳转'
                })
              })
          }
        } else {
          this.$message.error(success.data.msg)
        }
      }
    },
    // 清空信息
    clearList() {
      this.newName = ''
      this.sex = '男'
      this.newAge = ''
      this.study = ''
      this.major = ''
      this.newclass = ''
      this.cityCenter = ''
      this.chengji = ''
      this.xuehao = ''
      this.jiguan = []
      this.intime = ''
    }
  }
}
</script>
<style scoped>
.demo-input-size {
  width: 100%;
  height: 100%;
  margin-top: 15px;
}
.demo-input-smallsize {
  width: 1020px;
  height: 89vh;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px 0;
  overflow-y: scroll;
}
.el-input--mini {
  width: 600px;
}
.el-radio {
  margin-right: 2px;
}
.el-select {
  width: 600px;
}
</style>
