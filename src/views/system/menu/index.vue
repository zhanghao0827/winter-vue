<template>
  <div class="app-container">
    <el-row>
      <el-col :span="2">
        <el-button v-hasPermission="['system:menu:add']" @click="handleAdd" type="primary" icon="el-icon-plus" size="mini" plain>新增</el-button>
      </el-col>
      <el-col :span="2" :offset="20">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button @click="getMenuList" size="mini" circle icon="el-icon-refresh"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-table
        v-hasPermission="['system:menu:query']"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="title"
          label="标题"
          :show-overflow-tooltip="true"
          width="150">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="图标"
          width="120">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="显示排序"
          width="90">
        </el-table-column>
        <el-table-column
          prop="path"
          label="访问路径"
          width="120">
        </el-table-column>
        <el-table-column
          prop="component"
          label="组件路径"
          width="160">
        </el-table-column>
        <el-table-column
          prop="permission"
          label="权限标识"
          width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          width="170">
          <template slot-scope="scope">
            <el-button v-hasPermission="['system:menu:add']" @click="handleAdd(scope.row)" icon="el-icon-plus" type="text" size="small">新增</el-button>
            <el-button v-hasPermission="['system:menu:edit']" @click="handleEdit(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
            <el-button v-hasPermission="['system:menu:delete']" @click="handleDelete(scope.row)" style="color: red;" icon="el-icon-delete" type="text"
                       size="small">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="M">菜单</el-radio>
                <el-radio label="P">权限</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="上级菜单">
              <treeselect
                placeholder="选择上级菜单"
                style="height: 32px;"
                v-model="form.parentId"
                :options="menuOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==='M'">
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="form.icon" placeholder="请输入菜单图标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入菜单标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==='M'">
          <el-col :span="12">
            <el-form-item label="访问路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入访问路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==='P'">
          <el-col>
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" placeholder="请输入权限标识"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { menuList, addMenu, getMenu, treeselect, updateMenu, deleteMenu } from '@/api/system/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Menu',
    components: { Treeselect },
    data() {
      return {
        menuList: [],
        menuOptions: [],
        loading: true,
        dialogVisible: false,
        dialogTitle: '',
        form: {},
        rules: {
          title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      getMenuList() {
        menuList(this.searchParams).then(response => {
          this.menuList = response.data
          this.loading = false
        })
      },
      resetForm() {
        this.form = {
          id: undefined,
          parentId: undefined,
          sort: 0,
          title: undefined,
          icon: undefined,
          type: 'M',
          path: undefined,
          component: undefined,
          permission: undefined
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      getTreeselect() {
        treeselect().then(response => {
          this.menuOptions = response.data
        })
      },
      handleAdd(row) {
        this.resetForm()
        this.getTreeselect()
        if (row != null && row.id) {
          this.form.parentId = row.id
        }
        this.dialogVisible = true
        this.dialogTitle = '添加菜单'
      },
      handleEdit(row) {
        this.resetForm()
        this.getTreeselect()
        getMenu(row.id).then(response => {
          this.form = response.data
          this.dialogVisible = true
          this.dialogTitle = '编辑菜单'
        })
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id === undefined) {
              //新增操作
              addMenu(this.form).then(response => {
                this.dialogVisible = false
                this.getMenuList()
              })
            } else {
              //编辑操作
              updateMenu(this.form).then(response => {
                this.dialogVisible = false
                this.getMenuList()
              })
            }
          }
        })
      },
      handleDelete(row) {
        const id = row.id
        this.$confirm('此操作将删除编号为:' + id + '的菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(id).then(response => {
            this.getMenuList()
          })
        })
      }
    }
  }
</script>

<style>

</style>
