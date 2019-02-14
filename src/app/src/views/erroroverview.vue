<template>
  <div class="content clearfix">
    <div>
      <Row type="flex" justify="space-between" class="content-title">
        <i-col>聚合分析</i-col>
        <i-col class='content-title-right'>
          <!-- <span class='select-date' @click="getChartData('day')">天</span>
          <span class='select-date' @click="getChartData('week')">周</span>
          <span class='select-date' @click="getChartData('month')">月</span> -->
          <DatePicker
          :value="dateRange"
          :options="options"
          @on-change="dateChange"
          @on-clear="clearDate"
          format="yyyy-MM-dd HH:mm"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          style="width:300px"></DatePicker>
        </i-col>
      </Row>
    </div>

    <VeLine
    id='erroroview-chart'
    :data="chartObj"
    :settings="chartSettings"></VeLine>

    <div>
      <Row type="flex" :gutter="16" style="margin-bottom: 20px;">
        <i-col>
          <Select
          @on-change='updateErrorOvierDataList(
            {
              appkey: appkey,
              type: errorSelected,
              pageSize,
              pageNumber,
              start,
              end
              })'
          v-model="errorSelected"
          style="width:160px"
          placeholder="错误类型筛选">
            <Option
            v-for="item in errorList"
            :value="item.value"
            :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
      <Table
      :columns="columns"
      :data="overErrorList.data"
      tooltip="true"
      :loading="errorListLoading"></Table>

      <div class="page">
        <Page
        :page-size="pageSize"
        :total="overErrorList.metadata.total"
        :current="overErrorList.metadata.pageNumber + 1"
        @on-change="changePage"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex';
import VeLine from 't-charts/lib/line';
import Utils from '@/lib/utils';
import io from 'socket.io-client';

export default {
  data() {
    return {
      timeStamp: Utils.timeStamp,
      // groupby: 'day',
      start: new Date().getTime() - 604800000,
      end: new Date().getTime(),
      dateRange: [
        `${new Date(new Date().getTime() - 604800000).getFullYear()}
        -
        ${new Date(new Date().getTime() - 604800000).getMonth() + 1}
        -
        ${new Date(new Date().getTime() - 604800000).getDate()}
        ${new Date(new Date().getTime() - 604800000).getHours()}
        :
        ${new Date(new Date().getTime() - 604800000).getMinutes()}`,
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}
        -
        ${new Date().getDate()}
        ${new Date().getHours()}
        :
        ${new Date().getMinutes()}`],
      options: {
        shortcuts: [
          {
            text: '1 天',
            value() {
              const end = new Date();
              const start = new Date();
              // eslint-disable-next-line
              start.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime()));
              return [start, end];
            },
          },
          {
            text: '1 week',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 604800000);
              return [start, end];
            },
          },
          {
            text: '1 month',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2592000000);
              return [start, end];
            },
          },
        ],
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000;
        },
      },
      errorSelected: '',
      stateSelected: '',
      errorList: [
        {
          value: 'httpError',
          label: 'httpError',
        },
        {
          value: 'caughtError',
          label: 'caughtError',
        },
        {
          value: 'resourceError',
          label: 'resourceError',
        },
      ],
      columns: [
        {
          title: '错误信息',
          key: 'name',
          // eslint-disable-next-line
          render: (h, params) => {
            return h('a', {
              attrs: {
                // eslint-disable-next-line
                href: `#/errordetail/${this.$route.params.id}?errorDetailId=${params.row._id}`,
              },
            }, params.row.name);
          },
        },
        {
          title: '错误类型',
          key: 'type',
        },
        {
          title: '时间',
          key: 'occurTime',
          // eslint-disable-next-line
          render: (h, params) => {
            return h('span', this.timeStamp(params.row.occurTime));
          },
        },
        {
          title: '错误数量',
          key: 'count',
        },
      ],
      echartsInstance: null,
      chartSettings: {
        metrics: ['count'],
        dimension: ['date'],
        labelMap: {
          count: '数量',
        },
        area: true,
        nullAddZero: true,
      },
      pageSize: 20,
      pageNumber: 0,
    };
  },
  methods: {
    ...mapActions([
      'updateAppKey',
      'updateErrorOvierChartList',
      'updateErrorOvierDataList',
    ]),
    /**
     * 获取图表数据
     */
    getChartData() {
      // this.groupby = dateName;
      this.updateErrorOvierChartList({
        // groupby: this.groupby,
        appkey: this.appkey,
        start: this.start,
        end: this.end,
      }); // 获取图表数据
    },
    /**
     * 切换日期
     */
    dateChange(date) {
      this.start = new Date(date[0]).getTime();
      this.end = new Date(date[1]).getTime();
      this.getChartData();
      this.pageNumber = 0;
      this.updateErrorOvierDataList({ // 获取错误列表
        id: this.$route.params.id,
        appkey: this.appkey,
        type: this.errorSelected,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        start: this.start,
        end: this.end,
      });
    },
    /**
     * 清空日期
     */
    clearDate() {
      this.start = new Date().getTime() - 604800000;
      this.end = new Date().getTime();
      this.dateRange = [
        `${new Date(new Date().getTime() - 604800000).getFullYear()}
        -
        ${new Date(new Date().getTime() - 604800000).getMonth() + 1}
        -
        ${new Date(new Date().getTime() - 604800000).getDate()}
        ${new Date(new Date().getTime() - 604800000).getHours()}
        :
        ${new Date(new Date().getTime() - 604800000).getMinutes()}`,
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}
        -
        ${new Date().getDate()}
        ${new Date().getHours()}
        :
        ${new Date().getMinutes()}`];
      this.getChartData();
      this.pageNumber = 0;
      this.updateErrorOvierDataList({ // 获取错误列表
        id: this.$route.params.id,
        appkey: this.appkey,
        type: this.errorSelected,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        start: this.start,
        end: this.end,
      });
    },
    changePage(page) {
      this.pageNumber = page - 1;
      this.updateErrorOvierDataList({
        appkey: this.appkey,
        type: this.errorSelected,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        start: this.start,
        end: this.end,
      });
    },
  },
  components: {
    VeLine,
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
  mounted() {
    this.updateAppKey(this.$route.params.id).then(() => {
      this.updateErrorOvierDataList({ // 获取错误列表
        id: this.$route.params.id,
        appkey: this.appkey,
        type: this.errorSelected,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        start: this.start,
        end: this.end,
      });
      this.updateErrorOvierChartList({
        // groupby: this.groupby,
        appkey: this.appkey,
        start: this.start,
        end: this.end,
      }); // 获取图表数据
    }); // 获取项目appkey
    // this.$store.commit('SET_SOCKET_CONNECTION');
    // this.updateAppKey(this.$route.params.id).then(() => {
    //   this.$store.commit('SET_SOCKET_FILTER', {
    //     appkey: this.appKey,
    //   });
    // });
    // this.$store.commit('SET_SOCKET_ON_CHANGE');
    const socket = io(`${Utils.baseUrl()}/io`);
    // socket.on()用于接收服务端发来的消息
    socket.on('connect', () => {
      console.log('client connect server');
      // socket.emmit()用户客户端向服务端发送消息，服务端与之对应的是socket.on()来接收信息。
      socket.emit('filter', {
        appkey: this.appkey,
      });
    });
    socket.on('change', () => {
      this.clearDate();
    });
    this.$bus.on('initMent', () => {
      this.clearDate();
    });
  },
};
</script>

<style lang='scss' scoped></style>
