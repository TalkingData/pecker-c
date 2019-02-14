<template>
  <div class="content">
    <!-- <h2 class="projectinfo-title">source map</h2> -->
    <Row
    type="flex"
    justify="space-between"
    class="content-title"
    style="margin-bottom: 20px;border-bottom: 1px solid #dddee1;">
        <i-col style="font-size: 18px;">source map</i-col>
        <i-col style="display: flex;">
          <Upload
          multiple
          :with-credentials="true"
          :action="uploadUrl"
          :format="['map']"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-format-error="handleFormatError"
          :on-success="handleSuccess"
          :on-error="handleError">
            <Button
            :loading="btnLoading"
            icon="ios-cloud-upload-outline"
            type="primary"
            style="margin-bottom: 10px;">上传文件</Button>
          </Upload>

          <Button
            @click="deleteFile"
            :disabled="$store.state.role !== 1 || selectFile.length === 0"
            type="primary"
            style="margin:0 0 10px 10px;">批量删除文件</Button>
        </i-col>
    </Row>

    <Table
    style='margin-bottom:90px;'
    @on-select="tableSelect"
    @on-select-cancel="tableCancelSelect"
    @on-select-all="tableSelectAll"
    @on-select-all-cancel="tableCancelSelectAll"
    :loading="loading"
    :columns="columns"
    :data="data"></Table>
  </div>
</template>

<script>
import Utils from '@/lib/utils';
import {
  wsDeleteSourceMap,
  wsGetSourcemapList,
} from '@/models/sourcemap';

export default {
  data() {
    return {
      timeStamp: Utils.timeStamp,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '文件名',
          key: 'fileName',
        },
        {
          title: '更新时间',
          key: 'updateAt',
          // eslint-disable-next-line
          render: (h, params) => {
            return h('span', this.timeStamp(params.row.updateAt));
          },
        },
        {
          title: '操作',
          key: 'opertion',
          width: 120,
          // eslint-disable-next-line
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                disabled: this.$store.state.role === 2,
              },
              on: {
                click: () => {
                  // eslint-disable-next-line
                  this.deleteSourceMap(params.row._id);
                },
              },
            }, '删除');
          },
        },
      ],
      data: [],
      loading: false,
      uploadUrl: '', // 上传地址
      appkey: '',
      btnLoading: false,
      selectFile: [],
    };
  },
  methods: {
    /**
     * 获取sourcemap列表
     */
    getSourcemapList() {
      this.loading = true;
      wsGetSourcemapList({
        appkey: this.appkey,
      }).then((data) => {
        this.loading = false;
        if (data.status === 200) {
          this.data = data.result;
        } else {
          this.data = [];
        }
      });
    },
    /**
     * 删除上传的source map文件
     */
    deleteSourceMap(id) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>您正在删除Source Map文件，是否继续？</p>',
        onOk: () => {
          wsDeleteSourceMap({
            id,
          }).then((data) => {
            if (data.status === 200) {
              this.getSourcemapList();
              this.$Notice.success({
                title: '删除source map文件成功!',
                desc: '删除source map文件成功!',
              });
            } else {
              this.$Notice.error({
                title: '删除source map文件失败!',
                desc: '删除source map文件失败!',
              });
            }
          });
        },
      });
    },
    /**
     * 文件上传前
     */
    beforeUpload() {
      this.btnLoading = true;
    },
    /**
     * 上传文件格式错误
     */
    handleFormatError(file) {
      this.$Notice.warning({
        title: '上传文件格式错误',
        desc: `${file.name}文件上传错误，请上传map格式文件！`,
      });
    },
    /**
     * 文件上传成功
     */
    handleSuccess(data, file) {
      this.btnLoading = false;
      if (data.status === 200) {
        this.data = data.result; // 获取列表
        this.$Notice.success({
          title: '上传source map文件成功!',
          desc: `source map文件：${file.name}，上传成功!`,
        });
      } else {
        this.progressStatus = 'wrong';
        this.$Notice.warning({
          title: '上传source map文件失败!',
          desc: `source map文件：${file.name}，上传失败!`,
        });
      }
    },
    /**
     * 文件上传失败
     */
    handleError(data, file) {
      this.btnLoading = false;
      this.$Notice.warning({
        title: '上传source map文件失败!',
        desc: `source map文件：${file.name}，上传失败!`,
      });
    },
    /**
     * 表单选中
     */
    tableSelect(val) {
      this.selectFile = val;
    },
    /**
     * 取消选择
     */
    tableCancelSelect(val) {
      this.selectFile = val;
    },
    /**
     * 全选
     */
    tableSelectAll(val) {
      this.selectFile = val;
    },
    /**
     * 取消全选
     */
    tableCancelSelectAll(val) {
      this.selectFile = val;
    },
    /**
     * 删除文件
     */
    deleteFile() {
      let id = '';
      this.selectFile.forEach((item) => {
        // eslint-disable-next-line
        id += `${item._id},`;
      });
      this.deleteSourceMap(id.substr(0, id.length - 1));
    },
  },
  mounted() {
    this.$store.dispatch('updateAppKey', this.$route.params.id).then(() => {
      this.appkey = this.$store.state.global.appkey;
      this.uploadUrl = `${Utils.baseUrl()}/api/upload/map?appkey=${this.appkey}`;
      this.getSourcemapList();
    });
  },
};
</script>

<style lang='scss' scoped></style>
