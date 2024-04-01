import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/fetch',
    name: 'fetch',
    component: () => import('../views/FetchView.vue'),
  },
  {
    path: '/thousand',
    name: 'thousand',
    component: () => import('../views/ThousandFetchView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
