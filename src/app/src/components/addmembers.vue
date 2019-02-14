<template>
  <div class='register'>
       <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate">
          <FormItem prop="name">
            <Input v-model="formValidate.name" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem prop='email'>
           <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem prop='password'>
           <Input v-model="formValidate.password" type="password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem prop='rePassword'>
           <Input v-model="formValidate.rePassword" type="password" placeholder="确认密码"></Input>
          </FormItem>
          <FormItem>
            <div class='error'>
                <span v-show='errorNews'>{{errorNews}}</span>
                <p>已经有账户?<a @click='switchType("signIn")'>登录</a></p>
            </div>
            <Button @click="handleSubmit('formValidate')" type="primary" long class="land">注册</Button>
           </FormItem>
        </Form>
  </div>
</template>

<script>
import { wsPostUser } from '@/models/user';

export default {
  data() {
    // 校验密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!'));
      } else {
        if (this.formValidate.rePassword !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('rePassword');
        }
        callback();
      }
    };
    // 校验两个密码是否一致
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请重新输入密码!'));
      } else if (value !== this.formValidate.password) {
        callback(new Error('两个密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        name: '',
        email: '',
        password: '',
        rePassword: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        rePassword: [
          { required: true, validator: validatePassCheck, trigger: 'blur' },
        ],
      },
      errorNews: '',
    };
  },
  props: {
    isAddUserModalShow: {
      default: false,
      type: Boolean,
    },
  },
  watch: {},
  mounted() {},
  methods: {
    /**
     * 提交
     */
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          wsPostUser({
            name: this.formValidate.name,
            email: this.formValidate.email,
            password: this.formValidate.password,
            rePassword: this.formValidate.rePassword,
          }).then((data) => {
            if (data.status === 200) {
              this.$Message.success('注册成功!');
              this.$bus.emit('on-userName', this.formValidate.name);
              this.switchType();
            } else {
              this.errorNews = data.errorMessage;
            }
          }).catch(() => {
            this.$Message.error('注册失败!');
          });
        }
      });
    },
    switchType() {
      this.$emit('switch-type', 'signIn');
    },
  },
};
</script>

<style lang='scss'>
  .land {
    background: #2486ff;
    box-shadow: 0 1px 2px 0 rgba(23, 35, 61, 0.35);
    border-radius: 22px;
    width: 100%;
    height: 40px;
    font-size: 16px;
  }

  .register {
    padding-top: 24px;
  }

  .error {
    height: 30px;
    line-height: 12px;

    span {
      height: 30px;
      color: #ed4014;
      float: right;
    }

    p {
      float: left;
      font-size: 12px;

      a {
        color: #2d8cf0;
        text-decoration: none;
        padding-left: 2px;
      }
    }
  }
</style>
