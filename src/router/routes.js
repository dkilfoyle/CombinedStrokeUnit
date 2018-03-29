export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {path: '', component: () => import('pages/index')},
      {path: '/beddays', component: () => import('pages/beddays')},
      {path: '/bedoccupancy', component: () => import('pages/bedoccupancy')}
    ]
  },

  {
    // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
