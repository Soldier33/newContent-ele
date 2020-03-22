<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
        <div>
          <el-input v-model="listQuery.title" placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-tab-pane label="决赛列表" name="first" />
      <el-tab-pane label="鼓励奖列表" name="second" />
      <el-tab-pane label="待发奖金列表" name="third" />
      <el-tab-pane label="已发奖金列表" name="fourth" />
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
            <el-form-item label="负责人姓名">
              <span>{{ row.club_name }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ row.number }}</span>
            </el-form-item>
            <el-form-item label="指导老师">
              <span>{{ row.now }}</span>
            </el-form-item>
            <el-form-item label="年级专业">
              <span>{{ row.now }}</span>
            </el-form-item>
            <el-form-item label="成员">
              <span>{{ row.now }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.mid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" width="250px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.project }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="150px">
        <template slot-scope="{}">
          <span>OJ</span>
        </template>
      </el-table-column>
      <el-table-column label="团队名称" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
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
        <el-form-item label="联系方式" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="指导老师" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="专业年级" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="成员" prop="name">
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
import { getMatchtableList, addMatch, deleteMatch, updateMatch } from '@/api/Article/event'
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
  name: 'Event',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      temp: {
        id: undefined,
        timestart: new Date(),
        timeend: new Date(),
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMatchtableList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.obj.questionList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'name') {
        this.sortByTitle(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestart: new Date(),
        timeend: new Date(),
        name: '',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.qid = this.total
          addMatch(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMatch(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteMatch(row.mid).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '项目名称', '竞赛项目', '类型', '开始时间', '结束时间', '进度', '负责协会', '联系方式', '发布人', 'url']
        const filterVal = ['mid', 'name', 'project', 'type', 'start_date', 'end_date', 'now', 'club_name', 'number', 'poster', 'url']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '竞赛项目'
        })
        this.downloadLoading = false
      })
    },
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
      console.log(1)
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
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
