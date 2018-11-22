<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button size="small" type="primary" round @click="openDialog('')">添加车型</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="Loading"
      border
      fit
      style="width: 100%"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"/>
      <el-table-column label="最大载货长度(米)" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.maxLen }}
        </template>
      </el-table-column>
      <el-table-column label="最大载货重量(吨)" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.maxWeight }}
        </template>
      </el-table-column>
      <el-table-column label="起步距离(公里)" align="center">
        <template slot-scope="scope">
          {{ scope.row.startingDistance }}
        </template>
      </el-table-column>
      <el-table-column label="起步价(元)" align="center">
        <template slot-scope="scope">
          {{ scope.row.startingPrice }}
        </template>
      </el-table-column>
      <el-table-column label="每公里价格(元/公里)" align="center">
        <template slot-scope="scope">
          {{ scope.row.overPrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_at" label="创建时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ formatter(scope.row.createAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_at" label="更新时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ formatter(scope.row.updateAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <a class="el-icon-edit" style="margin-right:10px" @click="openDialog(scope.row.id)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <a class="el-icon-delete" @click="openDelete(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col>
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[10,20,50]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleNumChange"/>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog()">
      <el-form ref="form" :model="form">
        <el-form-item :label-width="formLabelWidth" label="最大载货长度(米)" prop="maxLen">
          <el-input v-model="form.maxLen"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="最大载货重量(吨)" prop="maxWeight">
          <el-input v-model="form.maxWeight"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="起步距离(公里)" prop="startingDistance">
          <el-input v-model="form.startingDistance"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="起步价(元)" prop="startingPrice">
          <el-input v-model="form.startingPrice"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="每公里价格(元/公里)" prop="overPrice">
          <el-input v-model="form.overPrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/order'
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
      dialogFormVisible: false,
      form: {
        id: '',
        maxLen: '',
        maxWeight: '',
        overPrice: '',
        startingDistance: '',
        startingPrice: ''
      },
      formLabelWidth: '150px',
      dialogTitle: '添加车型'
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
      api.queryTruckPriceList().then(response => {
        this.list = response.data
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    openDialog(id) {
      const params = {
        id: id
      }
      this.dialogTitle = '更新车型'
      api.queryTruckPriceInfoById(params).then(response => {
        this.form.id = response.data.id
        this.form.maxLen = response.data.maxLen
        this.form.maxWeight = response.data.maxWeight
        this.form.overPrice = response.data.overPrice
        this.form.startingDistance = response.data.startingDistance
        this.form.startingPrice = response.data.startingPrice
      })
      this.dialogFormVisible = true
    },
    closeDialog() {
      this.dialogFormVisible = false
    },
    addOrUpdate() {
      const params = this.form
      api.addOrUpTruckPriceInfo(params).then(response => {
        this.$message('操作成功')
        this.clearForm()
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    openDelete(id) {
      if (id === '') {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请先选择要删除的记录!'
          })
          return
        }
        this.multipleSelection.map((item, index) => {
          if (index === this.multipleSelection.length - 1) {
            id += item.id
          } else {
            id += item.id + ','
          }
        })
      }
      this.$confirm('此操作将删除所选记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = { ids: id }
          api.delTruckPriceInfo(params).then(response => {
            this.fetchData()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
