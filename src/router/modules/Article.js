/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ArticleRouter = {
  path: '/Article',
  component: Layout,
  redirect: '/Article/Judges',
  name: 'Article',
  meta: {
    title: '文章管理',
    icon: 'language'
  },
  children: [
    {
      path: 'Carousel',
      component: () => import('@/views/Article/Carousel'),
      name: 'Carousel',
      meta: { title: '轮播图' }
    },
    {
      path: 'Notice',
      component: () => import('@/views/Article/Notice'),
      name: 'Notice',
      meta: { title: '竞赛通知' }
    },
    {
      path: 'Trend',
      component: () => import('@/views/Article/Trend'),
      name: 'Trend',
      meta: { title: '竞赛动态' }
    },
    {
      path: 'Event',
      component: () => import('@/views/Article/Event'),
      name: 'Event',
      meta: { title: '竞赛项目' }
    },
    {
      path: 'Question',
      component: () => import('@/views/Article/Question'),
      name: 'Question',
      meta: { title: '常见问题' }
    },
    {
      path: 'About',
      component: () => import('@/views/Article/About'),
      name: 'About',
      meta: { title: '关于我们' }
    }
  ]
}
export default ArticleRouter
