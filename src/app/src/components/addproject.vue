<template>
  <div>
    <Modal
      v-model="isAddProjectShow"
      title="创建项目"
      width="450"
      :mask-closable="false"
      @on-cancel="cancelSubmit"
      @on-ok="handleSubmit">
      <div>
        <Form
        ref="formValidate"
        :model="formValidate"
        label-position="top"
        :rules="ruleValidate">
          <FormItem label="项目名称" prop="name">
            <Input v-model="formValidate.name" style="width: 280px"></Input>
          </FormItem>
          <FormItem label="项目语言" prop='language'>
            <Select v-model="formValidate.language" style="width:280px">
              <Option
              v-for="item in languageList"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目类型" prop='framework'>
            <Select v-model="formValidate.framework" style="width:280px">
              <Option
              v-for="item in optionList"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
        <Button
          type="primary"
          :loading="btnLoading"
          @click="handleSubmit('formValidate')"
        >
          <span>保存</span>
        </Button>
        <Button
          type="text"
          @click="cancelSubmit"
        >
          <span>取消</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { wsPostProject } from '@/models/project';

export default {
  data() {
    return {
      isAddProjectShow: false,
      formValidate: {
        name: '',
        language: 'JavaScript',
        framework: 'Vue',
      },
      ruleValidate: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
        ],
        framework: [
          { required: true, message: '项目名称不能为空', trigger: 'change' },
        ],
      },
      btnLoading: false,
      optionList: [
        {
          value: 'Vue',
          label: 'Vue',
        },
        {
          value: 'Angular',
          label: 'Angular',
        },
      ],
      languageList: [
        {
          value: 'JavaScript',
          label: 'JavasScript',
        },
      ],
    };
  },
  props: {
    isAddProjectModalShow: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    /**
     * 提交
     */
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          wsPostProject({
            name: this.formValidate.name,
            language: this.formValidate.language,
            framework: this.formValidate.framework,
          }).then((data) => {
            if (data.status === 200) {
              this.$emit('updateList'); // 触发父组件更新列表接口
              this.cancelSubmit();
              this.$Message.success('创建项目成功!');
            } else {
              this.$Message.error('创建项目失败!');
            }
          }).catch(() => {
            this.$Message.error('创建项目失败!');
          });
        }
      });
    },
    /**
     * 取消提交
     */
    cancelSubmit() {
      this.init();
      this.$emit('hideAddProjectModal');
    },
    /**
     * 初始化表单数据
     */
    init() {
      this.formValidate.name = '';
      this.formValidate.framework = 'Vue';
    },
  },
  watch: {
    isAddProjectModalShow(val) {
      this.isAddProjectShow = val;
    },
  },
  mounted() {},
};
</script>

<style lang='scss'>
  .ivu-modal-footer {
    border-top: none;
    padding: 0 18px 30px 18px;
    text-align: left;
  }
</style>
