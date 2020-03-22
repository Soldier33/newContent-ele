<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分handleFilter -->
      <div class="flex-box">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
        <div>
          <el-input v-model="listQuery.title" placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
            搜索
          </el-button>
        </div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>
    </div>
    <!-- tab -->
    <el-tabs v-model="activeName" @tab-click="tabHandleClick">
      <el-tab-pane label="待审核作品" name="first" />
      <el-tab-pane label="已通过作品" name="second" />
      <el-tab-pane label="已退回作品" name="third" />
    </el-tabs>
    <!-- 表格内容 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @row-click="clickTable"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="分项类别">
              <span>{{ row.club_name }}</span>
            </el-form-item>
            <el-form-item label="成员详情">
              <span>{{ row.now }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ row.number }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" prop="title" align="center" min-width="150">
        <template slot-scope="{row}">
          <span v-if="row.title" class="link-type">{{ row.title }}</span>
          <span v-else>起个标题</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" width="220" align="center">
        <template slot-scope="{row}">
          <span v-if="row.match_name" class="link-type">{{ row.match_name }}</span>
          <span v-else>竞赛名称</span>
        </template>
      </el-table-column>
      <el-table-column label="团队名称" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人姓名" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="作品名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="竞赛名称" prop="match_name">
          <el-input v-model="temp.match_name" />
        </el-form-item>
        <el-form-item label="分项类别" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="负责人姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="成员详情" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="联系方式" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="指导老师" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDynamicList, addDynamic, deleteDynamic, updateDynamic } from '@/api/Article/trend'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

const calendarTypeOptions = [
  { key: 'CN', display_name: '软件' },
  { key: 'US', display_name: '数媒' },
  { key: 'JP', display_name: '电子' },
  { key: 'EU', display_name: '计科' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Trend',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      // 弹框内容
      temp: {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        title: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        match_name: [{ message: 'reviewer is required', trigger: 'blur' }]
      },
      // 下载excel
      downloadLoading: false,
      activeName: 'first'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      queryDynamicList(this.listQuery).then(response => {
        this.list = response.obj.dynamicList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 排序方法
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    // Id排序
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: ''
      }
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.id = this.total
          addDynamic(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 弹出编辑框
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDynamic(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除操作
    handleDelete(row, index) {
      deleteDynamic(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '标题', '竞赛名称', '日期', '作者', '内容']
        const filterVal = ['id', 'title', 'match_name', 'time', 'name', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 转换时间戳呈现效果
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    tabHandleClick() {
      console.log(3)
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  .demo-table-expand .el-form-item {
    margin-left: 3%;
    margin-bottom: 0;
    width: 50%;
    /deep/ label {
      font-weight: normal;
      width: 90px;
      color: #99a9bf;
    }
  }
</style>
