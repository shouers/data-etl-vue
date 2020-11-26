<template>
  <div class="count">
    <h1>统计数据</h1>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-date-picker v-model="searchForm.searchDt" type="month" value-format="yyyy-MM" placeholder="选择查询月份"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="searchCount">查询</el-button>
        <el-button type="primary" size="medium" @click="uploadCount">导入</el-button>
        <el-button type="primary" size="medium" @click="downloadCount">导出</el-button>
      </el-form-item>
    </el-form>

    <div class="content">
      <el-table :data="tableData" style="width: 100%" id="typeSumIncProData-table">
        <el-table-column prop="businessName" label="企业名称" width="180"/>
        <el-table-column prop="businessCode" label="企业统一社会信用代码" width="260"/>
        <el-table-column prop="businessPark" label="企业所属功能区" width="170"/>
        <el-table-column prop="businessHouse" label="企业所属楼宇" width="170"/>
        <el-table-column prop="businessType" label="企业高精尖产业类别" width="170"/>
        <el-table-column prop="creator" label="创建人" width="150"/>
        <el-table-column prop="createTime" label="创建时间" width="160"/>
      </el-table>
    </div>

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
        },
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
      this.getCountData();
    },
    methods: {
      searchCount() {
        this.getCountData();
      },

      getCountData() {
        let _this = this;
        let requestConfig = {
          headers: {
            'Content-Type': 'application/json'
          },
        }
        _this.axios.post('count/getCountData', _this.searchForm, requestConfig).then((res) => {
          if (res.status === 200) {
            console.log("res===", res);
            _this.tableData = res.data.data;
          } else {
            _this.$message.error(res.data.data.msg)
          }
        })
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
        var workbook = XLSX.utils.book_new();

        /* convert table 'table1' to worksheet named "Sheet1" */
        var ws1 = XLSX.utils.table_to_sheet(document.querySelector('#typeSumIncProData-table'));
        XLSX.utils.book_append_sheet(workbook, ws1, "统计数据");

        /* get binary string as output */
        var wbOut = XLSX.write(workbook, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbOut], { type: "application/octet-stream" }),
            "统计数据.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbOut);
        }
        return wbOut;
      },

    }

  }
</script>

<style scoped>
  .count  .taxContent  .content{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    line-height: 80px;
  }
  .count  .taxContent  .content1{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    line-height: 80px;
    height: 778px;
  }
  .count  .taxContent  .content .title{
    margin-top: 30px;
    line-height: 50px;
  }
  .count  .taxContent .form_right {
    position: absolute;
    left: 100px;
  }
  .count  .taxContent .el-form--inline .el-form-item {
    margin-bottom: 5px;
  }
</style>
