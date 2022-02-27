<template>
  <div class="app-container">
    <el-row>
      <el-col :span="9">
        <el-card>
          <div slot="header">
            <span>winter</span>
          </div>
          <div class="text item">
            <p>
              winter后台管理系统，是一款简单的Web应用脚手架。默认实现了登录注册，权限管理，监控等功能。
              可以扩展所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等。
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7" style="margin-left: 20px">
        <el-card>
          <div slot="header">
            <span>技术选型</span>
          </div>
          <div class="text item">
            <el-row>
              <el-col :span="12">
                <h4>后端</h4>
                <p>Spring Boot</p>
                <p>Spring Data JPA</p>
                <p>Spring Security</p>
                <p>JWT</p>
                <p>MySQL</p>
                <p>Redis</p>
                <p>...</p>
              </el-col>
              <el-col :span="12">
                <h4>前端</h4>
                <p>Vue.js</p>
                <p>Vue Router</p>
                <p>Vuex</p>
                <p>Element UI</p>
                <p>axios</p>
                <p>...</p>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7" style="margin-left: 20px">
        <el-card>
          <div slot="header">
            <span>更新日志</span>
          </div>
          <div class="text item">
            <el-collapse accordion>
              <el-collapse-item title="v1.1.0 2021-03-16">
                <ol>
                  <li>添加Tag-Views缓存功能</li>
                  <li>移除Fastjson依赖,使用Spring Boot默认集成的Jackson</li>
                  <li>移除Druid依赖,使用Spring Boot默认集成的Hikari数据库连接池</li>
                  <li>删除数据监控菜单</li>
                  <li>Vue Router修改为history模式</li>
                  <li>Spring Boot升级到2.3.5.RELEASE</li>
                  <li>Element UI升级到2.15.1</li>
                  <li>vue升级到2.6.12</li>
                  <li>vuex升级到3.6.2</li>
                  <li>vue-template-compiler升级到2.6.12</li>
                  <li>axios升级到0.21.1</li>
                  <li>core-js升级到3.9.1</li>
                  <li>js-cookie升级到2.2.1</li>
                  <li>vue/cli-service升级到4.5.11</li>
                  <li>sass升级到1.32.8</li>
                  <li>sass-loader升级到10.1.1</li>
                </ol>
              </el-collapse-item>
              <el-collapse-item title="v1.0.0 2021-01-19">
                <ol>
                  <li>winter后台管理系统正式发布</li>
                </ol>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Home',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

</style>
