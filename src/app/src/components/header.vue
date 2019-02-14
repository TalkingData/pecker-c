<style>
 .header .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown {
   max-height: 400px;
 }
</style>

<template>
  <div>
    <Row type="flex" justify="space-between" class="header">
      <i-col>
        <router-link :to="{path:'/home'}">
          <span style="display:inline-block;vertical-align: top;">
            <img style="width: 118px;height: 32px;" src="../assets/logo.png" alt="">
          </span>
        </router-link>
        <div style="display: inline-flex;" v-if="$route.name !== 'home' && $route.name !== 'help'">
          <!-- <Divider style="height: 30px;width: 2px;margin: 20px 20px 0;" type="vertical"/> -->

          <Menu
          @on-select="changeMenu($event)"
          mode="horizontal"
          theme="light"
          :active-name="activeName"
          :transfer= "true"
          style="margin-top: 1px;">
            <Submenu name="projectName">
              <template slot="title">
                {{projectName}}
              </template>
                  <MenuItem
                  v-for="(item, index) in projectList"
                  :key="index"
                  :to="{path:`/erroroverview/${item._id}`}"
                  :name="item._id">{{item.name}}
                  </MenuItem>
              </Submenu>
            <MenuItem
            :to="{path:`/erroroverview/${$route.params.id}`}"
            name="control">
              控制台
            </MenuItem>
            <MenuItem
            :to="{path:`/projectinfo/projectcontent/${$route.params.id}`}"
            name="manage">
              设置
            </MenuItem>
          </Menu>
        </div>
      </i-col>
      <i-col>
        <router-link :to="{path:'/help'}">
          <span
          style="padding-right: 10px;">帮助</span>
        </router-link>
        <User></User>
      </i-col>
    </Row>
  </div>
</template>

<script>
import User from '@/components/user/index';
import { wsGettProject } from '@/models/project';
import {
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      projectName: '项目选择',
      projectList: [],
      activeName: 'projectName',
    };
  },
  components: {
    User,
  },
  computed: {
    ...mapGetters([
      'appkey',
      'projectId',
      'chartObj',
      'overErrorList',
      'errorListLoading',
    ]),
  },
  methods: {
    ...mapActions([
      'updateAppKey',
      'updateErrorOvierChartList',
      'updateErrorOvierDataList',
    ]),
    /**
     * 获取项目概览
     */
    getProjectOview() {
      wsGettProject({}).then((data) => {
        if (data.status === 200) {
          this.projectList = data.result;
          data.result.forEach((item) => {
            // eslint-disable-next-line
            if (item._id === this.$route.params.id) {
              this.$store.state.role = item.role;
              this.projectName = item.name;
              // eslint-disable-next-line
              return;
            }
          });
        }
      });
    },
    changeMenu(projectId) {
      if (projectId === 'control' || projectId === 'manage') return false;
      this.updateAppKey(projectId).then(() => {
        this.$bus.emit('initMent', '');
        // this.updateErrorOvierDataList({ // 获取错误列表
        //   id: this.$route.params.id,
        //   appkey: this.appkey,
        //   type: this.errorSelected,
        //   pageSize: 20,
        //   pageNumber: 0,
        //   start: new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(),
        //   end: new Date().getTime(),
        // });
        // this.updateErrorOvierChartList({
        //   // groupby: 'day',
        //   appkey: this.appkey,
        //   start: new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(),
        //   end: new Date().getTime(),
        // }); // 获取图表数据
      }); // 获取项目appkey
    },
  },
  watch: {
    $route(newVal) {
      if (newVal.name !== 'login' && newVal.name !== 'home') {
        this.getProjectOview();
      }
      if (newVal.name === 'projectcontent') {
        this.activeName = 'manage';
      }
      if (newVal.name === 'erroroverview') {
        this.activeName = 'control';
      }
    },
  },
  mounted() {},
};
</script>
