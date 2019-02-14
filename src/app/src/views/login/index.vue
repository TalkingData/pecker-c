<style lang="scss" scoped>
  @import './index.scss';
</style>

<template>
  <div class="login">
    <div class="login-con">
        <div class="login-con-form">
            <img src="../../assets/images/login-logo.png" alt="">
            <login-form
                v-if='loginType==="signIn"'
                @switch-type='switchType($event)'
            ></login-form>
            <addmembers
              v-if='loginType==="register"'
              @switch-type='switchType($event)'
            ></addmembers>
        </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/login-form';
import addmembers from '@/components/addmembers';


export default {
  components: {
    LoginForm,
    addmembers,
  },
  data() {
    return {
      loginType: 'signIn',
    };
  },
  methods: {
    switchType(data) {
      this.loginType = data;
    },
  },
};
</script>
