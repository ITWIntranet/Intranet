import types from '@/types/vacation';
import globalTypes from '@/types/global';

const axios = require('axios');
const instanceAxios = axios.create({
  baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
  timeout: 8000,
  headers:{'Content-Type':'text/plain'}
});

const getDefaultState = ()=>{
   return{
      vacaciones:{
         registrosVacaciones:[], //Arrays de registros anteriores
         diasDisponibles: 0,     //Dias disponibles para vaciones
         diasAdicional:0,        //Dias adicionales disponibles
         fechaExpDiaAdicional: '',//Fecha de expiración para dias Adicionales
         diasAVencer:0,          //Dias a vencer
         fechaExpDias:'',         //Fecha de expiración para dias a vencer
         vacacionesID:0,
      },
      registrosVacacionesPendientes:[],
      Correo: [],
   }
}

const state = getDefaultState();

const getters = {
   [types.getters.vacaciones]: state=>{ return state.vacaciones } ,
   [types.getters.getDaysVacation]: (state) => {
      return state.vacations;
   },
   [types.getters.registrosVacaciones]:(state)=>{
      return state.vacaciones.registrosVacaciones;
   },
   [types.getters.diasDisponibles]:(state)=>{
      return state.vacaciones.diasDisponibles;
   },
   [types.getters.diasAdicional]:(state) =>{
      return state.vacaciones.diasAdicional;
   },
   [types.getters.fechaExpDiaAdicional]:(state) =>{
      return state.vacaciones.fechaExpDiaAdicional;
   },
   [types.getters.diasAVencer]:(state) =>{
      return state.vacaciones.diasAVencer;
   },
   [types.getters.fechaExpDias]:(state)=>{
      return state.vacaciones.fechaExpDias;
   },
   [types.getters.recordsAutorizacion]:(state)=>{
      return state.registrosVacacionesPendientes;
   },
   [types.getters.Correo]:(state)=>{
      return state.Correo;
   },
};

const actions = {
   [types.actions.fetchVacations]: ({commit}, userId) => {
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('vacations/',{
            headers:{id:userId}
         })
         .then(response =>{
            commit(types.mutations.setVacaciones, {apiResponse: response});
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
   [types.actions.DatosCorreo]: ({commit}, LIDER) => {
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('CorreoLider',{
            headers:{LIDER:LIDER}
         })
         .then(response =>{
            commit(types.mutations.setCorreo, {apiResponse: response});
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
   [types.actions.fetchAutorizaciones]:({commit},userId) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('vacations/authorization/',{
            headers:{id: userId}
         })
         .then(response =>{
            commit(types.mutations.setRecordsAutorizacion, {apiResponse: response});
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
   [types.actions.administrarSolicitudes]:({commit}, detailVacation)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.put('vacations/authorization/',{},
         {
            headers:{
               comentario:detailVacation.comment,
               estatus:detailVacation.status,
               id: detailVacation.id
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
   [types.actions.registrarVacaciones]:({commit}, detailVacation)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.post('vacations/',{},
         {
            headers:{
               empleado: detailVacation.empleado,//empleadoid
               fecha_i: detailVacation.fecha_i,//fecha inicial de la solicitud
               fecha_f: detailVacation.fecha_f,//fecha final de la solicitud
               days: detailVacation.days,//dias a solicitar
               files: detailVacation.file,//archivo soporte
               autorizador: detailVacation.autorizador, //autorizador
               fecha_r: detailVacation.fecha_r,//fecha return
               dias: detailVacation.dias,//saldo dias disponibles
               diasadicionales: detailVacation.diasadicionales,//saldo dias adicionales
               diasxvencer: detailVacation.diasxvencer,//saldo dias a vencer
               fecha_diasxvencer: detailVacation.fecha_diasxvencer,//fecha de venc de dias por vencer
               fecha_diasadicionales: detailVacation.fecha_diasadicionales,//fecha vigencia de dias Adicionales
               numDayBeforeSolicitud: detailVacation.numDayBeforeSolicitud
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
   [types.actions.fetchDiasVacaciones]:({commit}, userId)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('daysVacation/',{ headers:{id:userId}})
         .then(response =>{
            commit(types.mutations.setDaysVacation, {apiResponse: response});
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
   [types.actions.addNewRequest]:({commit},newRequestVacation) => {
      commit(types.mutations.addRequest, newRequestVacation);
   },
   [types.actions.updateDays]:({commit}, resumeDays)=>{
      commit(types.mutations.updateDaysOfVacation, resumeDays);
   }
};

const mutations = {
   [types.mutations.setVacaciones]:(state, {apiResponse})=>{
      state.vacaciones.registrosVacaciones = apiResponse.data.items;
   },
   [types.mutations.setCorreo]:(state,{apiResponse})=>{
      state.Correo = apiResponse.data.items;
   },
   [types.mutations.setRecordsAutorizacion]:(state,{apiResponse})=>{
      state.registrosVacacionesPendientes = apiResponse.data.items;
   },
   [types.mutations.removeItemAutorization]:(state,index)=>{
      state.registrosVacacionesPendientes.splice(index,1);
   },
   [types.mutations.addRequest]:(state,newSolicitud)=>{
      state.vacaciones.registrosVacaciones.unshift(newSolicitud);
   },
   [types.mutations.reset]: (state) => {
      Object.assign(state, getDefaultState());
   },
   [types.mutations.setDaysVacation]:(state, {apiResponse})=>{
      state.vacaciones.vacacionesID = apiResponse.data.id_vacations;
      state.vacaciones.diasDisponibles= apiResponse.data.dias_disponibles;
      state.vacaciones.diasAdicional= apiResponse.data.dias_adicionales;
      state.vacaciones.fechaExpDiaAdicional= apiResponse.data.fecha_vd_adicionales;
      state.vacaciones.diasAVencer= apiResponse.data.dias_xvencer;
      state.vacaciones.fechaExpDias= apiResponse.data.fecha_vd_xvencer;
   },
   [types.mutations.updateDaysOfVacation]:(state,resumeDays)=>{
      state.vacaciones.diasDisponibles= resumeDays.dias_disponibles;
      state.vacaciones.diasAdicional= resumeDays.dias_adicionales;
      state.vacaciones.fechaExpDiaAdicional= resumeDays.fecha_vd_adicionales;
      state.vacaciones.diasAVencer= resumeDays.dias_xvencer;
      state.vacaciones.fechaExpDias= resumeDays.fecha_vd_xvencer;
   },
};

export default {
   state,
   getters,
   actions,
   mutations
};
