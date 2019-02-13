import Vue from 'vue'
import App from './App.vue'
import router from '@/router'; //

 // global css
//import '@/styles/index.scss';
//.global css

//Axios
import axios from 'axios';
Vue.use(axios);
//.Axios

//vue resource
import VueResource from 'vue-resource';
Vue.use(VueResource);
//.vue resource

//vuex
import Vuex from 'vuex';
Vue.use(Vuex);

//.vuex

//Element-UI
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/es';
Vue.use(ElementUI, { locale })
//.Element-UI

//blockui
import BlockUI from 'vue-blockui';
Vue.use(BlockUI);
//.blockui

//modules y types
import globalTypes from '@/types/global'; 
import authModule from '@/modules/auth';
import requestVacation from '@/modules/vacation';
import Profile from '@/modules/profile';
import Home from '@/modules/home';
import modulesIncidence from '@/modules/incidence';
import menu from '@/modules/menu';
import reports from '@/modules/reports';
//.modulos y tipos

//vee-validate reglas en formulario (campos)
import validatorEs from '@/validator/es';
import validatorEn from '@/validator/en';
//Validator.localize('es', validatorEs);
//.vee-validate

//. extrayendo incial state
//console.log(initialState);

//almacén global de datos con vuex
export const store = new Vuex.Store({
  state: {
    processing: false,
    language: 'es'
  },
  actions: {
    [globalTypes.actions.changeLanguage]: ({commit}, lang) => {
      commit(globalTypes.mutations.setLanguage, lang);
      switch (lang) {
        case 'en': {
          Validator.localize('en', validatorEn);
          break;
        }
        case 'es': {
          Validator.localize('es', validatorEs);
          break;
        }
      }
    },
    [globalTypes.actions.resetAllState]: ({commit} ) => {
      commit(globalTypes.mutations.setState);
    }
  },
  getters: {
    [globalTypes.getters.processing]: state => state.processing, 
    [globalTypes.getters.language]: state => state.language,
    [globalTypes.getters.BaseURL]:state => state.urlBase,
  },
  mutations: {
    [globalTypes.mutations.startProcessing] (state) {
      state.processing = true;
    },
    [globalTypes.mutations.stopProcessing] (state) {
      state.processing = false;
    },
    [globalTypes.mutations.setLanguage] (state, lang) {
      state.language = lang;
    },
    [globalTypes.mutations.setState] (initialState){
      Object.keys(initialState).forEach(key => {
        Object.assign(initialState[key], this.store.modules[key])
      })
    }

  },
  modules: {
    authModule,
    requestVacation,
    modulesIncidence,
    Home,
    Profile,
    menu,
    reports
  }
});
//.almacén global de datos con vuex

//vue traducciones
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
import messages from '@/translations';
const i18n = new VueI18n({
  locale: store.state.language,
  messages
});
//.vue traducciones

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  i18n,
  router
});
