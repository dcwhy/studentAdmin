<!-- 首页 -->
<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <!-- 学生人数 -->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">学生人数</div>
            <count-to
              :start-val="0"
              :end-val="getPage"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <!-- 班级 -->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="classgl" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">班级</div>
            <count-to
              :start-val="0"
              :end-val="getClass"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <!-- 班主任 -->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="headmasterList" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">班主任</div>
            <count-to
              :start-val="0"
              :end-val="getHeadAll"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <!-- 讲师 -->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="lecturer" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">讲师</div>
            <count-to
              :start-val="0"
              :end-val="getTeacherAll"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;">
      <EcharsZhu :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to';
import { getPage, getClass } from '@/api/api';
import {getHeadAll,getTeacherAll} from '@/api/headAll.js'
import EcharsZhu from './echars/echarszhu';

const lineChartData = {
  newVisitis: {
    webData: [9000, 10000, 15000, 16000, 13000, 13000, 12000, 12000, 15000, 16000, 14000, 14000],
    uiData: [8000, 10000, 13000, 13000, 11000, 11000, 11000, 11000, 12000, 12000, 11000, 10000]
  }
};
export default {
  name: 'Dashboard',
  components: { CountTo, EcharsZhu },
  data() {
    return {
      getPage: 0, // 学生
      getClass: 0, // 班级
      getHeadAll:0, // 班主任
      getTeacherAll:0, // 讲师
      lineChartData: lineChartData.newVisitis
    };
  },
  async mounted() {
    // 获取学生总人数
    const { data } = await getPage();
    this.getPage = data.total;

    // 获取班级数量
    const Class = await getClass();
    this.getClass = Class.data.data.length;

    // 获取班主任总数量
    const HeadAll = await getHeadAll();
    this.getHeadAll = HeadAll.data.total;

    // 获取讲师总数量
    const TeacherAll = await getTeacherAll();
    this.getTeacherAll = TeacherAll.data.total;
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 15px;
  }
  &-text {
    font-size: 18px;
    line-height: 46px;
  }
}
.panel-group {
  margin: 18px 20px 0 !important;
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
