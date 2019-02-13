import types from '@/types/home';
import globalTypes from '@/types/global';

const axios = require('axios');
const instanceAxios = axios.create({
  baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
  timeout: 3000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const getDefaultState = ()=>{
   return{
      diasInhabiles:[],
      diasCumpleanios:[],
   }
}

const state = getDefaultState();

const getters = {
   [types.getters.diasInhabiles]: (state) => {
      return state.diasInhabiles;
   },
   [types.getters.diasCumpleanios]:(state) =>{
      return state.diasCumpleanios;
   }
};

const actions = {
   [types.actions.fetchDias]: ({commit}) => {
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('non-workingDays/')
         .then(response =>{
            commit(types.mutations.setDiasInhabiles, {apiResponse: response});
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
   [types.actions.fetchCumpleanios]:({commit}) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('birthdays/')
         .then(response =>{
            commit(types.mutations.setCumpleanios, {apiResponse: response});
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

const mutations = {
   [types.mutations.setDiasInhabiles]:(state, {apiResponse})=>{
      state.diasInhabiles = apiResponse.data.items
   },
   [types.mutations.setCumpleanios]:(state, {apiResponse})=>{
      state.diasCumpleanios = apiResponse.data.items
   },
   [types.mutations.reset]: (state) => {
      Object.assign(state, getDefaultState());
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
