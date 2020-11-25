<template>
  <div class="taxation">
    <h1>税务数据</h1>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-date-picker v-model="searchForm.searchDt" type="month" value-format="yyyy-MM" placeholder="选择导入月份"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.taxType" placeholder="选择导入税种">
          <el-option label="增值税" value="add" />
          <el-option label="所得税" value="income" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="searchTaxation">查询</el-button>
        <el-button type="primary" size="medium" @click="clearTaxation">重置</el-button>
        <el-button type="primary" size="medium" @click="uploadTaxation">导入</el-button>
        <el-button type="primary" size="medium" @click="downloadTaxation">导出</el-button>
        <el-button type="primary" size="medium" @click="doTaxation">执行</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="taxContent">
      <el-col :span="10">
        <div class="content" style="margin-bottom: 10px; height: 160px">
          <p class="title">全区月度纳税总额</p>
          <p style="color: red;text-align: center; padding: 0; line-height: 20px;">
            <span style="font-size: 30px;">{{ taxCount }}</span>万元
          </p>
        </div>
        <div class="content">
          <p class="title">功能区各高精尖行业纳税总额</p>
          <el-table :data="parkTypeSumTaxData" show-summary style="width: 100%" id="parkTypeSumTaxData-table">
            <el-table-column prop="businessPark" label="功能区" width="130"/>
            <el-table-column
              v-for="(item, index) in businessTypeList"
              :prop="type + index" :key="item" :label="item" >
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :span="5">
        <div class="content">
          <p class="title">各商务楼宇月度纳税总额</p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchForm.houseName" placeholder="输入楼宇名称" size="mini" />
            </el-form-item>
          </el-form>
          <el-table :data="houseSumTaxData" style="width: 100%" id="houseSumTaxData-table">
            <el-table-column prop="businessHouse" label="企业所属楼宇" width="130"/>
            <el-table-column prop="sumTax" label="纳税总额" width="160"/>
            <el-table-column prop="dtTax" label="纳税月" width="130"/>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="50"
          />
        </div>
      </el-col>

      <el-col :span="9">
        <div class="content" style="position: relative;">
          <p class="title">企业月度纳税总额</p>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
              <el-date-picker v-model="searchForm.businessDt" type="month" value-format="yyyy-MM" placeholder="请选择年/月" size="mini" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.taxSort" placeholder="请选择排序" size="mini">
                <el-option label="按月度纳税额排序" value="monthTax" />
                <el-option label="按环比纳税额排序" value="chainTax" />
                <el-option label="按环比增长排序" value="chainInc" />
                <el-option label="按环比增加20%的企业名单" value="chainInc20" />
                <el-option label="按环比减少20%的企业名单" value="chainDec20" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="businessSumTaxData" style="width: 100%" id="businessSumTaxData-table">
            <el-table-column prop="businessName" label="企业名称" width="260"/>
            <el-table-column prop="chainTax" label="纳税总额环比" width="380"/>
            <el-table-column prop="dtTax" label="纳税月" width="260"/>
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
          uploadTaxation: "上传税务数据"
        },
        fileList: [],
        fileName: '',
        files: '',

        searchForm: {
          searchDt: '',
          uploadDt: '',
          businessDt: '',
          taxType: 'add',
          houseName: '',
          taxSort: 'monthTax',
        },
        taxCount: 0,
        count: 18512,
        type: 'type',
        businessTypeList: [],
        parkTypeSumTaxData: [],
        houseSumTaxData: [],
        businessSumTaxData: [],
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
        _this.axios.post('taxation/getBusinessTypeList').then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.businessTypeList = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      searchTaxation() {
        this.getTaxation();
      },

      getTaxation() {
        let _this = this;
        _this.getTaxCount();
        _this.getParkTypeSumTaxData();
        _this.getHouseSumTaxData();
        _this.getBusinessSumTaxData();
      },

      getTaxCount() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('taxation/getTaxCount', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.taxCount = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getParkTypeSumTaxData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('taxation/getParkTypeSumTaxData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.parkTypeSumTaxData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getHouseSumTaxData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('taxation/getHouseSumTaxData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.houseSumTaxData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      getBusinessSumTaxData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('taxation/getBusinessSumTaxData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.businessSumTaxData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
      },

      clearTaxation() {
        let _this = this;
        _this.searchForm.searchDt = '';
        _this.searchForm.taxType = 'add';
      },

      uploadTaxation() {
        let _this = this;
        _this.dialogAddFile = true;
        _this.dialogStatus = "uploadTaxation";
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
        this.axios.post('taxation/uploadTaxation', fileFormData, requestConfig).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogAddFile = false;
                this.$emit('getTaxation');
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

      downloadTaxation() {
        var workbook = XLSX.utils.book_new();

        /* convert table 'table1' to worksheet named "Sheet1" */
        var ws1 = XLSX.utils.table_to_sheet(document.querySelector('#parkTypeSumTaxData-table'));
        XLSX.utils.book_append_sheet(workbook, ws1, "功能区各高精尖行业纳税总额");

        /* convert table 'table2' to worksheet named "Sheet2" */
        var ws2 = XLSX.utils.table_to_sheet(document.querySelector('#houseSumTaxData-table'));
        XLSX.utils.book_append_sheet(workbook, ws2, "各商务楼宇月度纳税总额");

        var ws3 = XLSX.utils.table_to_sheet(document.querySelector('#businessSumTaxData-table'));
        XLSX.utils.book_append_sheet(workbook, ws3, "企业月度纳税总额");

        /* get binary string as output */
        var wbOut = XLSX.write(workbook, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbOut], { type: "application/octet-stream" }),
            "税务数据.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbOut);
        }
        return wbOut;
      },

      doTaxation() {
        let requestConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }

        let _this = this;
        let dtTax = _this.searchForm.searchDt;
        _this.axios.post('taxation/doTaxation?dtTax='+dtTax, requestConfig).then((res) => {
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
    line-height: 80px;
  }
  .taxation  .taxContent  .content .title{
    margin-top: 30px;
    line-height: 50px;
  }
  .taxation  .taxContent .form_right {
    position: absolute;
    left: 100px;
  }
  .taxation  .taxContent .el-form--inline .el-form-item {
    margin-bottom: 5px;
  }
</style>
