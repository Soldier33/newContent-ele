/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const SearchRouter = {
  path: '/Search',
  component: Layout,
  redirect: '/Search',
  name: 'Search',
  meta: {
    title: '查询管理',
    icon: 'search'
  },
  children: [
    {
      path: 'SearchList',
      component: () => import('@/views/Search/SearchList'),
      name: 'SearchList',
      meta: { title: '查询管理' }
    }
  ]
}
export default SearchRouter
