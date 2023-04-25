import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TABLE: AppRouteRecordRaw = {
  path: '/table',
  name: 'table',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.table',
    requiresAuth: true,
    icon: 'icon-list',
    order: 0,
  },
  children: [
    {
      path: 'search-table',
      name: 'SearchTable',
      component: () => import('@/views/table/search-table/index.vue'),
      meta: {
        locale: 'menu.table.searchTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'component-table',
      name: 'ComponentTable',
      component: () => import('@/views/table/component-table/index.vue'),
      meta: {
        locale: 'menu.table.componentTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'rich',
      name: 'RichText',
      component: () => import('@/views/richtext/index.vue'),
      meta: {
        locale: 'menu.table.componentTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default TABLE;
