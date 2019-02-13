import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router); 

//types and components
import authTypes from '@/types/auth';
import Login from '@/components/Auth/Login';
import Profile from '@/components/Profile/Profile';
import VacationApproved from '@/components/vacation/vacationApproved';
import Vacation from '@/components/vacation/vacationRequets';
import Home from '@/components/home/Home';
import Layout from '@/views/layout';
import IncidenceApproved from '@/components/Incidence/IncidenceApproved';
import Incidence from '@/components/Incidence/IncidenceRequest';
import Reportes from '@/components/Reports/Reports';
//.types and components

//global store
import {store} from '@/main';
//.global store

//configurar el router
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { Auth: false, title: 'Iniciar sesión' },
      beforeEnter: (to, from, next) => {
        if(store.state.authModule.logged) {
          next({ path: '/' });
        } else {
          next();
        }
      }
    },
    {
      path:'/',
      component: Layout,
      redirect: '/Home',
      name: 'Home',
      meta: { Auth: true, title: 'Intranet | ITW' },
      children:[
        {
          path:'Home',
          name:'HomePage',
          component: Home,
          meta: { Auth: true, title: 'Bienvenido' }
        }
      ]
    },
    {
      path:'/vacaciones',
      component: Layout,
      redirect: '/vacaciones/request',
      name: 'VacationRequest',
      meta: { Auth: true },
      children:[
        {
          path:'request',
          name:'RequestVacation',
          component: Vacation,
          meta: { Auth: true, title: 'Capturar vacaciones' }
        }
      ]
    },
    {
      path:'/profile',
      component: Layout,
      redirect: '/profile/user',
      name: 'Perfil',
      meta: { Auth: true },
      children:[
        {
          path:'user',
          name:'PerfilUser',
          component: Profile,
          meta: { Auth: true, title: 'Perfil' }
        }
      ]
    },
    {
      path:'/vacaciones',
      component: Layout,
      redirect: '/vacaciones/approved',
      name: 'VacationApproved',
      meta: { Auth: true, title: 'Autorizar vacaciones' },
      children:[
        {
          path:'approved',
          name:'approvedVacation',
          component: VacationApproved,
          meta: { Auth: true, title: 'Autorizar vacaciones' }
        }
      ]
    },
    {
      path:'/incidencias',
      component: Layout,
      redirect: '/incidencias/request',
      name: 'IncidenceRequest',
      meta: { Auth: true },
      children:[
        {
          path:'request',
          name:'RequestIncidence',
          component: Incidence,
          meta: { Auth: true, title: 'Ingresar incidencias' }
        }
      ]
    },
    {
      path:'/incidencias',
      component: Layout,
      redirect: '/incidencias/approved',
      name: 'IncidenceApproved',
      meta: { Auth: true },
      children:[
        {
          path:'approved',
          name:'approvedIncidence',
          component: IncidenceApproved,
          meta: { Auth: true, title: 'Autorizar incidencias' }
        }
      ]
    },
    {
      path: '/reportes',
      component: Layout,
      redirect: '/reportes/reports',
      name: 'Reports',
      meta: { Auth: true },
      children: [
        {
          path: 'reports',
          name: 'Reportes',
          component: Reportes,
          meta: { Auth: true, title: 'Reportes' }
        }
      ]
    },
    {
      path:'/*',
      redirect:'/Home'
    }
  ]
});
//.configurar el router

//para cada cambio de ruta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.meta.Auth && !store.state.authModule.logged) {
    next({path: '/login'});
  } else {
    /*if (store.state.authModule.logged) {
      store.commit(authTypes.mutations.setUser);
    }*/
    next();
  }
});
//.para cada cambio de ruta

export default router;
