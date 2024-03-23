import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserInfoStore } from '@/stores/userInfo';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/meals',
      component: () => import('@/views/MealsView.vue'),
      children: [
        {
          path:'',
          name: 'meals',
          component: () => import('@/components/Meal/SelectableMenusList.vue')
        },
        {
          path: 'order/:id',
          name: 'orderCreate',
          component: () => import('@/components/Meal/SelectableMenuMealsList.vue'),
          props: true
        }
      ]
    },
    {
      path: '/users',
      component: () => import('@/views/UsersView.vue'),
      children: [
        {
          path:'',
          name: 'users',
          component: () => import('@/components/Users/UsersList.vue')
        },
        {
          path: 'create',
          name: 'userCreate',
          component: () => import('@/components/Users/CreateUser.vue')
        }
      ]
    },
    {
      path: '/menu',
      component: () => import('@/views/MenuView.vue'),
      children: [
        {
          path: '',
          name: 'menu',
          component: () => import('@/components/Menu/MenuList.vue')
        },
        {
          path: 'inspect/:id',
          name: 'menuInspect',
          component: () => import('@/components/Menu/MenuInspect.vue'),
          props: true
        },
        {
          path: 'create',
          name: 'menuCreate',
          component: () => import('@/components/Menu/CreateMenu.vue')
        }
      ]
    }
  ]
});

router.beforeEach(async (to, from) => {
  const publicPages = ['/login'];
  const adminPages =['/users', '/menu'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();
  const userInfo = useUserInfoStore();
  const token = auth.token;

  if(token && to.path == '/login') {
    return from.path;
  }

  for(var i = 0; i < adminPages.length; i++) {
    if(to.path.includes(adminPages[i]) && userInfo.role != 'ADMIN') {
      if(to.path == '/login') {
        return '/login'
      }
      return from.path;
    }
  }

  if(authRequired && (!auth.user && !auth.token && !auth.refreshToken)) {
    return '/login';
  }
});

export default router
