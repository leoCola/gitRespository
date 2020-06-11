import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home_new'
import login from '@/components/login'
import register from '@/components/register'
import admin from '@/components/admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/showArticle',
      name: 'showArticle',
      component: () => import(/* webpackChunkName: "dashboard" */ '../components/showArticle.vue')
    },
    {
      path: '/showArtcleList',
      name: 'showArtcleList',
      component: () => import(/* webpackChunkName: "dashboard" */ '../components/showArtcleList.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children:[
        {
          path: '/addArticle',
          name: 'addArticle',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/addArticle.vue')
        },
        {
          path: '/updateArticle',
          name: 'updateArticle',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/updateArticle.vue')
        },
        {
          path: '/addModule',
          name: 'addModule',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/addModule.vue')
        },
        {
          path: '/noFound',
          name: 'noFound',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/403.vue')
        },
        {
          path: '/articlelist_admin',
          name: 'articlelist_admin',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/articlelist_admin.vue')
        },
        {
          path: '/userlist_admin',
          name: 'userlist_admin',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/userlist_admin.vue')
        }
      ]
    },
  ]
})
