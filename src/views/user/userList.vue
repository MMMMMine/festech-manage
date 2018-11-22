<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <span style="font-size:16px">uid:</span>
        <el-input v-model="uid" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </el-col>
      <el-col :span="8">
        <span style="font-size:16px">手机号:</span>
        <el-input v-model="phone" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </el-col>
      <el-col :span="8">
        <span style="font-size:16px">昵称:</span>
        <el-input v-model="nickname" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="Id" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
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
          <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom">
            <a class="el-icon-info" style="margin-right:10px" @click="openDialog(scope.row.uid)" />
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
      <el-row>
        <el-col :span="8">
          <el-row>
            用户基础信息:
          </el-row>
          <el-form ref="form" :model="form.userBasicInfo" label-position="right" label-width="150px">
            <el-form-item :label-width="formLabelWidth" label="uid:" prop="uid">
              <div >{{ form.uid }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="昵称:" prop="nickname">
              <div >{{ form.userBasicInfo.nickname }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="手机:" prop="phone">
              <div >{{ form.userBasicInfo.phone }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="注册时间:" prop="createAt">
              <div >{{ formatter(form.updateAt) }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-row>
            用户银行卡信息:
          </el-row>
          <el-form ref="form" :model="form.userReceiptCardInfo" label-position="right" label-width="150px">
            <el-form-item :label-width="formLabelWidth" label="银行名称:" prop="bankName">
              <div>{{ form.userReceiptCardInfo.bankName }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="开户行名称:" prop="branchName">
              <div>{{ form.userReceiptCardInfo.branchName }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="卡号:" prop="cardNo">
              <div>{{ form.userReceiptCardInfo.cardNo }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="真实姓名" prop="realName">
              <div>{{ form.userReceiptCardInfo.realName }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-row>
            用户发票信息:
          </el-row>
          <el-form ref="form" :model="form.userInvoiceInfo" label-position="right" label-width="150px">
            <el-form-item :label-width="formLabelWidth" label="企业名称:" prop="companyName">
              <div>{{ form.userInvoiceInfo.companyName }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="纳税人识别号:" prop="taxpayerIdNum">
              <div>{{ form.userInvoiceInfo.taxpayerIdNum }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="开户行名称:" prop="branchName2">
              <div>{{ form.userInvoiceInfo.branchName }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="卡号:" prop="cardNo2">
              <div>{{ form.userInvoiceInfo.cardNo }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="注册地址:" prop="registerAddr">
              <div>{{ form.userInvoiceInfo.registerAddr }}</div>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="注册电话:" prop="registerPhone">
              <div>{{ form.userInvoiceInfo.registerPhone }}</div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-card>
        <div slot="header">
          <span>收货地址:</span>
        </div>
        <div v-for="item in form.userAddrInfoList" :key="item">
          <span>收货地址: {{ item.addrArea }} {{ item.receiverAddr }}    </span>
          <span>收货人: {{ item.receiverName }}    </span>
          <span>联系电话: {{ item.receiverPhone }}</span>
        </div>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/user'
import moment from 'moment'

// console.log(moment)
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
      uid: '',
      phone: '',
      nickname: '',
      form: {
        uid: '',
        userBasicInfo: {
          phone: '',
          nickname: ''
        },
        userReceiptCardInfo: {
          bankName: '',
          branchName: '',
          cardNo: '',
          realName: ''
        },
        userInvoiceInfo: {
          companyName: '',
          taxpayerIdNum: '',
          branchName: '',
          cardNo: '',
          registerAddr: '',
          registerPhone: ''
        },
        userAddrInfoList: []
      },
      formLabelWidth: '200px',
      dialogTitle: '用户详情'
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
      api.queryUserList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },

    resetData() {
      this.uid = ''
      this.phone = ''
      this.nickname = ''
    },
    searchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      api.queryUserList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    openDialog(uid) {
      if (uid !== '') {
        this.form.uid = uid
        const params = {
          uid: uid
        }
        api.queryUserInfo(params).then(response => {
          this.form.userBasicInfo = response.data.userBasicInfo
          if (response.data.userInvoiceInfo !== null) {
            this.form.userInvoiceInfo = response.data.userInvoiceInfo
          }
          if (response.data.userReceiptCardInfo !== null) {
            this.form.userReceiptCardInfo = response.data.userReceiptCardInfo
          }
          this.form.userAddrInfoList = response.data.userAddrInfoList.list
        })
      }

      this.dialogFormVisible = true
    },
    closeDialog() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    clearForm() {
      this.form.uid = ''
      this.$refs.form.resetFields()
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
  width: 150px;
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
