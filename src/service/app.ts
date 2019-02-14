// export default app => {

// };

// app.js

const utils = require('utility');
const validator = require('validator');

export default app => {
  // app.projectName = 'eggManual';
  const localHandler = async (ctx, { username, password }) => {
    let existUsers;
    if (validator.isEmail(username)) {
      existUsers = await ctx.service.user.index({ email: username });
    } else {
      existUsers = await ctx.service.user.index({ name: username });
    }
    const existUser = existUsers[0];
    // 用户不存在
    if (!existUser) {
      return null;
    }
    const pwdHash = utils.md5(password + app.config.site_salt);
    // 密码不匹配
    if (existUser.password !== pwdHash) {
      return null;
    }
    return existUser;
  };

  // 处理用户信息
  app.passport.verify(async (ctx, user) => {
    const existUser = await localHandler(ctx, user);
    return existUser;
  });

  // @ts-ignore
  app.passport.serializeUser(async (ctx, user) => {
    return user._id;
  });
  app.passport.deserializeUser(async (ctx, userId) => {
    const user = await ctx.service.user.index({ _id: userId });
    return user[0];
  });
};
