<template>
  <div class="count">
    <h1>统计数据</h1>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-date-picker v-model="searchForm.searchDt" type="month" value-format="yyyy-MM" placeholder="选择导入月份"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="searchCount">查询</el-button>
        <el-button type="primary" size="medium" @click="clearCount">重置</el-button>
        <el-button type="primary" size="medium" @click="uploadCount">导入</el-button>
        <el-button type="primary" size="medium" @click="downloadCount">导出</el-button>
        <el-button type="primary" size="medium" @click="doCount">执行</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="taxContent">
      <el-col :span="10">
        <div class="content" style="margin-bottom: 10px;">
          <p class="title">全区月度收入总额</p>
          <p style="color: red;text-align: center;">
            <span style="font-size: 32px;">{{ count }}</span>万元
          </p>
        </div>
        <div class="content" style="margin-bottom: 10px;">
          <p class="title">全区月度利润总额</p>
          <p style="color: red;text-align: center;">
            <span style="font-size: 32px;">{{ count }}</span>万元
          </p>
        </div>
        <div class="content">
          <p class="title">各高精尖产业月度收入及利润总额</p>
          <el-table :data="typeSumIncProData" style="width: 100%">
            <el-table-column prop="businessType" label="产业区" width="130" fixed/>
            <el-table-column prop="sumIncome" label="收入总额" width="130" fixed/>
            <el-table-column prop="sumProfit" label="利润总额" width="130" fixed/>
            <el-table-column prop="dtCount" label="月份" width="130"/>
            <el-table-column
              v-for="(item, index) in businessTypeList"
              :prop="type + index" :key="item" :label="item" >
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="content">
          <p class="title">各功能区月度收入及利润总额</p>
          <el-table :data="parkSumIncProData" style="width: 100%">
            <el-table-column prop="businessPark" label="功能区" width="130" fixed/>
            <el-table-column prop="sumIncome" label="收入总额" width="130" fixed/>
            <el-table-column prop="sumProfit" label="利润总额" width="130" fixed/>
            <el-table-column prop="dtCount" label="月份" width="130"/>
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
          <p class="title">企业月度企业收入/利润总额</p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="searchForm.countSort" placeholder="请选择排序" size="mini">
                <el-option label="按收入总额排序" value="sumIncome" />
                <el-option label="按环比收入排序" value="chainIncome" />
                <el-option label="按环比收入增长排序" value="chainIncomeInc" />
                <el-option label="按利润总额排序" value="sumProfit" />
                <el-option label="按环比利润排序" value="chainProfit" />
                <el-option label="按环比利润增长排序" value="chainProfitInc" />
                <el-option label="按环比增加20%的企业名单" value="chainInc20" />
                <el-option label="按环比减少20%的企业名单" value="chainDec20" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.countType" placeholder="请选择类型" size="mini">
                <el-option label="收入" value="income" />
                <el-option label="利润" value="profit" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="businessSumIncProData" style="width: 100%">
            <el-table-column prop="businessName" label="企业名称" width="130" fixed/>
            <el-table-column prop="chainIncome" label="环比收入变化" width="160" fixed/>
            <el-table-column prop="chainProfit" label="环比利润变化" width="160" fixed/>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="50"
          />
        </div>
      </el-col>

      <el-col :span="4">
        <div class="content">
          <p class="title">各楼宇月度收入总额</p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchForm.houseName" placeholder="输入楼宇名称" size="mini" />
            </el-form-item>
          </el-form>
          <el-table :data="houseSumIncProData" style="width: 100%">
            <el-table-column prop="businessHouse" label="企业所属楼宇" width="130" fixed/>
            <el-table-column prop="sumTax" label="纳税总额" width="160" fixed/>
            <el-table-column prop="dtTax" label="纳税月" width="130"/>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="50"
          />
        </div>
      </el-col>

    </el-row>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogAddFile" width="500px" style="padding:0;" @close="resetUpload">
      上传文件:
      <el-upload
        class="upload-demo"
        ref="upload"
        action="doUpload"
        :limit="1"
        :file-list="fileList"
        :before-upload="beforeUpload">
        <el-date-picker v-model="searchForm.uploadDt" type="month" value-format="yyyy-MM" placeholder="请选择年/月" size="mini" />
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <a href="./demo.xlsx" rel="external nofollow" download="模板"><el-button size="small" type="success">下载模板</el-button></a>
        <div slot="tip" class="el-upload__tip">注意: 只能上传excel文件</div>
        <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFile = false">取消</el-button>
        <el-button type="primary" @click="submitAddFile()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        dialogAddFile: false,
        dialogStatus: '',
        titleMap: {
          uploadTaxation: "上传统计数据"
        },
        fileList: [],
        fileName: '',
        files: '',

        searchForm: {
          searchDt: '',
          uploadDt: '',
          countSort: 'sumIncome',
          countType: 'income',
        },
        count: 18512,
        businessTypeList: [],
        typeSumIncProData: [],
        parkSumIncProData: [],
        businessSumIncProData: [],
        houseSumIncProData: [],
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
    },
    created() {
      this.getBusinessTypeList();
    },
    methods: {
      getBusinessTypeList() {
        let _this = this;
        _this.axios.post('count/getBusinessTypeList').then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.businessTypeList = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      searchCount() {
        this.getCount();
      },

      getCount() {
        let _this = this;
        _this.getTypeSumIncProData();
        _this.getParkSumIncProData();
        _this.getBusinessSumIncProData();
        _this.getHouseSumIncProData();
      },

      getTypeSumIncProData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('count/getTypeSumIncProData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.typeSumIncProData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getParkSumIncProData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('count/getParkSumIncProData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.parkSumIncProData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getBusinessSumIncProData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('count/getBusinessSumIncProData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.businessSumIncProData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getHouseSumIncProData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('count/getHouseSumIncProData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.houseSumIncProData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      clearCount() {
        let _this = this;
        _this.searchForm.searchDt = '';
      },

      uploadCount() {
        let _this = this;
        _this.dialogAddFile = true;
        _this.dialogStatus = "uploadCount";
      },

      beforeUpload(file){
        console.log(file,'文件');
        this.files = file;
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        // const isLt2M = file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xls、xlsx 格式!');
          return false;
        }
        // if (!isLt2M) {
        //   this.$message.warning('上传模板大小不能超过 5MB!');
        //   return false;
        // }
        this.fileName = file.name;
        return false; // 返回false不会自动上传
      },

      submitAddFile() {
        console.log('上传 ' + this.files.name)
        if (this.fileName == "") {
          this.$message.warning('请选择要上传的文件！')
          return false;
        }
        if (this.searchForm.uploadDt == "") {
          this.$message.warning('请选择要上传的月份！')
          return false;
        }
        let fileFormData = new FormData();
        fileFormData.append('file', this.files, this.fileName);// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
        fileFormData.append('dt', this.searchForm.uploadDt);
        let requestConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
        this.axios.post('count/uploadCount', fileFormData, requestConfig).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogAddFile = false;
                this.$emit('getCount');
              }
            })
          } else {
            this.$message.error(res.data.data.msg)
          }
        })
      },

      resetUpload() {
        let _this = this;
        _this.dialogAddFile = false;
      },

      downloadCount() {

      },

      doCount() {
        let requestConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }

        let _this = this;
        let dtCount = _this.searchForm.searchDt;
        _this.axios.post('count/doCount?dtCount='+dtCount, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

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
