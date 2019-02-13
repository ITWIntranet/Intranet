import typesReport from '@/types/reports';
import globalTypes from '@/types/global'

const axios = require('axios');
const instanceAxios = axios.create({
    baseURL: 'https://apex-a261292.db.us2.oraclecloudapps.com/apex/intranet/',
    timeout: 8000,
    headers:{'Content-Type':'text/plain'}
});

const getDefaultState = () => {
    return{
        allVacations:[],
        allIncidencias:[],
        toExpire:[]
    }
};

const state = getDefaultState();

const getters = {
    [typesReport.getters.vacationHistoric]:(state)=>{
        return state.allVacations;
    },
    [typesReport.getters.incidenceHistoric]:(state)=>{
        return state.allIncidencias;
    },
    [typesReport.getters.vacationToExpire]:(state)=>{
        return state.toExpire
    }
};

const actions = {
    [typesReport.actions.getAllVacaciones]: ({commit}) => {
        commit(globalTypes.mutations.startProcessing);
        return new Promise((resolve, reject) => {
           instanceAxios.get('reports/vacations/')
           .then(response =>{
              commit(typesReport.mutations.setAllVacations, {apiResponse: response});
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
     [typesReport.actions.getAllIncidences]: ({commit}) => {
        commit(globalTypes.mutations.startProcessing);
        return new Promise((resolve, reject) => {
           instanceAxios.get('reports/incidences/')
           .then(response =>{
              commit(typesReport.mutations.setAllIncidences, {apiResponse: response});
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
     [typesReport.actions.getAllExpire]: ({commit}) => {
        commit(globalTypes.mutations.startProcessing);
        return new Promise((resolve, reject) => {
           instanceAxios.get('reports/toexpire/')
           .then(response =>{
              commit(typesReport.mutations.setAllExpire, {apiResponse: response});
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
    [typesReport.mutations.setAllVacations]:(state, {apiResponse})=>{
        state.allVacations = apiResponse.data.items
    },
    [typesReport.mutations.setAllIncidences]:(state, {apiResponse})=>{
        state.allIncidencias = apiResponse.data.items
    },
    [typesReport.mutations.setAllExpire]:(state, {apiResponse})=>{
        state.toExpire = apiResponse.data.items
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
