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
          <el-input v-model="listQuery.title" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @clear="test" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
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
            <el-form-item label="负责协会">
              <span>{{ row.club_name }}</span>
            </el-form-item>
            <el-form-item label="进度">
              <span>{{ row.now | developFilter }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ row.number }}</span>
            </el-form-item>
            <el-form-item label="发布人">
              <span>{{ row.poster }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span>{{ row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" sortable="true" type="index" width="80" />
      <el-table-column label="竞赛名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛项目" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.project }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.url">{{ row.url }}</span>
          <span v-else>www.baidu.com</span>
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
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="80px" style="width: 85%; margin-left:50px;">
        <el-form-item label="竞赛名称" prop="name" style="width: 70%;">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="竞赛项目" prop="project" style="width: 70%;">
          <el-input v-model="temp.project" />
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择类别">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker v-model="temp.start_date" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="结束日期" prop="end_date">
          <el-date-picker v-model="temp.end_date" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="进度" prop="now">
          <el-select v-model="temp.now" class="filter-item" placeholder="请选择进度">
            <el-option v-for="item in developOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责协会" prop="" style="width: 50%;">
          <el-input v-model="temp.club_name" />
        </el-form-item>
        <el-form-item label="联系方式" prop="" style="width: 50%;">
          <el-input v-model="temp.number" />
        </el-form-item>
        <el-form-item label="发布人" prop="" style="width: 50%;">
          <el-input v-model="temp.poster" />
        </el-form-item>
        <el-form-item label="链接" prop="" style="width: 70%;">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="内容" prop="content" style="width: 100%;">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
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
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
}

const developOptions = [
  { key: '0', display_name: '报名' },
  { key: '1', display_name: '初赛' },
  { key: '2', display_name: '电子' },
  { key: '3', display_name: '复赛' }
]

const developTypeKeyValue = developOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Event',
  components: { Pagination, Tinymce },
  directives: { waves },
  filters: {
    developFilter(type) {
      return developTypeKeyValue[type]
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
      typeOptions: ['数媒', '软件', '计科', '电子'],
      developOptions,
      postForm: Object.assign({}, defaultForm),
      temp: {
        project: '',
        name: '',
        type: '',
        start_date: '',
        end_date: '',
        club_name: '',
        number: '',
        poster: '',
        content: '',
        url: '',
        mid: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        name: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        project: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        type: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        start_date: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        end_date: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        now: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      // 下载excel
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMatchtableList(this.listQuery).then(response => {
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
        project: '',
        name: '',
        type: '',
        start_date: '',
        end_date: '',
        club_name: '',
        number: '',
        poster: '',
        content: '',
        url: '',
        mid: undefined
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
      // 表单预校验
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.mid = this.total
          this.temp.start_date = parseTime(this.temp.start_date, '{y}-{m}-{d} {h}:{i}')
          this.temp.end_date = parseTime(this.temp.end_date, '{y}-{m}-{d} {h}:{i}')
          this.temp.content = this.temp.content.replace(/<p>/g, '')
          this.temp.content = this.temp.content.replace(/<\/p>/g, '')
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
      this.temp = Object.assign({}, row)
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
        const tHeader = ['id', '项目名称', '竞赛项目', '类型', '开始时间', '结束时间', '进度', '负责协会', '联系方式', '发布人', '链接']
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
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
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

  /deep/ .el-dialog {
    width: 60%;
  }
</style>
