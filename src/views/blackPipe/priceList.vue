<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="口径(mm)" align="center">
        <template slot-scope="scope">
          {{ scope.row.caliber }}
        </template>
      </el-table-column>
      <el-table-column label="回收价格(元/cm)" align="center">
        <template slot-scope="scope">
          {{ scope.row.recyclingPrice }}
        </template>
      </el-table-column>
      <el-table-column label="截断价格(元/头)" align="center">
        <template slot-scope="scope">
          {{ scope.row.truncatedPrice }}
        </template>
      </el-table-column>
      <el-table-column label="压槽价格(元/头)" align="center">
        <template slot-scope="scope">
          {{ scope.row.pressurePrice }}
        </template>
      </el-table-column>
      <el-table-column label="车丝价格(元/头)" align="center">
        <template slot-scope="scope">
          {{ scope.row.threadingPrice }}
        </template>
      </el-table-column>
      <el-table-column label="成品管加工费比率" align="center">
        <template slot-scope="scope">
          {{ scope.row.processRate }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formatter(scope.row.updateAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="更新价格" placement="bottom">
            <a class="el-icon-edit" style="margin-right:10px" @click="openDialog(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col>
        <el-pagination :current-page="pageNum" :page-sizes="[10,20,50]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleNumChange" />
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog()">
      <el-form ref="form" :model="form">
        <el-form-item :label-width="formLabelWidth" label="回收价格(元/cm)" prop="recyclingPrice">
          <el-input v-model="form.recyclingPrice"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="截断价格(元/头)" prop="truncatedPrice">
          <el-input v-model="form.truncatedPrice"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="压槽价格(元/头)" prop="pressurePrice">
          <el-input v-model="form.pressurePrice"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="车丝价格(元/头)" prop="threadingPrice">
          <el-input v-model="form.threadingPrice"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="成品管加工费比率(0-1)" prop="processRate">
          <el-input v-model="form.processRate"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/blackPipe'
import moment from 'moment'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      multipleSelection: [],
      brandOptions: [],
      dialogFormVisible: false,
      form: {
        id: '',
        brandId: null,
        caliber: '',
        outsideDiameter: '',
        wallThickness: '',
        processMethods: [],
        weight: '',
        recyclingPrice: '',
        truncatedPrice: '',
        pressurePrice: '',
        threadingPrice: '',
        productPrice: '',
        processRate: ''
      },
      formLabelWidth: '200px',
      dialogTitle: '更新价格'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleNumChange(val) {
      this.pageNum = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.queryBlackPipePriceList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    resetData() {
      this.brandName = ''
      this.canProcess = ''
      this.canProduct = ''
    },
    searchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      api.queryBlackPipePriceList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    openDialog(item) {
      this.form.caliber = item.caliber
      this.form.recyclingPrice = item.recyclingPrice
      this.form.truncatedPrice = item.truncatedPrice
      this.form.pressurePrice = item.pressurePrice
      this.form.threadingPrice = item.threadingPrice
      this.form.processRate = item.processRate
      this.dialogFormVisible = true
    },
    closeDialog() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    clearForm() {
      this.form.id = ''
      this.$refs.form.resetFields()
    },
    update() {
      const params = this.form
      api.updateBlackPipePrice(params).then(response => {
        this.$message('操作成功')
        this.clearForm()
        this.dialogFormVisible = false
        this.fetchData()
      })
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
  margin-top: 20px;
}
.grid-content {
  min-height: 36px;
}
.icon {
  height: 40px;
}
.el-input {
  width: 130px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
