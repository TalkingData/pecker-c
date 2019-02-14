module.exports = [
  { path: '*', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/login'),
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/home'),
  },
  {
    path: '/help',
    name: 'help',
    meta: {
      title: '帮助文档',
    },
    component: () => import('@/views/help'),
  },
  {
    path: '/errordetail/:id',
    name: 'errordetail',
    meta: {
      title: '错误详情',
    },
    component: () => import('@/views/errordetail/index'),
  },
  {
    path: '/erroroverview/:id',
    name: 'erroroverview',
    meta: {
      title: '错误概览',
    },
    component: () => import('@/views/erroroverview'),
  },
  {
    path: '/projectinfo',
    name: 'projectinfo',
    component: () => import('@/views/projectinfo'),
    redirect: '/projectinfo/projectcontent',
    children: [
      {
        path: 'projectcontent/:id',
        name: 'projectcontent',
        meta: {
          title: '项目信息',
        },
        component: () => import('@/components/projectcontent'),
      },
      {
        path: 'membermanagement/:id',
        name: 'membermanagement',
        meta: {
          title: '成员管理',
        },
        component: () => import('@/components/membermanagement'),
      },
      {
        path: 'sourcemap/:id',
        name: 'sourcemap',
        meta: {
          title: 'sourcemap管理',
        },
        component: () => import('@/components/sourcemap'),
      },
      {
        path: 'warnsetting/:id',
        name: 'warnsetting',
        meta: {
          title: '预警管理',
        },
        component: () => import('@/components/warnsetting'),
      }
    ],
  },
];
