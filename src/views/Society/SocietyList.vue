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
    <!-- 表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协会名称" prop="title" align="center" width="220">
        <template slot-scope="{row}">
          <span v-if="row.title" class="link-type">{{ row.title }}</span>
          <span v-else>起个标题</span>
        </template>
      </el-table-column>
      <el-table-column label="协会联系人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协会邮箱" width="220" align="center">
        <template slot-scope="{row}">
          <span v-if="row.match_name" class="link-type">{{ row.match_name }}</span>
          <span v-else>竞赛名称</span>
        </template>
      </el-table-column>
      <el-table-column label="协会简介" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.content }}</span>
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
        <el-form-item label="协会名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="协会联系人" prop="match_name">
          <el-input v-model="temp.match_name" />
        </el-form-item>
        <el-form-item label="协会邮箱" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="协会简介">
          <el-input v-model="temp.content" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
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

export default {
  name: 'Trend',
  components: { Pagination },
  directives: { waves },
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
      downloadLoading: false
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
    }
  }
}
</script>
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
</style>
