/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const UserRouter = {
  path: '/User',
  component: Layout,
  redirect: '/User/Judges',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'Administrators',
      component: () => import('@/views/User/Administrators'),
      name: 'Administrators',
      meta: { title: '管理员' }
    },
    {
      path: 'Competitors',
      component: () => import('@/views/User/Competitors'),
      name: 'Competitors',
      meta: { title: '选手管理' }
    },
    {
      path: 'Teachers',
      component: () => import('@/views/User/Teachers'),
      name: 'Teachers',
      meta: { title: '教师管理' }
    },
    {
      path: 'Judges',
      component: () => import('@/views/User/Judges'),
      name: 'Judges',
      meta: { title: '评委管理' }
    }
  ]
}
export default UserRouter
