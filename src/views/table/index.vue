<template>
  <div class="top_option">
    <!-- 查询模块 -->
    <div v-show="searchShow === 1" class="searchbox-bs-002">
      <li>
        <el-input v-model="search.serName" size="mini" placeholder="姓名" />
      </li>
      <li>
        <el-select v-model="search.serStudy" size="mini" placeholder="学制">
          <el-option v-for="item in upstudys" :key="item.value" size="mini" :value="item.value" />
        </el-select>
      </li>
      <li>
        <el-select v-model="search.serMajor" size="mini" placeholder="专业">
          <el-option v-for="item in upmajors" :key="item.value" size="mini" :value="item.value" />
        </el-select>
      </li>
      <li>
        <el-select v-model="search.serClasses" size="mini" placeholder="班级">
          <el-option v-for="item in upclasses" :key="item.value" size="mini" :value="item.value" />
        </el-select>
      </li>
      <li>
        <el-select v-model="search.sercityCenter" size="mini" placeholder="市场部">
          <el-option v-for="item in upcityCenters" :key="item.value" size="mini" :value="item.value" />
        </el-select>
      </li>
      <li class="chengji">
        <el-input v-model="search.serchengji.$gte" type="number" min="0" max="39" size="mini" placeholder=">0" />
        <span>-</span>
        <el-input v-model="search.serchengji.$lte" type="number" min="1" max="40" size="mini" placeholder="<40" />
      </li>
      <li>
        <el-input v-model="search.sergraduation" size="mini" placeholder="还差成绩" />
      </li>
      <li>
        <el-select v-model="search.serFailss" size="mini" placeholder="挂科次数">
          <el-option v-for="item in searFail" :key="item.value" size="mini" :value="item.value" />
        </el-select>
      </li>
      <li style="display:flex;">
        <el-button size="mini" type="success" @click="searchAll">确定</el-button>
        <el-button size="mini" type="info" @click="searchQ">清空</el-button>
      </li>
    </div>
    <!-- 显示模块 -->
    <el-table :data="tableData" style="width: 150%">
      <el-table-column label="学号">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="studentID" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].studentID }}</div>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="upname" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="籍贯">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="nativeplace" size="mini" placeholder="请输入内容" />
          <div v-else>{{ tableData[scope.$index].nativeplace }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow" style="display:flex;">
            <el-radio v-model="upsex" label="男">男</el-radio>
            <el-radio v-model="upsex" style="margin-left:-15px;" label="女">女</el-radio>
          </div>
          <div v-else>{{ tableData[scope.$index].sex }}</div>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow">
            <el-input v-if="scope.$index === updateShow" v-model="upage" size="mini" placeholder="请输入内容" />
          </div>
          <div v-else>{{ tableData[scope.$index].age }}</div>
        </template>
      </el-table-column>
      <el-table-column label="学制">
        <template slot-scope="scope">
          <div>{{ tableData[scope.$index].study }}</div>
        </template>
      </el-table-column>
      <el-table-column label="专业">
        <template slot-scope="scope">
          <div>{{ tableData[scope.$index].major }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow">
            <el-select v-model="upclass" size="mini" placeholder="班级">
              <el-option v-for="item in upclasses" :key="item" size="mini" :value="item" />
            </el-select>
          </div>
          <div v-else>{{ tableData[scope.$index].classes }}</div>
        </template>
      </el-table-column>
      <el-table-column label="市场部">
        <template slot-scope="scope">
          <div v-if="scope.$index === updateShow">
            <el-select v-model="upcityCenter" size="mini" placeholder="市场部">
              <el-option v-for="item in upcityCenters" :key="item" size="mini" :value="item" />
            </el-select>
          </div>
          <div v-else>{{ tableData[scope.$index].citycenter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="当前成绩">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="upchengji" size="mini" placeholder="请输入内容" />
          <div v-else style="text-align:center">
            {{ tableData[scope.$index].chengji }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="还差成绩">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="upgraduation" size="mini" placeholder="请输入内容" />
          <div v-else style="text-align:center">
            {{ tableData[scope.$index].graduation }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="挂科次数">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="upFail" size="mini" placeholder="请输入内容" />
          <div v-else style="text-align:center">
            {{ tableData[scope.$index].failss }}
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="入学时间">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateShow" v-model="intime" size="mini" placeholder="请输入内容" />
          <div v-else style="text-align:center">
            {{ tableData[scope.$index].entryDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button v-if="scope.$index === updateShow" size="mini" type="primary">确定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模块 -->
    <el-pagination
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="position:fixed;left:250px;bottom:20px;"
      @size-change="handleSizeChange"
    />
    <!-- 导出excel表 -->
    <el-button
      v-if="power"
      size="mini"
      :loading="exportLodding"
      type="success"
      round
      style="position:fixed;right:100px;bottom:20px;"
      @click="outExcel"
    >导出当页excel
    </el-button>
  </div>
</template>

<script>
// 引入接口函数
import {
  selectAllstud, // 查询学生信息
  getPage, // 分页和学生
  getMajor, // 获取所有专业
  getMarketing, // 获取所有市场部
  getClass // 获取所有班级
} from '../../api/api.js'

// 引入vuex
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Table',
  data() {
    return {
      exportLodding: false,
      tableData: [], // 所有学生数据
      searchShow: 1, // 搜索模块是否显示 不为1就是不显示
      //  ·················································· 分页数据
      selectflag: false, // 标识, 用来给查询使用
      currentPage: 1, // 默认在第几页
      pageSize: 5, // 每页最大条数
      total: 1, // 根据最大条数切割
      updateShow: 100000, // 当前展示的修改弹出项，给这么大是为了一开始谁也匹配不到
      intime: '', // 入学时间
      search: {
        // 搜索的v-model绑定值
        serName: '', // 姓名
        serStudy: '', // 学制
        serMajor: '', // 专业
        serClasses: '', // 班级
        sercityCenter: '', // 市场部
        serchengji: {
          $gte: 0, // 当前成绩 (>3,只是比喻,具体多少根据情况定)
          $lte: 40 // 当前成绩 (<15,只是比喻,具体多少根据情况定)
        },
        sergraduation: '', // 还差成绩
        serFailss: '' // 挂科次数
      },
      // 学制选项
      upstudys: [{
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
      upmajors: [],
      // 班级选项
      upclasses: [],
      // 市场部选项
      upcityCenters: [],
      //  搜索挂科次数选项
      searFail: [{
        value: '0次'
      },
      {
        value: '1次'
      },
      {
        value: '2次'
      },
      {
        value: '3次及以上'
      }
      ],
      // 学生的下标
      index: 0,
      // 学生的id值
      id: '',
      // 查询到的对象
      objselect: {},
      // 操作按钮权限
      power: true
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
  mounted() {
    // 分页加学生接口调用
    this.getPages(this.currentPage, this.pageSize)
    // 专业接口调用
    this.Majors()
    // 班级接口调用
    this.Classs()
    // 市场部接口调用
    this.CityCenters()
  },
  methods: {
    // 切割籍贯函数
    sliceJg(Array) {
      // for循环出来这个数组的长度
      for (let i = 0; i < Array.length; i++) {
        if (Array[i].nativeplace === '' || Array[i].nativeplace === null || Array[i].nativeplace === undefined) {
          continue
        } else if (
          // 否则就用includes获取到这个两个下标
          Array[i].nativeplace.includes('黑龙江') ||
          Array[i].nativeplace.includes('内蒙古')
        ) {
          // 要不然就截取nativeplace的长度,如果是黑龙江和内蒙古，就截取3个
          Array[i].nativeplace = Array[i].nativeplace.slice(0, 3)
        } else {
          // 否则就截取2个
          Array[i].nativeplace = Array[i].nativeplace.slice(0, 2)
        }
      }
      // 返回数组
      return Array
    },
    // 查询接口调用
    async selectallstud(page, obj) {
      const searchSuc = await selectAllstud(page, obj)
      const sliceData = this.sliceJg(searchSuc.data.data) // 调用切割籍贯函数
      this.tableData = sliceData
      this.currentPage = page
      this.total = searchSuc.data.total
    },
    // 分页加学生接口调用
    async getPages(page, pageSize) {
      if(this.selectflag){
        this.selectallstud(this.currentPage,this.objselect)
      }else{
          const { data } = await getPage(page, pageSize)
          if (data.code === 200) {
          const sliceData = this.sliceJg(data.data) // 调用切割籍贯函数
          this.tableData = sliceData
          this.total = data.total
        }  
      }
    },
    //每页下拉显示数据事件调用
    handleSizeChange: function(size) {
      this.pageSize = size // 每页下拉显示数据
      this.getPages(this.currentPage, this.pageSize)
    },
    //点击第几页事件调用
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage // 点击第几页
      this.getPages(this.currentPage, this.pageSize)
    },
    // 获取专业
    async Majors() {
      const {
        data
      } = await getMajor()
      for (let i = 0; i < data.data.length; i++) {
        this.upmajors.push({
          value: data.data[i].majorname
        })
      }
    },
    // 获取班级
    async Classs() {
      const {
        data
      } = await getClass()
      for (let i = 0; i < data.data.length; i++) {
        this.upclasses.push({
          value: data.data[i].classname
        })
      }
    },
    // 获取市场部
    async CityCenters() {
      const {
        data
      } = await getMarketing()
      for (let i = 0; i < data.data.length; i++) {
        this.upcityCenters.push({
          value: data.data[i].marketname
        })
      }
    },
    // 查询函数(确定按钮)
    async searchAll() {
      this.selectflag = true
      if (
        this.search.serName === '' &&
          this.search.serStudy === '' &&
          this.search.serMajor === '' &&
          this.search.serClasses === '' &&
          this.search.sercityCenter === '' &&
          this.search.serchengji.$gte === '' &&
          this.search.serchengji.$lte === '' &&
          this.search.sergraduation === '' &&
          this.search.serFailss === ''
      ) {
        return false
      }
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.search.serchengji)) {
        // 判断不带汉字的正则
        this.$message.error('成绩不要带单位!')
        return false
      } else {
        const obj = {}
        for (const key in this.search) {
          if (this.search.hasOwnProperty(key)) {
            if (this.search[key] !== '') {
              obj[key.slice(3).toLowerCase()] = this.search[key]
            }
          }
        }
        if (this.search.serchengji.$gte === '') {
          obj.chengji.$gte = 0
        }
        if (this.search.serchengji.$lte === '') {
          obj.chengji.$lte = 40
        }
        this.objselect = obj
        this.selectallstud(1, this.objselect)
      }
    },
    // 清空搜索框
    async searchQ() {
      this.selectflag = false
      this.search.serName = ''
      this.search.serStudy = ''
      this.search.serMajor = ''
      this.search.serClasses = ''
      this.search.sercityCenter = ''
      this.search.sergraduation = ''
      this.search.serFailss = ''
      this.search.serchengji.$gte = ''
      this.search.serchengji.$lte = ''
      this.getPages(1, this.pageSize)
      // 返回的时候默认展示第一页的数据
      this.currentPage = 1
    },
    // 调用导出Excel
    outExcel() {
      this.exportExcel()
    },
    // 导出函数
    exportExcel() {
      this.exportLodding = true
        import('../../excel/Export2Excel.js').then(excel => {
          const tHeader = [
            '学号',
            '姓名',
            '籍贯',
            '性别',
            '年龄',
            '学制',
            '专业',
            '班级',
            '市场部',
            '当前成绩',
            '还差成绩',
            '挂科次数',
            '入学时间'
          ]
          const filterVal = [
            'studentID',
            'name',
            'nativeplace',
            'sex',
            'age',
            'study',
            'major',
            'classes',
            'citycenter',
            'chengji',
            'graduation',
            'failss',
            'entryDate'
          ]
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '学生信息',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.exportLodding = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style>
  .el-table{
    width:99%;
    height:400px;
    overflow:auto
  }
  .top_option{
    position:absolute;
    bottom:0px;
    left:0px;
    width:100%;
    height:100%;
    overflow:hidden;
  }

  .searchbox-bs-002 {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .searchbox-bs-002>li {
    width: 10%;
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 15px;
    list-style: none;
  }

  .chengji {
    display: flex;
  }

  .chengji span {
    display: inline-block;
    margin: 5px 0 0 0;
  }

  .chengji .el-input__inner {
    padding: 0 0 0 0;
  }

  .el-table td,
  .el-table th {
    text-align: center;
  }
</style>
