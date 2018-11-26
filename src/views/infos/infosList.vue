<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button size="small" type="primary" round @click="openDialog('')">添加</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="Id" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="icon">
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" width="150">
        <template slot-scope="scope">
          <span class="over-flow">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否发布" align="center">
        <template slot-scope="scope">
          {{ scope.row.isPublish == 1 ? "已发布":"未发布" }}
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" fullscreen @close="closeDialog()">
      <el-form ref="form" :model="form">
        <el-form-item :label-width="formLabelWidth" label="标题" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上传图标" prop="logo">
          <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
            <img v-if="form.cover" :src="form.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否发布" prop="isPublish">
          <el-select v-model="form.isPublish" placeholder="是否发布">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="content">
          <div id="editor" style="text-align:left"/>
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
import * as api from '@/api/api'
import E from 'wangeditor'
import moment from 'moment'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      currentPage: 0,
      multipleSelection: [],
      options: [
        {
          value: 1,
          label: '发布'
        },
        {
          value: 0,
          label: '不发布'
        }
      ],
      editorOption: {},
      form: {
        id: '',
        title: '',
        type: '',
        cover: '',
        content: ''
      },
      uploadUrl: process.env.BASE_API + 'v1/upload_pic',
      editor: null,
      dialogFormVisible: false,
      dialogTitle: '添加',
      formLabelWidth: '120px'
    }
  },
  watch: {
    '$route'(to, from) {
      this.form.type = this.$route.path.split('/')[2]
      this.fetchData()
    }
  },
  created() {
    this.form.type = this.$route.path.split('/')[2]
    this.fetchData()
  },
  mounted() {
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
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    fetchData() {
      this.listLoading = true
      const params = {
        type: this.form.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.queryInfosListByType(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.cover = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    openDialog(id) {
      if (id !== '') {
        this.dialogTitle = '更新'
        this.form.id = id
        const params = {
          id: id
        }
        api.queryInfosById(params).then(response => {
          this.form.title = response.data.title
          this.form.isPublish = response.data.isPublish
          this.form.cover = response.data.cover
          this.form.content = response.data.content
        })
      } else {
        this.dialogTitle = '添加'
      }
      this.dialogFormVisible = true
      console.log(this.editor)
      console.log(this.form.content)
      if (this.editor === null) {
        setTimeout(() => {
          this.editor = new E('#editor')
          this.editor.customConfig.uploadImgServer = process.env.BASE_API + 'v1/upload_pic2'
          this.editor.customConfig.uploadFileName = 'file'
          this.editor.customConfig.onchange = (html) => {
            this.form.content = html
          }
          this.editor.create()
          if (this.form.content !== '' || this.form.content !== null) {
            this.editor.txt.html(this.form.content)
          }
        }, 50)
      } else {
        setTimeout(() => {
          this.editor.txt.html(this.form.content)
        }, 50)
      }
    },
    closeDialog() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    clearForm() {
      this.form.id = ''
      this.form.title = ''
      this.form.content = ''
      this.form.cover = ''
      this.$refs.form.resetFields()
    },
    addOrUpdate() {
      const params = this.form
      api.addOrUpInfos(params).then(response => {
        this.$message('操作成功')
        this.closeDialog()
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
  width: 200px;
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
  width: 378px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.over-flow{
  white-space:nowrap;
  overflow:hidden;          /*超出部分隐藏*/
  text-overflow:ellipsis;                    /*适用IE*/
  -o-text-overflow:ellipsis;                 /*适用opera*/
  }
</style>
