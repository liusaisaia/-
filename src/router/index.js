import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome';
import Users from '../components/user/Users';
import Rights from '../components/power/Rights';
import Roles from '../components/power/Roles';
import Cate from '../components/goods/Cate';
import Params from '../components/goods/params';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    }
    ]
  }
  ]
});
// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   // 判断有无token没有跳转登录页
//   if (!tokenStr) return next('/login')
// })
export default router;
