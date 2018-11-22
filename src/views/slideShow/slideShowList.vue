<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button size="small" type="primary" round @click="openDialog('')">添加轮播图</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="Id" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cover" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="icon">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.isPublish == 1 ? "已上架":"未上架" }}
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center">
        <template slot-scope="scope">
          {{ scope.row.sort }}
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
        <el-form-item :label-width="formLabelWidth" label="权重" prop="sort">
          <el-input v-model="form.sort"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否上架" prop="isPublish">
          <el-select v-model="form.isPublish" placeholder="请选择是否上架">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上传封面" prop="cover">
          <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
            <img v-if="form.cover" :src="form.cover" class="avatar">
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
import * as api from '@/api/slideShow'
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
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      dialogFormVisible: false,
      form: {
        id: '',
        sort: '',
        isPublish: null,
        cover: ''
      },
      formLabelWidth: '120px',
      dialogTitle: '添加轮播图',
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
      api.querySlideShowList(params).then(response => {
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
      if (id !== '') {
        this.dialogTitle = '更新轮播图'
        this.form.id = id
        const params = {
          id: id
        }
        api.querySlideShowById(params).then(response => {
          this.form.cover = response.data.cover
          this.form.isPublish = response.data.isPublish
          this.form.sort = response.data.sort
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
      api.addOrUpSlideShowInfo(params).then(response => {
        this.$message('操作成功')
        this.clearForm()
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.cover = res.data
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
          api.delSlideShowInfo(params).then(response => {
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
