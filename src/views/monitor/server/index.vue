<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>服务器信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table style="width: 100%;">
              <tbody v-if="server.os">
              <tr>
                <td>
                  <div class="cell">服务器名称</div>
                </td>
                <td>
                  <div class="cell">{{server.os.hostName}}</div>
                </td>
                <td>
                  <div class="cell">操作系统</div>
                </td>
                <td>
                  <div class="cell">{{server.os.osName}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell">服务器IP</div>
                </td>
                <td>
                  <div class="cell">{{server.os.ip}}</div>
                </td>
                <td>
                  <div class="cell">系统架构</div>
                </td>
                <td>
                  <div class="cell">{{server.os.arch}}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>Java虚拟机信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table style="width: 100%;">
              <tbody v-if="server.jvm">
              <tr>
                <td>
                  <div class="cell">Java名称</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.name}}</div>
                </td>
                <td>
                  <div class="cell">Java版本</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.version}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell">安装路径</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.home}}</div>
                </td>
                <td>
                  <div class="cell">当前JVM占用的内存总数</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.total}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell">JVM最大可用内存总数</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.max}}</div>
                </td>
                <td>
                  <div class="cell">JVM空闲内存</div>
                </td>
                <td>
                  <div class="cell">{{server.jvm.free}}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="app-top">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>磁盘状态</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table style="width: 100%;">
              <thead>
              <tr>
                <th class="is-leaf">
                  <div class="cell">磁盘名称</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">盘符路径</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">文件系统</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">总大小</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">可用大小</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">已用大小</div>
                </th>
                <th class="is-leaf">
                  <div class="cell">已用百分比</div>
                </th>
              </tr>
              </thead>
              <tbody v-if="server.disks">
              <tr v-for="disk in server.disks">
                <td>
                  <div class="cell">{{ disk.name }}</div>
                </td>
                <td>
                  <div class="cell">{{ disk.dir }}</div>
                </td>
                <td>
                  <div class="cell">{{ disk.type }}</div>
                </td>
                <td>
                  <div class="cell">{{ disk.total }}</div>
                </td>
                <td>
                  <div class="cell">{{ disk.free }}</div>
                </td>
                <td>
                  <div class="cell">{{ disk.used }}</div>
                </td>
                <td>
                  <div class="cell" :class="{'text-danger': disk.usage > 80}">{{ disk.usage }}%</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { server } from '@/api/monitor/server'

  export default {
    name: 'Server',
    data() {
      return {
        server: {},
        loading: []
      }
    },
    created() {
      this.getServer()
      this.openLoading()
    },
    methods: {
      getServer() {
        server().then(response => {
          this.server = response.data
          this.loading.close()
        })
      },
      openLoading() {
        this.loading = this.$loading({
          lock: true,
          text: 'loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
    }
  }
</script>

<style scoped>

</style>
