<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="searchForm" v-show="showSearch" :model="searchParams" :inline="true" label-width="75px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作内容" prop="content">
                <el-input
                  v-model="searchParams.content"
                  placeholder="请输入操作内容"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作用户" prop="username">
                <el-input
                  v-model="searchParams.username"
                  placeholder="请输入操作用户"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="请求方式" prop="requestMethod">
                <el-select
                  v-model="searchParams.requestMethod"
                  placeholder="请选择请求方式"
                  clearable
                  size="small"
                  style="width: 240px">
                  <el-option label="GET" value="GET"/>
                  <el-option label="POST" value="POST"/>
                  <el-option label="PUT" value="PUT"/>
                  <el-option label="DELETE" value="DELETE"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="主机" prop="ip">
                <el-input
                  v-model="searchParams.ip"
                  placeholder="请输入操作主机"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="searchParams.status"
                  placeholder="请选择性别"
                  clearable
                  size="small"
                  style="width: 240px">
                  <el-option label="成功" value="true"/>
                  <el-option label="失败" value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="searchParams.createTime"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button v-hasPermission="['monitor:log:delete']" :disabled="multiple" @click="handleDelete" type="danger" icon="el-icon-delete" size="mini" plain>删除
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['monitor:log:export']" @click="handleExport" icon="el-icon-download" type="warning" size="mini" plain>
          导出
        </el-button>
      </el-col>
      <el-col :span="4" :offset="12">
        <el-button @click="handleSearch" type="primary" plain icon="el-icon-search" size="mini">搜索</el-button>
        <el-button @click="resetSearchForm" type="info" plain icon="el-icon-refresh" size="mini">重置</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="getLogList"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-table
        v-hasPermission="['monitor:log:query']"
        v-loading="loading"
        :data="logList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="content"
          label="操作内容"
          width="110">
        </el-table-column>
        <el-table-column
          prop="requestMethod"
          label="请求方式"
          width="110">
        </el-table-column>
        <el-table-column
          prop="username"
          label="操作用户名"
          width="110">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="主机"
          width="130">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===true" type="success">成功</el-tag>
            <el-tag v-if="scope.row.status===false" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          width="170">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-hasPermission="['monitor:log:query']" @click="handleView(scope.row)" icon="el-icon-view" type="text" size="small">详细
            </el-button>
            <el-button v-hasPermission="['monitor:log:delete']" @click="handleDelete(scope.row)" style="color: red;" icon="el-icon-delete" type="text"
                       size="small">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="app-top">
      <el-col :offset="15">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="searchParams.pageSize"
          :current-page="searchParams.pageNumber"
          :total="totalElements">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="操作日志详细"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作内容：">{{ form.content }}</el-form-item>
            <el-form-item label="请求地址：">{{ form.url }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人员：">{{ form.username }}</el-form-item>
            <el-form-item label="主机：">{{ form.ip }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作地址：">{{ form.address }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.result }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === true">成功</div>
              <div v-else-if="form.status === false">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === false">{{ form.exception }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { logList, deleteLog, exportLog } from '@/api/monitor/log'
  import { downloadFile } from '@/utils/file'

  export default {
    name: 'Log',
    data() {
      return {
        ids: [],
        logList: [],
        loading: true,
        multiple: true,
        showSearch: true,
        dialogVisible: false,
        totalElements: 0,
        searchParams: {
          pageNumber: 1,
          pageSize: 5,
          content: '',
          username: '',
          requestMethod: '',
          ip: '',
          status: '',
          createTime: []
        },
        form: {}
      }
    },
    created() {
      this.getLogList()
    },
    methods: {
      getLogList() {
        this.loading = true
        logList(this.searchParams).then(response => {
          this.logList = response.data.content
          this.totalElements = response.data.totalElements
          this.loading = false
        })
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      handleCurrentChange(pageNumber) {
        this.searchParams.pageNumber = pageNumber
        this.getLogList()
      },
      handleSizeChange(pageSize) {
        this.searchParams.pageSize = pageSize
        this.getLogList()
      },
      resetSearchForm() {
        this.$refs['searchForm'].resetFields()
        this.getLogList()
      },
      toggleSearch() {
        this.showSearch = !this.showSearch
        this.resetSearchForm()
      },
      handleSearch() {
        this.searchParams.pageNumber = 1
        this.getLogList()
      },
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('此操作将删除编号为: ' + ids + ' 的日志, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLog(ids).then(response => {
            this.getLogList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      handleView(row) {
        this.form = row
        this.dialogVisible = true
      },
      handleExport() {
        exportLog(this.searchParams).then(response => {
          downloadFile(response, '操作列表', 'xls')
        })
      }
    }
  }
</script>

<style scoped>

</style>
