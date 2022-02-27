<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card>
          <div slot="header">
            <span>个人信息</span>
          </div>
          <div>
            <div class="avatar">
              <Avatar/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <i class="el-icon-user-solid"></i>用户名称
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-custom"></i>用户昵称
                <div class="pull-right">{{ user.nickname }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-phone"></i>手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-message"></i>用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-user"></i>角色权限
                <div class="pull-right">
                  <el-tag style="margin-left: 5px;" size="small" v-for="(role,i) in roles" :key="i">{{role}}
                  </el-tag>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header">
            <span>基本资料</span>
          </div>
          <div>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="profile">
                <el-form ref="form" :model="user" :rules="rules" label-width="80px">
                  <el-form-item label="用户名称" prop="username">
                    <el-input v-model="user.username"/>
                  </el-form-item>
                  <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="user.nickname"/>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="user.phone" maxlength="11"/>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email" maxlength="50"/>
                  </el-form-item>
                  <el-form-item label="性别" prop="sex">
                    <el-radio v-model="user.sex" label="男">男</el-radio>
                    <el-radio v-model="user.sex" label="女">女</el-radio>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="saveUser">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="resetPwd">
                <el-form ref="form" :model="password" :rules="rules" label-width="80px">
                  <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="password.oldPassword" placeholder="请输入旧密码" type="password"/>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="password.newPassword" placeholder="请输入新密码" type="password"/>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="password.confirmPassword" placeholder="请确认密码" type="password"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="resetPassword">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getInfo } from '@/api/login'
  import { updateUser, updatePassword } from '@/api/system/user'
  import { mapGetters } from 'vuex'
  import Avatar from './Avatar'
  import store from '@/store'

  export default {
    name: 'Profile',
    components: { Avatar },
    data() {
      return {
        dialogVisible: false,
        user: {},
        password: {},
        activeTab: 'profile',
        rules: {
          username: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
          nickname: [{ required: true, message: '请输入用户昵称', trigger: 'change' }],
          phone: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
          oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
          newPassword: [{ required: true, message: '请输入新密码', trigger: 'change' }],
          confirmPassword: [{ required: true, message: '请确定密码', trigger: 'change' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    created() {
      this.getUser()
    },
    methods: {
      getUser() {
        getInfo().then(response => {
          this.user = response.data.user
        })
      },
      saveUser() {
        updateUser(this.user).then(() => {})
      },
      resetPassword() {
        if (this.password.newPassword === this.password.confirmPassword) {
          updatePassword(this.password).then(() => {
            store.dispatch('user/Logout').then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          })
        } else {
          this.$message.error('新密码输入不一致')
        }
      }
    }
  }
</script>

<style>
  .list-group-striped > .list-group-item {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .list-group {
    padding-left: 0;
    list-style: none;
  }

  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0;
    font-size: 13px;
  }

  .pull-right {
    float: right !important;
  }

  .avatar {
    display: flex;
    justify-content: center;
  }

</style>
