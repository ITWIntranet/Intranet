import typesIncidence from '@/types/incidence';
import globalTypes from '@/types/global';

const axios = require('axios');
const instanceAxios = axios.create({
  baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
  timeout: 3000,
  headers:{'Content-Type':'text/plain'}
});

const getDefaultState = ()=> {
   return{
      incidenciasPending:[],
      regIncidenciasPorAprobar:[]

   }
};

const state = getDefaultState();

const getters = {
   [typesIncidence.getters.recordsIncidencesApproved]:(state)=>{
      return state.incidenciasPending;
   }, 
   [typesIncidence.getters.recordsIncidencesPending]:(state)=>{
      return state.regIncidenciasPorAprobar;
   }
};

const actions = {
   [typesIncidence.actions.consultarIncidencias]: ({commit}, userId) => {
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('incidence/',{
            headers:{
               id: userId
            }
         })
         .then(response =>{
            commit(typesIncidence.mutations.setIncidencias, {apiResponse: response});
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
   [typesIncidence.actions.autorizarIncidencias]:({commit}, userId) =>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.get('incidence/authorization/',{headers:{id: userId}},{})
         .then(response =>{
            commit(typesIncidence.mutations.setRecordsIncidence, {apiResponse: response});
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
   //Aprobar - Rechazar Incidencias 
   [typesIncidence.actions.administrarIncidencias]:({commit}, detailIncidence)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.put('incidence/authorization/',{},
         {
            headers:{
               comentario:detailIncidence.comment,
               estatus:detailIncidence.status,
               id: detailIncidence.id,
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
   //Registrar incidencias
   [typesIncidence.actions.registrarIncidencias]:({commit}, detailIncidenceRequest)=>{
      commit(globalTypes.mutations.startProcessing);
      return new Promise((resolve, reject) => {
         instanceAxios.post('incidence/',{},
         {
            headers:{
               empleado_id: detailIncidenceRequest.empleado_id,//numero empleado
               fecha_inicio: detailIncidenceRequest.fecha_inicio,//fecha de inicio
               fecha_fin: detailIncidenceRequest.fecha_fin,//fecha de termino
               total_dias: detailIncidenceRequest.total_dias,//total de dias 
               comentario: detailIncidenceRequest.comentario,//comentario
               file_name: detailIncidenceRequest.file_name,//nombre de archivo adjunto
               autorizador_id: detailIncidenceRequest.autorizador_id//autorizador de la incidencia
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
   [typesIncidence.actions.sendNewRegister]:({commit},NewRequestIncidence) => {
      commit(typesIncidence.mutations.sendRequest, NewRequestIncidence );
   }
};


const mutations = {
   [typesIncidence.mutations.setIncidencias]:(state, {apiResponse})=>{
      state.incidenciasPending = apiResponse.data.items
   },
   [typesIncidence.mutations.setRecordsIncidence]:(state, {apiResponse})=>{
      state.regIncidenciasPorAprobar = apiResponse.data.items
   },
   [typesIncidence.mutations.deleteRegister]:(state,index)=>{
      state.regIncidenciasPorAprobar.splice(index);
   },
   [typesIncidence.mutations.reset]: (state) => {
      Object.assign(state, getDefaultState());
   },
   [typesIncidence.mutations.sendRequest]:(state,newIncidence)=>{
      state.incidenciasPending.unshift(newIncidence);
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
