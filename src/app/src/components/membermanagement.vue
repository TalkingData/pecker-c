<template>
  <div class="content">
    <Row
    type="flex"
    justify="space-between"
    class="content-title"
    style="margin-bottom: 20px;border-bottom: 1px solid #dddee1;">
        <i-col style="font-size: 18px;">成员管理</i-col>
        <i-col>
          <Button
          :disabled="this.$store.state.role === 2"
          type="primary"
          style="margin-bottom: 10px;"
          @click="showAddUserModal">添加</Button>
        </i-col>
    </Row>

    <Table style='margin-bottom:90px;'
    :columns="columns"
    :data="data"
    :loding="loading"></Table>

    <AddUserModal
    :isAddUserModalShow="isAddUserModalShow"
    @hideAddUserModal="hideAddUserModal"
    @updateList="getUser"></AddUserModal>
  </div>
</template>

<script>
import {
  wsGetUser,
  wsDeleteApiRolemap,
} from '@/models/user';
import AddUserModal from './adduserinproject';

export default {
  data() {
    return {
      columns: [
        {
          title: '用户名',
          key: 'name',
        },
        {
          title: '邮箱',
          key: 'email',
        },
        {
          title: '身份',
          key: 'role',
          render: (h, params) => h('div', {
            domProps: {
              innerHTML: params.row.role == 1 ? '管理员' : '成员',
            },
          }),
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
                  this.deleteMember(params.row._id);
                },
              },
            }, '删除');
          },
        },
      ],
      data: [],
      projectId: '',
      isAddUserModalShow: false,
      loading: false,
    };
  },
  components: {
    AddUserModal,
  },
  methods: {
    /**
     * 显示添加用户弹窗
     */
    showAddUserModal() {
      this.isAddUserModalShow = true;
    },
    /**
     * 关闭弹窗
     */
    hideAddUserModal() {
      this.isAddUserModalShow = false;
    },
    /**
     * 获取用户
     */
    getUser() {
      this.loading = true;
      wsGetUser({
        project: this.projectId,
      }).then((data) => {
        this.loading = false;
        if (data.status === 200) {
          this.data = data.result;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    /**
     * 删除用户
     */
    deleteMember(roleMapId) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>您正在删除用户，是否继续？</p>',
        onOk: () => {
          wsDeleteApiRolemap({
            roleMapId,
          }).then((data) => {
            if (data.status === 200) {
              this.getUser();
              this.$Message.success('删除用户成功!');
            } else {
              this.$Message.error('删除用户失败!');
            }
          });
        },
      });
    },
  },
  mounted() {
    this.projectId = this.$route.params.id;
    this.getUser();
  },
};
</script>

<style lang='scss' scoped></style>
