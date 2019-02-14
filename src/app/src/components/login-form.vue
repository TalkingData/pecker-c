<style lang="scss" scoped>
.land {
  background: #2486ff;
  box-shadow: 0 1px 2px 0 rgba(23, 35, 61, 0.35);
  border-radius: 22px;
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.signIn {
  height: 30px;
  line-height: 12px;

  span {
    float: right;
    color: #ed4014;
  }

  p {
    float: left;

    a {
      color: #2d8cf0;
      text-decoration: none;
    }
  }
}

h2 {
  font-size: 18px;
  color: rgba(23, 35, 61, 0.75);
  text-align: left;
  line-height: 26px;
  padding: 42px 0 20px 0;
  font-weight: 400;
}
</style>

<style>
.ivu-input {
  height: 40px;
}
</style>

<template>
  <div>
    <h2>前端监控系统</h2>

    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="userName">
        <Input v-model="form.userName" placeholder="请输入用户名/邮箱"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem>
       <div class="signIn">
           <span v-if='errorNews'>{{errorNews}}</span>
           <p>
            还没有账户?
            <a @click="switchType()">立即注册</a>
          </p>
       </div>
        <Button @click="handleSubmit" type="primary" long class="land">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { wsPostLogin } from '@/models/user';

export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      // eslint-disable-next-line
      default: () => {
        return [
          {
            required: true,
            message: '用户名/邮箱不能为空',
            trigger: 'blur',
          },
        ];
      },
    },
    passwordRules: {
      type: Array,
      // eslint-disable-next-line
      default: () => {
        return [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
        ];
      },
    },
  },
  data() {
    return {
      form: {
        userName: '',
        password: '',
      },
      errorNews: '',
    };
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
      };
    },
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          wsPostLogin({
            name: this.form.userName,
            password: this.form.password,
          }).then((data) => {
            if (data.status === 200) {
              if (data.result === 'SUCCESS') {
                this.$Message.success('登录成功!');
                this.$router.push('/home');
              } else {
                this.errorNews = data.errorMessage;
              }
            } else {
              this.$Message.error('登录失败，请重新登录!');
            }
          });
        }
      });
    },
    switchType() {
      this.$emit('switch-type', 'register');
    },
  },
};
</script>
