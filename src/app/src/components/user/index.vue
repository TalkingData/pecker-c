<style lang="scss" scoped>
  @import './index.scss';
</style>

<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="loginOut">
      <Badge>
        <Avatar style="background-color: #2d8cf0;" icon="ios-person"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { wsGetLogout } from '@/models/user';

export default {
  data() {
    return {};
  },
  methods: {
    /**
     * 退出登录
     */
    loginOut() {
      wsGetLogout({}).then((data) => {
        if (data.status === 200) {
          this.$Message.success('退出成功!');
          this.$router.push('/login');
        } else {
          this.$Message.error('退出失败，请重新退出!');
        }
      });
    },
  },
};
</script>
