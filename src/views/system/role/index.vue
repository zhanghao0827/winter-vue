<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="searchForm" v-show="showSearch" :model="searchParams" :inline="true" label-width="68px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="角色名称" prop="name">
                <el-input
                  v-model="searchParams.name"
                  placeholder="请输入角色名称"
                  clearable
                  size="small"
                  style="width: 240px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色权限" prop="scope">
                <el-input
                  v-model="searchParams.scope"
                  placeholder="请输入角色权限"
                  clearable
                  size="small"
                  style="width: 240px"
                />
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
        <el-button v-hasPermission="['system:role:add']" @click="handleAdd" type="primary" icon="el-icon-plus"
                   size="mini" plain>新增
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['system:role:delete']" :disabled="multiple" @click="handleDelete" type="danger"
                   icon="el-icon-delete" size="mini" plain>删除
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-hasPermission="['system:role:export']" @click="handleExport" icon="el-icon-download" type="warning" size="mini" plain>
          导出
        </el-button>
      </el-col>
      <el-col :span="5" :offset="6">
        <el-button @click="handleSearch" type="primary" plain icon="el-icon-search" size="mini">搜索</el-button>
        <el-button @click="resetSearchForm" type="info" plain icon="el-icon-refresh" size="mini">重置</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button @click="toggleSearch" size="mini" circle icon="el-icon-search"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button @click="refresh" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-table
        v-hasPermission="['system:role:query']"
        v-loading="loading"
        :data="roleList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="角色编号"
          width="130">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="130">
        </el-table-column>
        <el-table-column
          prop="scope"
          label="权限字符"
          width="130">
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
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-hasPermission="['system:role:edit']" @click="handleEdit(scope.row)" icon="el-icon-edit"
                       type="text" size="small">编辑
            </el-button>
            <el-button v-hasPermission="['system:role:delete']" @click="handleDelete(scope.row)" style="color: red;"
                       icon="el-icon-delete" type="text"
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限字符" prop="scope">
              <el-input v-model="form.scope" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单权限" prop="menu">
              <el-checkbox v-model="checkStrictly" @change="changeCheckStrictly">父子联动</el-checkbox>
              <el-checkbox v-model="expand" @change="changeExpand">展开/折叠</el-checkbox>
              <el-checkbox v-model="checkAll" @change="changeCheckAll">全选/全不选</el-checkbox>
              <el-tree
                class="tree-border"
                ref="tree"
                :data="menuOptions"
                :props="defaultProps"
                :check-strictly="!checkStrictly"
                show-checkbox
                node-key="id"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="submitForm" type="primary" size="small">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import { roleList, getRole, addRole, updateRole, deleteRole, exportRole } from '@/api/system/role'
  import { downloadFile } from '@/utils/file'

  export default {
    name: 'Role',
    data() {
      return {
        ids: [],
        roleList: [],
        menuOptions: [],
        menuIds: [],
        checkedKeys: [],
        loading: true,
        checkStrictly: false,
        expand: false,
        checkAll: false,
        showSearch: true,
        dialogVisible: false,
        multiple: true,
        dialogTitle: '',
        searchParams: {
          name: '',
          scope: '',
          createTime: [],
          pageNumber: 1,
          pageSize: 5
        },
        totalElements: 0,
        form: {},
        rules: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          scope: [{ required: true, message: '请输入角色权限字符', trigger: 'blur' }]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      getRoleList() {
        roleList(this.searchParams).then(response => {
          this.roleList = response.data.content
          this.totalElements = response.data.totalElements
          this.loading = false
        })
      },
      handleCurrentChange(pageNumber) {
        this.searchParams.pageNumber = pageNumber
        this.getRoleList()
      },
      handleSizeChange(pageSize) {
        this.searchParams.pageSize = pageSize
        this.getRoleList()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      handleSearch() {
        this.searchParams.pageNumber = 1
        this.getRoleList()
      },
      resetSearchForm() {
        this.$refs['searchForm'].resetFields()
        this.getRoleList()
      },
      toggleSearch() {
        this.showSearch = !this.showSearch
        this.resetSearchForm()
      },
      refresh() {
        this.getRoleList()
      },
      /**
       * 表单重置
       * 由于添加和编辑是同一个el-tree
       * 每次打开后，需要先重置表单
       * 1.this.$refs.tree.setCheckedKeys([])  全部不选中，再根据添加/编辑的操作渲染默认选中
       * 2.this.checkStrictly = false          取消父子联动
       * 3.this.expand = false                 折叠
       */
      resetForm() {
        //全部不选中，
        if (this.$refs.tree !== undefined) {
          this.$refs.tree.setCheckedKeys([])
        }
        this.checkStrictly = false
        this.expand = false
        this.checkAll = false
        this.form = {
          id: undefined, //根据id为undefined为新增操作，否则为编辑操作
          name: undefined,
          scope: undefined,
          menus: []
        }
      },
      handleAdd() {
        this.resetForm()
        getRole().then(response => {
          this.menuOptions = response.data.menuOptions
          this.menuIds = response.data.menuIds
          this.dialogTitle = '角色新增'
          this.dialogVisible = true
        })
      },
      handleEdit(row) {
        this.resetForm()
        const id = row.id
        getRole(id).then(response => {
          this.menuOptions = response.data.menuOptions
          this.menuIds = response.data.menuIds
          this.form = response.data.role
          this.dialogTitle = '角色编辑'
          /**
           * 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新
           * 即等待DOM元素加载完毕
           */
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(response.data.checkedKeys)
          })
          this.dialogVisible = true
          console.log(this.form)
        })
      },
      changeCheckStrictly(value) {
        this.checkStrictly = value
      },
      changeExpand(value) {
        let menuIds = this.menuIds
        for (let i = 0; i < menuIds.length; i++) {
          this.$refs.tree.store.nodesMap[menuIds[i]].expanded = value
        }
      },
      changeCheckAll(value) {
        this.$refs.tree.setCheckedNodes(value ? this.menuOptions : [])
      },
      getAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.tree.getCheckedKeys()
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
        return checkedKeys
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let checkedKeys = this.getAllCheckedKeys()
            const _this = this
            // 给form.menus数组赋值前，重新初始化数组，防止push 空指针和选择(id)重复 **
            _this.form.menus = []
            checkedKeys.forEach(function(key, index) {
              const menuId = { id: key }
              _this.form.menus.push(menuId)
            })
            if (this.form.id === undefined) {
              //新增
              addRole(this.form).then(response => {
                this.getRoleList()
                this.dialogVisible = false
              })
            } else {
              //编辑
              updateRole(this.form).then(response => {
                this.getRoleList()
                this.dialogVisible = false
              })
            }
          } else {
            return false
          }
        })
      },
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('此操作将删除角色编号为: ' + ids + ' 的角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(ids).then(response => {
            this.getRoleList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      handleExport() {
        exportRole(this.searchParams).then(response => {
          downloadFile(response, '角色列表', 'xls')
        })
      }

    }
  }
</script>

<style>

  .tree-border {
    margin-top: 5px;
    border: 1px solid #e5e6e7;
    background: #FFFFFF none;
    border-radius: 4px;
  }

</style>
