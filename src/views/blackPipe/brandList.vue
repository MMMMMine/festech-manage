<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <span style="font-size:16px">品牌名:</span>
        <el-input v-model="brandName" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </el-col>
      <el-col :span="4">
        <span style="font-size:16px">是否能加工:</span>
        <el-select v-model="canProcess" size="small" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span style="font-size:16px">是否有成品管:</span>
        <el-select v-model="canProduct" size="small" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button type="info" icon="el-icon-refresh" @click="resetData">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button size="small" type="primary" round @click="openDialog('')">添加品牌</el-button>
        <el-button size="small" type="danger" round @click="openDelete('')">删除品牌</el-button>
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
      <el-table-column label="logo" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" class="icon">
        </template>
      </el-table-column>
      <el-table-column label="是否能加工" align="center">
        <template slot-scope="scope">
          {{ scope.row.canProcess == 1 ? "能":"否" }}
        </template>
      </el-table-column>
      <el-table-column label="是否有成品管" align="center">
        <template slot-scope="scope">
          {{ scope.row.canProduct == 1 ? "能":"否" }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_at" label="创建时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formatter(scope.row.createAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_at" label="更新时间" width="300">
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
        <el-form-item :label-width="formLabelWidth" label="品牌名称" prop="brandName">
          <el-input v-model="form.brandName"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否能加工" prop="canProcess">
          <el-select v-model="form.canProcess" placeholder="请选择是否能加工">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否有成品管" prop="canProduct">
          <el-select v-model="form.canProduct" placeholder="请选择是否有成品管">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上传图标" prop="logo">
          <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
            <img v-if="form.logo" :src="form.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
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
      options: [
        {
          value: 1,
          label: '能'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      brandName: '',
      canProcess: null,
      canProduct: null,
      dialogFormVisible: false,
      form: {
        id: '',
        brandName: '',
        canProcess: null,
        canProduct: null,
        logo: ''
      },
      formLabelWidth: '120px',
      dialogTitle: '添加品牌',
      uploadUrl: process.env.BASE_API + '/v1/upload_pic'
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
      api.queryBlackPipeBrandList(params).then(response => {
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
      params['brandName'] = this.brandName
      params['canProcess'] = this.canProcess
      params['canProduct'] = this.canProduct

      api.queryBlackPipeBrandList(params).then(response => {
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
        api.queryBlackPipeBrandById(params).then(response => {
          this.form.brandName = response.data.brandName
          this.form.canProcess = response.data.canProcess
          this.form.canProduct = response.data.canProduct
          this.form.logo = response.data.logo
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
      api.addOrUpBlackPipeBrandInfo(params).then(response => {
        this.$message('操作成功')
        this.clearForm()
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.logo = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG || !isPNG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
          api.delBlackPipeBrandInfo(params).then(response => {
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
