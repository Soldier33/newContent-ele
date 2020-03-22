/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const CompetitionRouter = {
  path: '/Competition',
  component: Layout,
  redirect: '/Competition/Enroll',
  name: 'Competition',
  meta: {
    title: '赛事管理',
    icon: 'star'
  },
  children: [
    {
      path: 'Enroll',
      component: () => import('@/views/Competition/Enroll'),
      name: 'Enroll',
      meta: { title: '报名管理' }
    },
    {
      path: 'Score',
      component: () => import('@/views/Competition/Score'),
      name: 'Score',
      meta: { title: '评分管理' }
    },
    {
      path: 'Award',
      component: () => import('@/views/Competition/Award'),
      name: 'Award',
      meta: { title: '奖项管理' }
    }
  ]
}
export default CompetitionRouter
