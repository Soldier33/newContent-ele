/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const UserRouter = {
  path: '/Society',
  component: Layout,
  redirect: '/Society/SocietyList',
  name: 'Society',
  meta: {
    title: '协会管理',
    icon: 'component'
  },
  children: [
    {
      path: 'SocietyList',
      component: () => import('@/views/Society/SocietyList'),
      name: 'SocietyList',
      meta: { title: '协会列表' }
    },
    {
      path: 'WorkCheck',
      component: () => import('@/views/Society/WorkCheck'),
      name: 'WorkCheck',
      meta: { title: '作品审核' }
    }
  ]
}
export default UserRouter
