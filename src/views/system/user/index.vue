<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="searchForm" v-show="showSearch" :model="searchParams" :inline="true" label-width="68px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-model="searchParams.username"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户昵称" prop="nickname">
                <el-input
                  v-model="searchParams.nickname"
                  placeholder="请输入用户昵称"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <el-select
                  v-model="searchParams.sex"
                  placeholder="请选择性别"
                  clearable
                  size="small"
                  style="width: 240px">
                  <el-option label="男" value="男"/>
                  <el-option label="女" value="女"/>
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
        <el-button v-hasPermission="['system:user:add']" @click="handleAdd" type="primary" icon="el-icon-plus"
                   size="mini" plain>新增
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['system:user:delete']" :disabled="multiple" @click="handleDelete" type="danger"
                   icon="el-icon-delete" size="mini" plain>删除
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['system:user:import']" @click="handleImport" icon="el-icon-upload2" type="info"
                   size="mini" plain>导入
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['system:user:export']" @click="handleExport" icon="el-icon-download" type="warning"
                   size="mini" plain>导出
        </el-button>
      </el-col>
      <el-col :span="5" :offset="6">
        <el-button @click="handleSearch" type="primary" plain icon="el-icon-search" size="mini">搜索</el-button>
        <el-button @click="resetSearchForm" type="info" plain icon="el-icon-refresh" size="mini">重置</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="refresh"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-table
        v-hasPermission="['system:user:query']"
        v-loading="loading"
        :data="userList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="用户编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          width="110">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="110">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex==='男'">男</el-tag>
            <el-tag v-if="scope.row.sex==='女'" type="danger">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="enabled"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="handleEnabled(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="170">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-hasPermission="['system:user:edit']" @click="handleEdit(scope.row)" icon="el-icon-edit"
                       type="text" size="small">编辑
            </el-button>
            <el-button v-hasPermission="['system:user:delete']" @click="handleDelete(scope.row)" style="color: red;"
                       icon="el-icon-delete" type="text" size="small">删除
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      label-width="80px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="enabled">
              <el-radio v-model="form.enabled" :label="true">可用</el-radio>
              <el-radio v-model="form.enabled" :label="false">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="密码" prop="password">
              <el-input v-model="form.password" size="small" type="password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roles" placeholder="请选择角色" size="small" multiple value-key="id">
                <!--
                  option label为角色name, value为每一个角色对象（select要设置value-key）
                  value绑定角色对象而不是角色id的优点：
                    新增用户选择角色：直接把角色对象绑定到form中传到后端
                    编辑角色时:  1.后端根据id查询到的用户对应的角色集合直接与option比较，对象相同就会自动选中
                                2.option的value对象与对应的用户角色集合格式相同，ElementUI组件会自动比较对象
                                3.编辑提交时，选中的角色对象集合直接绑定到form传到后端
                    无需把角色id集合，渲染到form表单中
                -->
                <el-option
                  v-for="(item,i) in roleOptions"
                  :key="i"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button @click="submitForm" type="primary" size="small">确 定</el-button>
    </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="upload.dialogVisible"
      width="400px" append-to-body>
      <el-upload
        ref="upload"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.uploading"
        :on-progress="handleUploadProgress"
        :on-success="handleUploadSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip"><b>提示：只能上传xls/xlsx文件</b></div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="primary" @click="handleTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upload.dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitUpload" size="small">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    userList,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    updateUserEnabled,
    exportUser,
    downLoadTemplate
  } from '@/api/system/user'
  import { downloadFile } from '@/utils/file'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'User',
    data() {
      return {
        loading: true,
        userList: [],
        ids: [],
        roleOptions: [],
        rules: {
          username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
          nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
        },
        totalElements: 0,
        showSearch: true,
        searchParams: {
          username: '',
          nickname: '',
          sex: '',
          pageNumber: 1,
          pageSize: 5,
          createTime: []
        },
        dialogTitle: '',
        dialogVisible: false,
        multiple: true,
        form: {},
        upload: {
          title: '用户导入',
          dialogVisible: false,
          // 是否禁用上传
          uploading: false,
          headers: { Authorization: 'Bearer ' + getToken() },
          url: process.env.VUE_APP_BASE_API + '/system/user/import'
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.loading = true
        userList(this.searchParams).then(res => {
          this.userList = res.data.content
          this.totalElements = res.data.totalElements
          this.loading = false
        })
      },
      handleCurrentChange(pageNumber) {
        this.searchParams.pageNumber = pageNumber
        this.getUserList()
      },
      handleSizeChange(pageSize) {
        this.searchParams.pageSize = pageSize
        this.getUserList()
      },
      toggleSearch() {
        this.showSearch = !this.showSearch
        this.resetSearchForm()
      },
      handleSearch() {
        this.searchParams.pageNumber = 1
        this.getUserList()
      },
      resetSearchForm() {
        this.$refs['searchForm'].resetFields()
        this.getUserList()
      },
      refresh() {
        this.getUserList()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      resetForm() {
        this.form = {
          id: undefined, //根据id为undefined为新增操作，否则为编辑操作
          username: undefined,
          nickname: undefined,
          password: undefined,
          phone: undefined,
          email: undefined,
          sex: undefined,
          enabled: true,
          roles: []
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      handleAdd() {
        this.resetForm()
        getUser().then(response => {
          this.roleOptions = response.data.roleOptions
          this.dialogTitle = '用户新增'
          this.dialogVisible = true
        })
      },
      handleEdit(user) {
        this.resetForm()
        const id = user.id
        getUser(id).then(response => {
          this.form = response.data.user
          this.roleOptions = response.data.roleOptions
          this.dialogTitle = '用户编辑'
          this.dialogVisible = true
        })
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id === undefined) {
              //新增
              addUser(this.form).then(res => {
                if (res) {
                  this.getUserList()
                  this.dialogVisible = false
                }
              })
            } else {
              updateUser(this.form).then(res => {
                if (res) {
                  this.getUserList()
                  this.dialogVisible = false
                }
              })
            }
          } else {
            return false
          }
        })
      },
      handleDelete(user) {
        const ids = user.id || this.ids
        this.$confirm('此操作将删除用户编号为: ' + ids + ' 的用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(ids).then(response => {
            this.getUserList()
          })
        })
      },
      handleEnabled(row) {
        let text = row.enabled === false ? '停用' : '启用'
        this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return updateUserEnabled(row.id, row.enabled)
        }).catch(() => {
          row.enabled = row.enabled === false
        })
      },
      handleExport() {
        exportUser(this.searchParams).then(response => {
          downloadFile(response, '用户列表', 'xls')
        })
      },
      handleImport() {
        this.upload.dialogVisible = true
      },
      handleTemplate() {
        downLoadTemplate().then(response => {
          downloadFile(response, '用户列表模板', 'xls')
        })
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleUploadProgress() {
        this.upload.uploading = true
      },
      handleUploadSuccess(response, file, fileList) {
        this.upload.dialogVisible = false
        this.upload.uploading = false
        this.$refs.upload.clearFiles()
        this.$notify.info({
          title: '导入结果',
          message: response.message
        });
        this.getUserList()
      }
    }
  }
</script>

<style scoped>

</style>
