<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="onlineSearchForm" v-show="isShowSearch" :model="queryParams" :inline="true" label-width="68px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-model="queryParams.username"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button v-hasPermission="['monitor:online:kickout']" :disabled="multiple" @click="handleDelete" type="danger" icon="el-icon-delete" size="mini" plain>强退
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['monitor:online:export']" @click="handleExport" icon="el-icon-download" type="warning" size="mini" plain>
          导出
        </el-button>
      </el-col>
      <el-col :span="5" :offset="10">
        <el-button @click="handleQuery" type="primary" plain icon="el-icon-search" size="mini">搜索</el-button>
        <el-button @click="resetForm" type="info" plain icon="el-icon-refresh" size="mini">重置</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-tooltip class="item" effect="dark" :content="isShowSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="refresh"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-table
        :data="onlineList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="在线用户编号"
          :show-overflow-tooltip="true"
          width="160">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          width="110">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="登录地址"
          width="140">
        </el-table-column>
        <el-table-column
          prop="browser"
          label="浏览器"
          width="120">
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="登陆时间"
          width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              v-hasPermission="['monitor:online:kickout']"
              @click.native.prevent="handleDelete(scope.row)"
              type="text"
              style="color: red;" icon="el-icon-delete"
              size="small">
              强退
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
          :page-size="queryParams.pageSize"
          :current-page="queryParams.pageNumber"
          :total="totalElements">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { onlineList, deleteOnline, exportOnline } from '@/api/monitor/online'
  import { downloadFile } from '@/utils/file'

  export default {
    name: 'Online',
    data() {
      return {
        onlineList: [],
        ids: [],
        isShowSearch: true,
        multiple: true,
        totalElements: 0,
        queryParams: {
          pageNumber: 1,
          pageSize: 5,
          username: '',
          ip: '',
          address: ''
        }
      }
    },
    created() {
      this.getOnlineList()
    },
    methods: {
      getOnlineList() {
        onlineList(this.queryParams).then(response => {
          this.onlineList = response.data.content
          this.totalElements = response.data.totalElements
        })
      },
      handleCurrentChange(pageNumber) {
        this.queryParams.pageNumber = pageNumber
        this.getOnlineList()
      },
      handleSizeChange(pageSize) {
        this.queryParams.pageSize = pageSize
        this.getOnlineList()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      handleQuery() {
        this.queryParams.pageNumber = 1
        this.getOnlineList()
      },
      resetForm() {
        this.$refs['onlineSearchForm'].resetFields()
        this.getOnlineList()
      },
      toggleSearch() {
        this.isShowSearch = !this.isShowSearch
        this.resetForm()
      },
      refresh() {
        this.getOnlineList()
      },
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('此操作将强退用户编号为: ' + ids + ' 的用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOnline(ids).then(response => {
            this.getOnlineList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      handleExport() {
        exportOnline().then(response => {
          downloadFile(response, '在线用户列表', 'xls')
        })
      }
    }
  }
</script>

<style>

</style>
