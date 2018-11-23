<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form">
          <el-form-item label="上传图片" prop="cover">
            <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
              <img v-if="form.cover" :src="form.cover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <div id="editorElem" style="text-align:left"/>
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
      uploadUrl2: '/v1/upload_pic2'
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    var editor = new E('#editorElem')
    editor.customConfig.uploadImgServer = process.env.BASE_API + 'v1/upload_pic2'
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.create()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        id: 1
      }
      api.queryInfosById(params).then(response => {

        this.listLoading = false
      })
    },
    getContent: function() {
      alert(this.editorContent)
    },
    onSubmit() {
    },
    handleAvatarSuccess(res, file) {
      this.form.logo = res.data
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
