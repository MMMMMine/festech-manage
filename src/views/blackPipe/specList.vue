<template>
  <div class="app-container">
    <!-- <el-row>
      <el-col :span="4">
        <span style="font-size:16px">品牌名:</span>
        <el-input v-model="brandName" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </el-col>
      <el-col :span="4">
        <span style="font-size:16px">是否能加工:</span>
        <el-select v-model="canProcess" size="small" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span style="font-size:16px">是否有成品管:</span>
        <el-select v-model="canProduct" size="small" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row> -->
    <!-- <el-row>
      <el-col :span="4">
        <el-button type="info" icon="el-icon-refresh" @click="resetData">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col>
        <el-button size="small" type="primary" round @click="openDialog('')">添加规格</el-button>
        <!--<el-button size="small" type="warn" round @click="openPublish('')">批量发布</el-button>-->
        <!--<el-button size="small" type="warn" round @click="openRevoke('')">批量下架</el-button>-->
        <el-button size="small" type="danger" round @click="openDelete('')">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="Id" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名" align="center">
        <template slot-scope="scope">
          {{ scope.row.brandName }}
        </template>
      </el-table-column>
      <el-table-column label="口径(mm)" align="center">
        <template slot-scope="scope">
          {{ scope.row.caliber }}
        </template>
      </el-table-column>
      <el-table-column label="外径(mm)" align="center">
        <template slot-scope="scope">
          {{ scope.row.outsideDiameter }}
        </template>
      </el-table-column>
      <el-table-column label="壁厚(mm)" align="center">
        <template slot-scope="scope">
          {{ scope.row.wallThickness }}
        </template>
      </el-table-column>
      <el-table-column label="可选加工方式" align="center" width="280">
        <template slot-scope="scope">
          {{ handlerProcessMethods(scope.row.processMethods) }}
        </template>
      </el-table-column>
      <el-table-column label="6米管重量(kg/支)" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="6米管单价(元/支)" align="center">
        <template slot-scope="scope">
          {{ scope.row.productPrice }}
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
      <el-table-column align="center" prop="create_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formatter(scope.row.createAt) }}</span>
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
        <el-pagination :current-page="pageNum" :page-sizes="[10,20,50]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleNumChange" />
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog()">
      <el-form ref="form" :model="form">
        <el-form-item :label-width="formLabelWidth" label="品牌名" prop="brandName">
          <el-select v-model="form.brandId" placeholder="请选择品牌">
            <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="口径" prop="caliber">
          <el-input v-model="form.caliber"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="外径" prop="outsideDiameter">
          <el-input v-model="form.outsideDiameter"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="壁厚" prop="wallThickness">
          <el-input v-model="form.wallThickness"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="加工方式">
          <el-checkbox-group v-model="form.processMethods">
            <el-checkbox-button label="0" name="type">车丝*2</el-checkbox-button>
            <el-checkbox-button label="1" name="type">压槽*2</el-checkbox-button>
            <el-checkbox-button label="2" name="type">车丝*1,压槽*1</el-checkbox-button>
            <el-checkbox-button label="3" name="type">不加工</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="6米管重量(kg/支)" prop="weight">
          <el-input v-model="form.weight"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="6米管单价(元/支)" prop="productPrice">
          <el-input v-model="form.productPrice"/>
        </el-form-item>
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
        <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
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
      dialogTitle: '添加规格'
    }
  },
  created() {
    this.fetchData()
    this.fetchBrandData()
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
      api.queryBlackPipeList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    fetchBrandData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: 100
      }
      api.queryBlackPipeBrandList(params).then(response => {
        const brandList = response.data.list
        brandList.forEach(element => {
          const one = {
            value: element.id,
            label: element.brandName
          }
          this.brandOptions.push(one)
        })
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

      api.queryBlackPipeList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    openDialog(id) {
      if (id !== '') {
        this.dialogTitle = '更新品牌'
        this.form.id = id
        const params = {
          id: id
        }
        api.queryBlackPipeById(params).then(response => {
          this.form.brandId = response.data.brandId
          this.form.caliber = response.data.caliber
          this.form.outsideDiameter = response.data.outsideDiameter
          this.form.wallThickness = response.data.wallThickness
          this.form.recyclingPrice = response.data.recyclingPrice
          this.form.truncatedPrice = response.data.truncatedPrice
          this.form.pressurePrice = response.data.pressurePrice
          this.form.threadingPrice = response.data.threadingPrice
          this.form.productPrice = response.data.productPrice
          this.form.processRate = response.data.processRate
          this.form.processMethods = response.data.processMethods.split(',')
          this.form.weight = response.data.weight
        })
      }

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
    addOrUpdate() {
      const params = this.form
      // console.log(params);
      api.addOrUpBlackPipeInfo(params).then(response => {
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
      // console.log('ids=' + id)
      this.$confirm('此操作将删除所选记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = { ids: id }
          api.delBlackPipeInfo(params).then(response => {
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
    },
    handlerProcessMethods(processMethods) {
      const a = processMethods.split(',')
      let b = ''
      a.forEach(element => {
        if (element === '0') {
          b += '车丝*2||'
        } else if (element === '1') {
          b += '压槽*2||'
        } else if (element === '2') {
          b += '车丝*1,压槽*1||'
        } else if (element === '3') {
          b += '不加工||'
        }
      })
      b = b.substring(0, b.length - 2)
      return b
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
