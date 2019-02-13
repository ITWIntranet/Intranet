import types from '@/types/auth';
import vacation from '@/types/vacation';
import home from '@/types/home';
import profile from '@/types/profile';
import incidence from '@/types/incidence';
import globalTypes from '@/types/global';

const axios = require('axios');
const instanceAxios = axios.create({
  baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
  timeout: 8000,
  headers: {
    'Accept': 'text/plain',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

const getDefaultState = ()=>{
  return{
    user: null,
    logged: false
  }
}

const state = getDefaultState();

const actions = { 
  /**
   * Action: Login
   * parametros: email del empleado
   * Descripcion: Validar que el usuario este activo y se encuentre en
   *            la base de datos alojada en Apex, accediendola mediante
   *            RestFult services. 
   * URI: inicio/
   * Metodo Http: get
   */
  [types.actions.login]: ({commit}, userInput) => {
    commit(globalTypes.mutations.startProcessing); 
    return new Promise((resolve, reject) => {
      instanceAxios.get('inicio/', {
        headers:{
          user: userInput.user
          }
        })
        .then(response => {
            commit(types.mutations.setUser,{apiResponse: response});
            resolve(response);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          commit(globalTypes.mutations.stopProcessing);
        })
    })
  },
  /**
   * Action: Logout
   * parametros: N/A
   * Descripcion: Metodo para actualizar los parametros del State a su valor 
   *            inicial.
   * URI: N/A
   * Metodo Http: N/A
   */
  [types.actions.logout]: ({commit}) => {
    commit(types.mutations.setLogout);
    commit(vacation.mutations.reset); 
    commit(home.mutations.reset); 
    commit(profile.mutations.reset); 
    commit(incidence.mutations.reset); 
  },
  /**
   * Action: 
   * parametros:
   * Descripcion:
   * URI:
   * Metodo Http:
   */
  [types.actions.laterChangePass]:({commit}) =>{
    commit(types.mutations.setDefaultPass);
  },
  /**
   * Action: 
   * parametros:
   * Descripcion:
   * URI:
   * Metodo Http:
   */
  [types.actions.ChangePass]:({commit}, userInput)=>{
    commit(globalTypes.mutations.startProcessing);
    return new Promise((resolve, reject) => {
      instanceAxios.put('inicio/',{},
      {
        headers:{
          eid: userInput.eid,
          pass: userInput.pass,
        }
      })
      .then(response =>{
        commit(types.mutations.setPass, userInput.pass);
        commit(types.mutations.setDefaultPass);
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit(globalTypes.mutations.stopProcessing);
      })
    })
  },
  /**
   * Action: 
   * parametros:
   * Descripcion:
   * URI:
   * Metodo Http:
   */
  [types.actions.getUser]:({commit},userReset)=>{
    return new Promise((resolve, reject) => {
      instanceAxios.get('resetPassword/',
      {
        headers:{
          user: userReset.email
        }
      })
      .then(response =>{
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
      })
    })
  },
  /**
   * Action: 
   * parametros:
   * Descripcion:
   * URI:
   * Metodo Http:
   */
  [types.actions.resetPassword]:({commit},newPassword) =>{
    commit(globalTypes.mutations.startProcessing);
    return new Promise((resolve, reject) => {
      instanceAxios.put('resetPassword/',{},
      {
        headers:{
          password: newPassword.pwd,
          usuario: newPassword.email
        }
      })
      .then(response =>{
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit(globalTypes.mutations.stopProcessing);
      })
    })
  }
}; 

const getters = {
  //obtenemos el usuario
  [types.getters.user]: (state) => {
    return state.user;
  },
  //está logueado?
  [types.getters.logged]: (state) => {
    return state.logged;
  }
};

const mutations = {
  //establecemos el user a través del reponse
  /**
   * Mutation: 
   * parametros:
   * Descripcion:
   */
  [types.mutations.setUser]: (state, {apiResponse}) => {
    state.user = apiResponse.data;
    state.logged = true;
  },
  //reestablecemos el estado de los datos
  /**
   * Mutation: 
   * parametros:
   * Descripcion:
   */
  [types.mutations.setLogout]: (state) => {
    Object.assign(state, getDefaultState());
  },
  /**
   * Mutation: 
   * parametros:
   * Descripcion:
   */
  [types.mutations.setDefaultPass]: (state) => {
    state.user.pass_default = "1";
  },
  /**
   * Mutation: 
   * parametros:
   * Descripcion:
   */
  [types.mutations.setPass]:(state,newPass)=>{
    state.user.pass = newPass;
  }
};

export default {
  state,
  actions,
  getters,
  mutations
};
