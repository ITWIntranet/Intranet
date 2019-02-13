import types from '@/types/menu';

const state = {
   menuCollpase:false
};

const getters = {
   [types.getters.collapse]: (state) => {
      return state.menuCollpase;
   }
};

const actions = {
   [types.actions.collapseMenu]: ({commit},menuOption) => {
      commit(types.mutations.setCollapse,menuOption);
   }
};

const mutations = {
   [types.mutations.setCollapse]:(state, menu)=>{
      state.menuCollpase = menu
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};