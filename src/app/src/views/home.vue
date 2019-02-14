<template>
  <div class="content">
    <Row type="flex" justify="space-between" class="content-title">
        <i-col>项目列表</i-col>
        <i-col>
          <Button type="primary" @click="showAddProjectModal">新建项目</Button>
        </i-col>
    </Row>
    <Table
    :loading="loading"
    :columns="columns"
    :data="data"></Table>


    <AddProject
    :isAddProjectModalShow="isAddProjectModalShow"
    @hideAddProjectModal="hideAddProjectModal"
    @updateList="getProjectOview"></AddProject>
  </div>

</template>

<script>
import AddProject from '@/components/addproject';
import { wsGetProjectOview } from '@/models/project';

export default {
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '项目名称',
          key: 'name',
          // eslint-disable-next-line
          render: (h, params) => {
            return h('a', {
              attrs: {
                // eslint-disable-next-line
                href: `#/erroroverview/${params.row._id}`,
              },
            }, params.row.name);
          },
        },
        {
          title: '错误数',
          key: 'count',
        },
      ],
      data: [],
      isAddProjectModalShow: false,
    };
  },
  components: {
    AddProject,
  },
  methods: {
    /**
     * 显示添加项目弹窗
     */
    showAddProjectModal() {
      this.isAddProjectModalShow = true;
    },
    /**
     * 关闭弹窗
     */
    hideAddProjectModal() {
      this.isAddProjectModalShow = false;
    },
    /**
     * 获取项目概览
     */
    getProjectOview() {
      this.loading = true;
      wsGetProjectOview({}).then((data) => {
        this.loading = false;
        if (data.status === 200) {
          this.data = data.result;
        }
      });
    },
  },
  mounted() {
    this.getProjectOview();
  },
};
</script>

<style lang='scss' scoped></style>
