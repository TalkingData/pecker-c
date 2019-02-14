<template>
  <div>
    <Modal
      v-model="isAddUserShow"
      title="添加成员"
      width="450"
      :mask-closable="false"
      @on-ok="handleSubmit"
      @on-cancel="cancelSubmit">
      <div>
        <Form
        ref="formValidate"
        :model="formValidate"
        :label-width="80"
        :rules="ruleValidate">
          <FormItem label="成员" prop="userId">
            <Select
              style="width: 240px"
              v-model="formValidate.userId"
              filterable
              remote
              :loading="loading">
              <Option
              v-for="(option, index) in options"
              :value="option._id"
              :label="option.name"
              :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
         <Button
          type="primary"
          :loading="btnLoading"
          @click="handleSubmit('formValidate')">
          <span>保存</span>
        </Button>
        <Button
          type="text"
          @click="cancelSubmit">
          <span>取消</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  wsGetUser,
  wsGetAddUser,
  wsPostApiRolemap,
} from '@/models/user';

export default {
  data() {
    return {
      isAddUserShow: false,
      formValidate: {
        userId: '',
      },
      ruleValidate: {},
      btnLoading: false,
      loading: false,
      options: [],
    };
  },
  props: {
    isAddUserModalShow: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    /**
     * 远程搜索成员
     */
    remoteMethod() {
      this.loading = true;
      wsGetAddUser({
        project: this.$route.params.id,
      }).then((data) => {
        this.loading = false;
        if (data.status === 200) {
          this.options = data.result;
        }
      });
    },
    /**
     * 提交
     */
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          wsPostApiRolemap({
            user: this.formValidate.userId,
            project: this.$route.params.id,
          }).then((data) => {
            if (data.status === 200) {
              this.$emit('updateList'); // 触发父组件更新列表接口
              this.$Message.success('添加成员成功!');
              this.$emit('hideAddUserModal');
            } else {
              this.$Message.error('添加成员失败!');
            }
          }).catch((data) => {
            this.$Message.error(data.errorMessage || '');
          });
        }
      });
    },
    /**
     * 取消提交
     */
    cancelSubmit() {
      this.init();
      this.$emit('hideAddUserModal');
    },
    /**
     * 初始化表单数据
     */
    init() {
      this.formValidate.userId = '';
    },
  },
  watch: {
    isAddUserModalShow(val) {
      this.isAddUserShow = val;
      if (val) {
        this.remoteMethod();
      }
    },
  },
  mounted() {

  },
};
</script>

<style lang='scss'>
  .ivu-modal-footer {
    border-top: none;
    padding: 0 18px 30px 18px;
    text-align: left;
  }
</style>
