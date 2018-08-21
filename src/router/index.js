import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index2'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name:'index',
      path: '/taobao/*',
      component: index
      // component: r => require.ensure([], () => r(require('@/components/index2')))
    },
    {
      path: '/404',
      component: r => require.ensure([], () => r(require('@/components/notcomponent')))
    },
    {
      path:'/',
      redirect:'/catch'
    }
  ]
})
