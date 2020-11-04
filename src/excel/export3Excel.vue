<template>
  <label class="fileinp">
    <input type="button" class="btn" value="导入excel" round @click="handleInter">
    <input
      ref="inputer"
      type="file"
      class="fileinpd"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="importfxx(this)"
    >
  </label>
</template>
<script>
import {
  getExcel // 导入
} from '../api/api'
export default {
  data() {
    return {
      dialogVisible: false, // 导入时，重复的学生显示弹出框
      downloadLoading2: false
    }
  },
  methods: {
    handleInter() {
      this.downloadLoading2 = true
    },
    // 导入
    importfxx(obj) {
      const _this = this
      // eslint-disable-next-line no-unused-vars
      const inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0]
      var rABS = false // 是否将文件读取为二进制字符串
      var f = this.file
      var reader = new FileReader()
      // if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var rABS = false // 是否将文件读取为二进制字符串
        // eslint-disable-next-line no-unused-vars
        var pt = this
        var wb // 读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = async function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var XLSX = require('xlsx')
          if (rABS) {
            // eslint-disable-next-line no-undef
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是你想要的东西
          this.da = [...outdata]
          const arr = []
          this.da.map(v => {
            const obj = {}
            obj.classes = v.班级
            obj.name = v.姓名
            obj.sex = v.性别
            obj.age = v.年龄
            obj.major = v.专业
            obj.citycenter = v.市场部
            obj.chengji = v.当前成绩
            obj.graduation = v.还差成绩
            obj.failss = v.挂科次数
            obj.study = v.学制
            obj.nativeplace = v.籍贯
            obj.studentID = v.学号
            obj.entryDate = v.入学时间
            arr.push(obj)
          })
          getExcel(arr).then(res => {
            _this.$parent.exists = res.data.exist
            if (res.data.code === 200) {
              _this.$message({
                message: '请耐心等待导入成功',
                type: 'success'
              })
              _this.$parent.selectStud()
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'success'
              })
              _this.$parent.dialogVisible = true // 进入学生重复
            }
          })
          // eslint-disable-next-line no-unused-vars
          const para = {
            QwithList: arr
          }
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    }
  }
}
</script>
