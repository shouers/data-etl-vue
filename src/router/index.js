import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Menus from '../components/menu/Menus.vue'
import NotPermission from '../components/401.vue'
import Icons from '../components/doc/Icons.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    meta:{title: '首页'},
    children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          iconCls: 'el-icon-share', //图标样式
          component: Users,
          meta:{title: '用户管理'},
        },
        {
          path: '/menus',
          iconCls: 'el-icon-bell',
          component: Menus,
        },
        {
          path: '/icons',
          component: Icons
        },
        {
          path: "/401",
          component: NotPermission
        }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

import store from '../store'//引入store

//路由导航守卫
/*router.beforeEach((to, from, next) => {

  const token = window.localStorage.getItem('JWT_TOKEN');
  console.info("token==="+token);
  if (to.path == '/login') {
    if(!token){
      return next();
    }else{
      return next({path: '/home'})
    }
  }

  if(to.path=='/401'){
    return next();
  }

  if (!token) {
    return next('/login');
  }else {
    //判断是否有访问该路径的权限
    const urls =store.state.userInfo.url;
    //如果是管理员
    if(store.state.userInfo.isAdmin){
      return next();
    }else{
      if(urls.indexOf(to.path) > -1){
        //则包含该元素
        window.sessionStorage.setItem("activePath", to.path);
        return next();
      }else{
        return next("/401");
      }
    }
  }
})*/

export default router
