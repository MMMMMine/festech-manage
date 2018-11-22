<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <span style="font-size:16px">订单号:</span>
        <el-input v-model="orderNo" size="small" placeholder="请输入订单号" prefix-icon="el-icon-search" />
      </el-col>
      <el-col :span="12">
        <span style="font-size:16px">下单手机号:</span>
        <el-input v-model="phone" size="small" placeholder="请输入手机号" prefix-icon="el-icon-search" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button type="info" icon="el-icon-refresh" @click="resetData">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="订单号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="下单用户手机号" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          {{ getOrderStatusDes(scope.row.orderStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="运费(元)" align="center">
        <template slot-scope="scope">
          {{ scope.row.freight }}
        </template>
      </el-table-column>
      <el-table-column label="订单总价(元)" align="center">
        <template slot-scope="scope">
          {{ scope.row.priceTotal }}
        </template>
      </el-table-column>
      <el-table-column label="是否有加工管" align="center">
        <template slot-scope="scope">
          {{ scope.row.hasProcess == 1 ? "有":"无" }}
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
          <el-tooltip class="item" effect="dark" content="进行验收" placement="bottom">
            <a class="el-icon-more" style="margin-right:10px" @click="openDialog(scope.row.orderNo)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col>
        <el-pagination :current-page="pageNum" :page-sizes="[10,20,50]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleNumChange" />
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%" @close="closeDialog()">
      <el-row>
        <span>订单号</span>
        <el-input v-model="form.orderNo" disabled/>
      </el-row>
      <el-table v-loading="listLoading" :data="form.processPipeList" stripe element-loading-text="Loading" border fit style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column label="品牌" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.brandName }}
          </template>
        </el-table-column>
        <el-table-column label="镀锌管名称" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.blackPipeName }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column label="最低重量(吨)" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.lessWeight }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template slot-scope="scope">
            {{ getProcessPipeStatusDes(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-select v-model="form.checkingResult[scope.$index].res" placeholder="操作" @change="getWallThicknessOptions(scope.$index)">
              <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-select v-if="form.checkingResult[scope.$index].res == 'wall_thickness_degrade' && form.wallThicknessOptions.length" v-model="form.checkingResult[scope.$index].changedBlackPipeId" placeholder="壁厚" @change="getBlackPipeName">
              <el-option v-for="item in form.wallThicknessOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="checkingConfirm">确 定</el-button>
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
      orderStatusOptions: [
        {
          value: 'init',
          label: '待付款'
        },
        {
          value: 'checking',
          label: '待验收'
        },
        {
          value: 'checking_error',
          label: '验收异常'
        },
        {
          value: 'processing',
          label: '加工中'
        },
        {
          value: 'transport',
          label: '配送/自提'
        },
        {
          value: 'canceled',
          label: '已取消'
        },
        {
          value: 'expired',
          label: '超时已取消'
        },
        {
          value: 'finish',
          label: '已完成'
        }
      ],
      processPipeStatusOptions: [
        {
          value: 'waiting',
          label: '待验收'
        },
        {
          value: 'waiting_error',
          label: '验收异常'
        },
        {
          value: 'received',
          label: '已收到'
        }
      ],
      orderNo: '',
      phone: '',
      orderStatus: 'checking_error',
      dialogFormVisible: false,
      form: {
        orderNo: '',
        processPipeList: [],
        options: [
          {
            value: 'pass',
            label: '通过'
          },
          {
            value: 'brand_error',
            label: '品牌不达标'
          },
          {
            value: 'length_error',
            label: '长度不达标'
          },
          {
            value: 'outward_error',
            label: '外观不达标'
          },
          {
            value: 'wall_thickness_error',
            label: '壁厚不达标'
          },
          {
            value: 'wall_thickness_degrade',
            label: '壁厚降级'
          }
        ],
        wallThicknessOptions: [],
        tempIndex: null,
        checkingResult: []
      },
      formLabelWidth: '120px',
      dialogTitle: '验收详情'
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
        pageSize: this.pageSize,
        orderStatus: this.orderStatus
      }
      api.queryOrderList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    resetData() {
      this.orderNo = ''
      this.phone = ''
      this.orderStatus = ''
    },
    searchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderStatus: this.orderStatus
      }
      params['orderNo'] = this.orderNo
      params['phone'] = this.phone

      api.queryOrderList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.currentPage = response.data.pageNum
        this.listLoading = false
      })
    },
    formatter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    openDialog(orderNo) {
      const params = {
        orderNo: orderNo
      }
      api.queryOrderInfo(params).then(response => {
        this.form.checkingResult = []
        this.form.orderNo = response.data.orderBasicInfo.orderNo
        const processPipeList = response.data.processPipeList
        this.form.processPipeList = processPipeList.filter(
          e => e.status !== 'received'
        )
        this.form.processPipeList.forEach(e => {
          const a = { id: e.id, res: '' }
          this.form.checkingResult.push(a)
        })
      })
      this.dialogFormVisible = true
    },
    closeDialog() {
      this.form.wallThicknessOptions = []
      this.dialogFormVisible = false
    },
    checkingConfirm() {
      const result = this.form.checkingResult.every(e => {
        return e.res !== ''
      })
      if (!result) {
        this.$message({
          type: 'error',
          message: '还有镀锌管未验收!'
        })
      }
      const params = {
        checkingResultList: this.form.checkingResult,
        orderNo: this.form.orderNo
      }
      api.checkingOrder(params).then(response => {
        this.$message('操作成功')
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
    getOrderStatusDes(orderStatus) {
      let orderStatusDes = ''
      this.orderStatusOptions.forEach(item => {
        if (item.value === orderStatus) {
          orderStatusDes = item.label
        }
      })
      return orderStatusDes
    },
    getProcessPipeStatusDes(status) {
      let processPipeStatusDes = ''
      this.processPipeStatusOptions.forEach(item => {
        if (item.value === status) {
          processPipeStatusDes = item.label
        }
      })
      return processPipeStatusDes
    },
    getWallThicknessOptions(i) {
      delete this.form.checkingResult[i].changedBlackPipeId
      delete this.form.checkingResult[i].changedBlackPipeName
      if (this.form.checkingResult[i].res === 'wall_thickness_degrade' && this.form.wallThicknessOptions.length === 0) {
        let caliber = this.form.processPipeList[i].blackPipeName
        caliber = caliber.split('*')[0]
        caliber = caliber.substring(2, caliber.length)
        const blackPipeId = this.form.processPipeList[i].blackPipeId
        const params = {
          pageNum: 1,
          pageSize: 100,
          blackPipeId,
          caliber
        }
        api.queryChangedBlackPipeList(params).then(response => {
          const list = response.data.list
          list.forEach(element => {
            const item = {
              name: 'DN' + caliber + '*' + element.wallThickness,
              value: element.id,
              label: element.wallThickness
            }
            this.form.wallThicknessOptions.push(item)
          })
          this.form.tempIndex = i
          // console.log(this.form.wallThicknessOptions)
        })
      }
    },
    getBlackPipeName(value) {
      let obj = {}
      obj = this.form.wallThicknessOptions.find(item => {
        // 这里的wallThicknessOptions就是上面遍历的数据源
        return item.value === value // 筛选出匹配数据
      })
      this.form.checkingResult[this.form.tempIndex].changedBlackPipeName = obj.name
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
