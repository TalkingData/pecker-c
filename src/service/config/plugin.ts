import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  cors : {
      enable: true,
      package: 'egg-cors',
  },

  io : {
    enable: true,
    package: 'egg-socket.io',
  },

  mongoose : {
    enable: true,
    package: 'egg-mongoose',
  },

  validate : {
    enable: true,
    package: 'egg-validate',
  },

  passport: {
    enable: true,
    package: 'egg-passport'
  },

  passportLocal: {
    enable: true,
    package: 'egg-passport-local',
  }
};

export default plugin;
