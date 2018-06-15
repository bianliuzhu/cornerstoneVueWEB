import Vue from 'vue'
import Router from 'vue-router'
import DefaultRoute from './DefaultRoute'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DefaultRoute',
      component: DefaultRoute
    }
  ]
})
