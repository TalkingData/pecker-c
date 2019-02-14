<template>
  <div class="content">
    <h3 class="title">预警设置</h3>
    <div style="margin-top: 20px;">
      <span>每30分钟最多报警一次</span>
    </div>
    <div style="margin-top: 20px;">
      <span>当错误累计数达到</span>
      <InputNumber :disabled="$store.state.role !== 1" :max="100000000" :min="1" v-model="errorNum"></InputNumber>
      <span>时,向全体项目成员发送预警邮件</span>
    </div>
    <div style="margin-top: 20px;">
      <Button type="primary" :disabled="$store.state.role !== 1"  @click="handleSubmit()">{{buttonInfo}}</Button>
    </div>
  </div>
</template>

<script>
import Utils from '@/lib/utils';
import {
  wsGetProjectWornSetting,
  wsPostProjectWornSetting,
  wsUpdateProjectWornSetting,
} from '@/models/project';
import {
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  data() {
    return {
      errorNum: 2,
      isUpdate: false,
      ruleId: null,
      buttonInfo: '生效',
    };
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
     * 保存设置
     */
    handleSubmit() {
      if (this.isUpdate) {
        wsUpdateProjectWornSetting({
          ruleId: this.ruleId,
          appkey: this.appkey,
          errorsCount: this.errorNum,
        }).then((data) => {
          if (data.status == 200 && data.result && data.result.ok == 1) {
            this.$Message.success('预警设置修改成功!');
          } else {
            this.$Message.error('预警设置修改失败!');
          }
        });
      } else {
        wsPostProjectWornSetting({
          appkey: this.appkey,
          errorsCount: this.errorNum,
        }).then((data) => {
          if (data.status == 200) {
            this.$Message.success('预警设置生效成功!');
            this.isUpdate = true;
            this.buttonInfo = '保存';
            this.ruleId = data.result && data.result._id;
          } else {
            this.$Message.error('预警设置生效失败!');
          }
        });
      }
    },
  },
  mounted() {
    this.updateAppKey(this.$route.params.id).then((res) => {
      wsGetProjectWornSetting({
        appkey: this.appkey,
      }).then((data) => {
        if (data.status == 200) {
          this.isUpdate = Boolean(data.result.length);
          this.buttonInfo = this.isUpdate ? '保存' : '生效';
          this.errorNum = data.result[0] ? data.result[0].errorsCount : 2;
          this.ruleId = data.result[0] ? data.result[0]._id : null;
        }
      });
    });
  },
};
</script>

<style lang='scss' scoped>
  .content {
    .title {
      border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
    }
  }
</style>
