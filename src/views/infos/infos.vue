<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form">
          <el-form-item label="图片" prop="cover">
            <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
              <img v-if="form.cover" :src="form.cover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item prop="content">
            <div id="editor" style="text-align:left"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from '@/api/api'
import E from 'wangeditor'

export default {
  data() {
    return {
      listLoading: true,
      editorOption: {},
      form: {
        id: '',
        cover: '',
        content: ''
      },
      uploadUrl: process.env.BASE_API + 'v1/upload_pic',
      uploadUrl2: '/v1/upload_pic2',
      editor: {}
    }
  },
  watch: {
    '$route'(to, from) {
      this.form.id = this.$route.path.split('/')[2]
      this.fetchData()
    }
  },
  created() {
    this.form.id = this.$route.path.split('/')[2]
    this.fetchData()
  },
  mounted() {
    this.editor = new E('#editor')
    this.editor.customConfig.uploadImgServer = process.env.BASE_API + 'v1/upload_pic2'
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.customConfig.onchange = (html) => {
      this.form.content = html
    }
    this.editor.create()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        id: this.form.id
      }
      api.queryInfosById(params).then(response => {
        this.form.cover = response.data.cover
        this.form.content = response.data.content
        this.editor.txt.clear()
        this.editor.txt.html(response.data.content)
        this.listLoading = false
      })
    },
    onSubmit() {
      const params = this.form
      // console.log(params)
      api.addOrUpInfos(params).then(response => {
        this.$message('操作成功')
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
</style>
