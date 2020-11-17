<template>
  <div class="taxation">
    <h1>统计数据</h1>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchForm.user" placeholder="选择导入月份" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.region" placeholder="选择导入税种">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">重置</el-button>
        <el-button type="primary">导入</el-button>
        <el-button type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="taxContent">
      <el-col :span="10">
        <div class="content" style="margin-bottom: 10px;">
          <p class="title">
            全区月度纳税总额
          </p>
          <p style="color: red;text-align: center;">
            <span style="font-size: 32px;">{{ count }}</span>
            万元
          </p>
        </div>
        <div class="content">
          <p class="title">
            全区月度纳税总额
          </p>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
        </div>

      </el-col>

      <el-col :span="4">
        <div class="content">
          <p class="title">
            全区月度纳税总额
          </p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchForm.user" placeholder="输入楼宇名称" size="mini" />
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="50"
          />
        </div>
      </el-col>

      <el-col :span="10">
        <div class="content" style="position: relative;">
          <p class="title">
            全区月度纳税总额
          </p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchForm.user" placeholder="选择导入月份" size="mini" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.region" placeholder="选择导入税种" size="mini">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="50"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchForm: {},
        count: 18512,
        tableData: []
      }
    },
    mounted() {
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
</script>

<style scoped>
  .taxation  .taxContent  .content{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }
  .taxation  .taxContent  .content .title{
    border-left: 5px solid #ccc;
    padding-left: 10px;
    margin: 0px;
  }
  .taxation  .taxContent .form_right {
    position: absolute;
    left: 100px;
  }
  .taxation  .taxContent .el-form--inline .el-form-item {
    margin-bottom: 5px;
  }
</style>
