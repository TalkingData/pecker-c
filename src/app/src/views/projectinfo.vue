<template>
  <div style="height: 100%">
    <Layout style="height: 100%">
      <Sider
      hide-trigger
      :style="{background: '#fff', borderRight: '1px solid #dcdee2', zIndex: 890}">
        <Menu :active-name="activeName" theme="light" width="auto">
          <MenuItem
          name="projectcontent"
          :to="{ path: `/projectinfo/projectcontent/${$route.params.id}` }">项目信息</MenuItem>
          <MenuItem
          name="membermanagement"
          :to="{ path: `/projectinfo/membermanagement/${$route.params.id}` }">成员管理</MenuItem>
          <MenuItem
          name="sourcemap"
          :to="{ path: `/projectinfo/sourcemap/${$route.params.id}` }">source map</MenuItem>
          <MenuItem
          name="warnsetting"
          :to="{ path: `/projectinfo/warnsetting/${$route.params.id}` }">预警设置</MenuItem>
        </Menu>
      </Sider>
      <Layout :style="{padding: '0 24px'}">
        <Content :style="{minHeight: '280px', background: '#fff'}">
          <router-view :key="key"></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
// import ProjectContent from '@/components/projectcontent';

export default {
  data() {
    return {
      activeName: 'projectcontent',
    };
  },
  components: {},
  computed: {
    /**
     * 如果不同页面用的是同一个component
     * 默认情况下当这两个页面切换时并不会触发vue的mounted钩子
     * 在 router-view上加上一个唯一的key
     * 来保证路由切换时都会重新渲染触发钩子
     */
    key() {
      // eslint-disable-next-line
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    },
  },
  methods: {},
  mounted() {
    this.activeName = this.$route.name;
  },
};
</script>

<style lang='scss' scoped>
.ivu-menu-vertical,
.ivu-menu-light::after {
  background: none;
}
</style>
