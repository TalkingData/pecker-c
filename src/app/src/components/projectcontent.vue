<template>
  <div class="content">
    <h2 class="projectinfo-title">项目信息</h2>

    <div>
      <Form
      ref="formValidate"
      :model="formValidate"
      label-position="top"
      :rules="ruleValidate">
        <FormItem label="项目名称" prop="name">
          <Input
          :disabled='this.$store.state.role === 2'
          v-model="formValidate.name"
          style="width: 280px"></Input>
        </FormItem>
        <FormItem label="APP Key" prop="appkey">
          <Input :readonly="true" v-model="formValidate.appkey" style="width: 280px"></Input>
          <span
          @click="copyKey"
          class="clip"
          style="margin-left: 20px;color: rgb(22, 155, 213);cursor: pointer"
          :data-clipboard-text="copyinfo">复制</span>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
          >
            <span>保存</span>
          </Button>

          <Button
            style="margin-left: 150px;"
            type="text"
            @click="deleteSubmit"
            :disabled="this.$store.state.role === 2"
          >
            <span>删除项目</span>
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'; // 引入公共方法
import {
  wsPutProjectDetail,
  wsDeleteProject,
} from '@/models/project';
import { wsGetErrorsList } from '@/models/error';

export default {
  data() {
    return {
      formValidate: {
        name: '',
        appkey: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
        ],
      },
      copyinfo: '',
    };
  },
  methods: {
    /**
     * 获取错误列表
     */
    getErrorList() {
      this.loading = true;
      wsGetErrorsList({
        appkey: this.$route.params.id,
      }).then((data) => {
        this.data = data;
      });
    },
    /**
     * 提交保存的项目信息
     */
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          wsPutProjectDetail({
            projectid: this.$route.params.id,
            name: this.formValidate.name,
          }).then((data) => {
            if (data.status === 200) {
              this.$Message.success('修改项目成功!');
            }
          });
        } else {
          this.$Message.error('修改项目失败!');
        }
      });
    },
    /**
     * 删除项目
     */
    deleteProject() {
      wsDeleteProject({
        projectid: this.$route.params.id,
      }).then((data) => {
        if (data.status === 200) {
          this.$router.push('/home');
          this.$Notice.success({
            title: '删除项目成功!',
            desc: '删除项目成功!',
          });
        } else {
          this.$Notice.error({
            title: '删除项目失败!',
            desc: '删除项目失败!',
          });
        }
      });
    },
    /**
     * 删除项目信息
     */
    deleteSubmit() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>您正在删除项目，是否继续？</p>',
        onOk: () => {
          wsGetErrorsList({
            appkey: this.formValidate.appkey,
          }).then((data) => {
            if (data.length > 0) {
              this.$Notice.error({
                title: '删除项目失败!',
                desc: '项目中含有上报的错误，无法删除!',
              });
            } else {
              this.deleteProject();
            }
          });
        },
      });
    },
    /**
     * 复制秘钥
     */
    copyKey() {
      const clip = new Clipboard('.clip');
      clip.on('success', (e) => {
        this.$Message.success('复制成功');
        e.clearSelection();
        clip.destroy(); // 销毁复制板
      });
      clip.on('error', () => {
        this.$Message.error('复制失败');
        clip.destroy(); // 销毁复制板
      });
    },
  },
  mounted() {
    this.$store.dispatch('updateAppKey', this.$route.params.id).then(() => {
      this.formValidate.appkey = this.$store.state.global.appkey;
      this.formValidate.name = this.$store.state.global.projectName;
      this.copyinfo = this.formValidate.appkey;
    }).catch((err) => {
      console.log(err);
    });
  },
};
</script>

<style lang='scss' scoped></style>
