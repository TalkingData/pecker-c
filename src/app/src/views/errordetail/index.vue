<template>
  <div class="error-detail-box">
    <div class="error-detail-header">
      <a href="javascript:;" @click="goBack">返回</a>
      <span class="error-type">{{headerData.type}}</span>
      <span>{{headerData.count}}错误数</span>
    </div>

    <Row style="padding: 0 5px; height:100%;">
      <Col span="7" style="height:100%;overflow:scroll;">
        <ul>
          <li
            @click="getErrorData(item._id,index)"
            class="error-item clearfix"
            :class="{'active':index == errorListIndex}"
            v-for="(item, index) in errorList"
            :key="index"
          >
            <div class="fl">
              <h3>{{item.type}}</h3>
              <p class="error-name" :title="item.name" style="padding: 8px 0;">{{item.name}}</p>
              <p>{{item.osName}}</p>
            </div>
            <div class="fr">
              <p>{{formatDateTime(item.occurTime)}}</p>
              <p style="margin-top: 28px;"></p>
            </div>
          </li>
        </ul>
      </Col>
      <Col class="message-box" span="10" style="position: relative;">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div>
          <h3>概要信息</h3>
          <ul class="basic-msg">
            <li class="clearfix">
              <span class="fl">时间</span>
              <span class="fr">{{formatDateTime(errorRecordDetail.occurTime)}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">类型</span>
              <span class="fr">{{errorRecordDetail.type}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">Title</span>
              <span class="fr">{{errorRecordDetail.title}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">URL</span>
              <span :title="errorRecordDetail.url" class="fr" style="width: calc(100% - 50px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{errorRecordDetail.url}}</span>
            </li>
            <li class="clearfix" v-if="errorRecordDetail.type === 'httpError'">
              <span class="fl">请求方式</span>
              <span class="fr">{{errorRecordDetail.method}}</span>
            </li>
            <li class="clearfix" v-if="errorRecordDetail.type === 'httpError'">
              <span class="fl">状态码</span>
              <span class="fr">{{errorRecordDetail.status}}</span>
            </li>
            <li class="clearfix" v-if="errorRecordDetail.type === 'httpError'">
              <span class="fl">状态信息</span>
              <span class="fr">{{errorRecordDetail.statusText}}</span>
            </li>
            <li class="clearfix" v-if="errorRecordDetail.type === 'httpError'">
              <span class="fl">返回结果</span>
              <span class="fr">{{errorRecordDetail.response}}</span>
            </li>
          </ul>
        </div>
        <div style="margin-top: 15px;" v-if="errorRecordDetail.stacktrace">
          <h3>错误信息</h3>
          <ul class="basic-msg">
            <li class="clearfix">
              <span class="fl">名称</span>
              <span class="fr">{{errorRecordDetail.stacktrace.errorType}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">信息</span>
              <span class="fr">{{errorRecordDetail.stacktrace.message}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">行号</span>
              <span class="fr">{{errorRecordDetail.stacktraceWithSourceMap.line}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">列号</span>
              <span class="fr">{{errorRecordDetail.stacktraceWithSourceMap.column}}</span>
            </li>
          </ul>
        </div>
        <div style="margin-top: 15px;" v-if="errorRecordDetail.stacktraceWithSourceMap">
          <h3>堆栈信息</h3>
          <ul class="basic-msg">
            <li>
              <h3>{{errorRecordDetail.stacktraceWithSourceMap.message}}</h3>
            </li>
            <li
            class="clearfix"
            v-for="(item, index) in errorRecordDetail.stacktraceWithSourceMap.stack"
            :key="index">
              <span class="fl">{{item.fileName}}:{{item.line}}:{{item.column}}</span>
            </li>
          </ul>
        </div>
      </Col>
      <Col class="message-box" span="7" style="padding: 20px;">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div>
          <h3>设备信息</h3>
          <ul class="basic-msg">
            <li class="clearfix">
              <span class="fl">浏览器</span>
              <span class="fr">{{errorRecordDetail.browserName}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">浏览器版本</span>
              <span class="fr">{{errorRecordDetail.browserVersion}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">设备名称</span>
              <span class="fr">{{errorRecordDetail.osName}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">设备版本</span>
              <span class="fr">{{errorRecordDetail.osVersion}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">JS引擎</span>
              <span class="fr">{{errorRecordDetail.engineName}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">引擎版本</span>
              <span class="fr">{{errorRecordDetail.engineVersion}}</span>
            </li>
          </ul>
        </div>
        <div style="margin-top: 15px;" v-if="errorRecordDetail.location">
          <h3>位置信息</h3>
          <ul class="basic-msg" v-if="!errorRecordDetail.location.fail">
            <li class="clearfix">
              <span class="fl">IP</span>
              <span class="fr">{{errorRecordDetail.location.ip}}</span>
            </li>
            <li class="clearfix">
              <span class="fl">地点</span>
              <span class="fr">
                <span>{{errorRecordDetail.location.country}}</span>
                <span>{{errorRecordDetail.location.regionName}}</span>
                <span>{{errorRecordDetail.location.city}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="fl">运营商</span>
              <span class="fr">{{errorRecordDetail.location.org}}</span>
            </li>
          </ul>
          <ul class="basic-msg" v-if="errorRecordDetail.location.fail">
            <li class="clearfix">
              <span class="fl">错误</span>
              <span class="fr">{{errorRecordDetail.location.fail}}</span>
            </li>
          </ul>
        </div>
        <div style="margin-top: 15px;">
          <h3>其他信息</h3>
          <ul class="basic-msg">
            <li class="clearfix">
              <span class="fl">插件版本</span>
              <span class="fr">0.0.1</span>
            </li>
            <li class="clearfix">
              <span class="fl">事件ID</span>
              <span class="fr">{{errorRecordDetail._id}}</span>
            </li>

            <li class="clearfix">
              <span class="fl">userAgent</span>
              <span class="fr">{{errorRecordDetail.userAgent}}</span>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  wsGetErrorRecordsList,
  wsGetErrorRecordsDetail,
  wsGetErrorsDetail,
} from '@/models/error';
import Utils from '@/lib/utils';

export default {
  data() {
    return {
      headerData: {},
      errorList: [],
      errorRecordDetail: {},
      errorListIndex: 0,
      errorid: this.$route.query.errorDetailId,
      spinShow: false,
    };
  },
  mounted() {
    this.getErrorDetail();
    this.getErrorList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取header信息
    getErrorDetail() {
      wsGetErrorsDetail({
        errorid: this.errorid,
      }).then((data) => {
        this.headerData = data;
      });
    },
    // 获取左侧列表
    getErrorList() {
      wsGetErrorRecordsList({
        errorid: this.errorid,
      }).then((data) => {
        this.errorList = data;
        // eslint-disable-next-line
        this.getErrorData(this.errorList[0]._id, 0);
      });
    },
    // 获取列表详细信息
    getErrorData(id, index) {
      this.errorListIndex = index;
      this.spinShow = true;
      wsGetErrorRecordsDetail({
        errorrecordid: id,
      }).then((data) => {
        this.spinShow = false;
        this.errorRecordDetail = data;
      });
    },
    formatDateTime: Utils.timeStamp,
  },
};
</script>

<style lang='scss' scoped>
  @import './index.scss';
</style>
