import types from '@/types/profile';
import globalTypes from '@/types/global';

const axios = require('axios');
const instanceAxios = axios.create({
  baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
  timeout: 3000,
  headers: {
   'Content-Type':'text/plain'
  }
});

const getDefaultState = ()=>{
   return{
      datosP: [],
      datosEmp:[],
      delegaciones:[],
      datosPass: [],
      setDatosN: this.datosPass,
   }
}

const state = getDefaultState();

const getters = {
   [types.getters.datosPersonales]: (state) => {
      return state.datosP;
   },
   [types.getters.datosEmpleado]: (state) => {
      return state.datosEmp;
   },
   [types.getters.delegaciones]: (state) => {
      return state.delegaciones;
   },
   [types.getters.datosPassword]: (state) => {
      return state.datosPass;
   }
};

const actions = {
   [types.actions.fetchDatosP]:({commit},id) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('profile/',{headers:{user:id}})
         .then(response =>{
            commit(types.mutations.setDatosP, {apiResponse: response});
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
   [types.actions.fetchDatosEmp]:({commit},id) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('profile/area',{headers:{user: id}})
         .then(response =>{
            commit(types.mutations.setDatosEmp, {apiResponse: response});
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
   [types.actions.fetchDelegaciones]:({commit}) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('delegaciones/')
         .then(response =>{
            commit(types.mutations.setDelegaciones, {apiResponse: response});
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
   [types.actions.PassUp]:({commit}, userInput)=>{
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
   [types.actions.ProfUp]:({commit}, newdatosP)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.put('profile/',{},
         {
            headers:{
               calle: newdatosP.calle,
               celular: newdatosP.celular,
               colonia: newdatosP.colonia,
               correo: newdatosP.correo,
               cp: newdatosP.cp,
               delegacion: newdatosP.delegacion,
               id: newdatosP.eid,
               numext: newdatosP.numext,
               numint: newdatosP.numint,
               telefono: newdatosP.telefono,
            }
         })
         .then(response =>{
            //ejecutar mutation para actualizar el state
            //commit(types.mutations.setDatosNuevos,newdatosP);
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
   
};

const mutations = {
   [types.mutations.setDatosP]:(state, {apiResponse})=>{
      state.datosP = apiResponse.data
   },
   [types.mutations.setDatosEmp]:(state, {apiResponse})=>{
      state.datosEmp = apiResponse.data
   },
   [types.mutations.setDelegaciones]:(state, {apiResponse})=>{
      state.delegaciones = apiResponse.data.items
   },
   [types.mutations.setPassword]:(state, {apiResponse})=>{
      state.datosPass = apiResponse.data
   },
   [types.mutations.reset]: (state) => {
      Object.assign(state, getDefaultState());
   }
   //[types.mutations.setDatosNuevos]:(state, {apiResponse})=>{
   //   state.datosP = newdatosP.data
  // },
};

export default {
   state,
   getters,
   actions,
   mutations
};