<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <span style="font-size:16px">订单号:</span>
        <el-input v-model="orderNo" size="small" placeholder="请输入订单号" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :span="8">
        <span style="font-size:16px">下单手机号:</span>
        <el-input v-model="phone" size="small" placeholder="请输入手机号" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :span="8">
        <span style="font-size:16px">订单状态:</span>
        <el-select v-model="orderStatus" size="small" placeholder="请选择">
          <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button type="info" icon="el-icon-refresh" @click="resetData">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
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
          {{ scope.row.hasProcess == 1 ? '有':'无' }}
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
          <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom">
            <a class="el-icon-info" style="margin-right:10px" @click="openDialog(scope.row.orderNo)"/>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" fullscreen @close="closeDialog()">
      <el-row>
        <el-col :span="8">
          <el-row>订单基础信息:</el-row>
          <el-form :model="orderBasicInfo" label-position="right" label-width="150px">
            <el-form-item label="订单号:">
              <div>{{ orderBasicInfo.orderNo }}</div>
            </el-form-item>
            <el-form-item label="订单总价(元):">
              <div>{{ orderBasicInfo.priceTotal }}</div>
            </el-form-item>
            <el-form-item label="运费(元):">
              <div>{{ orderBasicInfo.freight }}</div>
            </el-form-item>
            <el-form-item label="订单状态:">
              <div>{{ getOrderStatusDes(orderBasicInfo.orderStatus) }}</div>
            </el-form-item>
            <el-form-item label="运输方式:">
              <div>{{ getTransportTypeDes(orderBasicInfo.transportType) }}</div>
            </el-form-item>
            <el-form-item label="收货(自提)地址:">
              <div>{{ orderBasicInfo.receiverAddr }}</div>
            </el-form-item>
            <el-form-item label="收货(自提)联系人:">
              <div>{{ orderBasicInfo.receiverName }}</div>
            </el-form-item>
            <el-form-item label="收货(自提)联系电话:">
              <div>{{ orderBasicInfo.receiverPhone }}</div>
            </el-form-item>
            <el-form-item label="是否有加工:">
              <div>{{ orderBasicInfo.hasProcess == 1?'有':'无' }}</div>
            </el-form-item>
            <el-form-item label="订单备注:">
              <div>{{ orderBasicInfo.remark }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-row>订单支付信息:</el-row>
          <el-form :model="orderPayInfo" label-position="right" label-width="150px">
            <el-form-item label="是否支付:">
              <div>{{ orderPayInfo.isPaid === 1?'已支付':'未支付' }}</div>
            </el-form-item>
            <el-form-item label="支付渠道:">
              <div>{{ orderPayInfo.payChannel }}</div>
            </el-form-item>
            <el-form-item label="支付金额(元):">
              <div>{{ orderPayInfo.payPrice }}</div>
            </el-form-item>
            <el-form-item label="是否退款:">
              <div>{{ orderPayInfo.isRefund === 1?'已退款':'未退款' }}</div>
            </el-form-item>
            <el-form-item label="退款金额(元):">
              <div>{{ orderPayInfo.refundPrice }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-row>镀锌管信息:</el-row>
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(result,i) in resultList" :key="i" :name="i">
              <template slot="title">
                {{ getTitle(result) }}
              </template>
              <el-row>
                成交记录:
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span>管子总价:{{ result.productPriceTotal }}</span>
                </el-col>
                <el-col :span="6">
                  <span>加工费:{{ result.processPriceTotal }}</span>
                </el-col>
                <el-col :span="6">
                  <span>管子单价:{{ result.productPrice }}</span>
                </el-col>
                <el-col :span="6">
                  <span>加工比率:{{ result.processRate }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span>回收价格:{{ result.recyclingPrice }}</span>
                </el-col>
                <el-col :span="6">
                  <span>截断价格:{{ result.truncatedPrice }}</span>
                </el-col>
                <el-col :span="6">
                  <span>压槽价格:{{ result.pressurePrice }}</span>
                </el-col>
                <el-col :span="6">
                  <span>车丝价格:{{ result.threadingPrice }}</span>
                </el-col>
              </el-row>
              <el-row>
                规格列表:
              </el-row>
              <el-row v-for="(item,j) in result.blackPipeItem.itemList" :key="j">
                <el-col :span="6">
                  <span>长度:{{ item.length }}</span>
                </el-col>
                <el-col :span="6">
                  <span>数量:{{ item.num }}</span>
                </el-col>
                <el-col :span="6">
                  <span>打标:{{ item.marking }}</span>
                </el-col>
                <el-col :span="6">
                  <span>加工方式:{{ getProcessMethodsDes(item.processMethod) }}</span>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">关闭</el-button>
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
      transportTypeOptions: [
        {
          value: 'distribution',
          label: '配送'
        },
        {
          value: 'self',
          label: '自提'
        }
      ],
      orderNo: '',
      phone: '',
      orderStatus: '',
      dialogFormVisible: false,
      orderBasicInfo: {},
      orderPayInfo: {},
      resultList: [],
      activeNames: [],
      formLabelWidth: '120px',
      dialogTitle: '订单详情'
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
        pageSize: this.pageSize
      }
      params['orderNo'] = this.orderNo
      params['phone'] = this.phone
      params['orderStatus'] = this.orderStatus

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
        this.orderBasicInfo = response.data.orderBasicInfo
        this.orderPayInfo = response.data.orderPayInfo
        this.resultList = JSON.parse(response.data.orderBlackPipeInfo.resultList)
        for (let i = 0; i < this.resultList.length; i++) {
          this.activeNames.push(i)
        }
      })
      this.dialogFormVisible = true
    },
    closeDialog() {
      this.dialogFormVisible = false
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
    getTransportTypeDes(transportType) {
      let transportTypeDes = ''
      this.transportTypeOptions.forEach(item => {
        if (item.value === transportType) {
          transportTypeDes = item.label
        }
      })
      return transportTypeDes
    },
    getTitle(result) {
      let title = ''
      if (result.cartType === 'product') {
        title += '成品管|| '
      } else {
        title += '加工|| '
      }
      title += result.blackPipeItem.brandName + ' , '
      title += result.blackPipeItem.blackPipeName + 'mm , 共'
      title += result.numTotal + ' 根'
      return title
    },
    getProcessMethodsDes(element) {
      let b = ''
      if (element === '0') {
        b += '车丝*2'
      } else if (element === '1') {
        b += '压槽*2'
      } else if (element === '2') {
        b += '车丝*1,压槽*1'
      } else if (element === '3') {
        b += '不加工'
      }
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
    width: 180px;
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
