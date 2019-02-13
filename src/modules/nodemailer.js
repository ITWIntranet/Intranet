import types from '@/types/mailer';


const state={
   emailSend:false
};

const getters={
   [types.getters.getEmailSend]:(state)=>{
      return state.emailSend;
   }
};

const actions={
   [types.actions.sendEmail]:()=>{
      
   }
};

const mutations={
   [types.mutations.setDiasInhabiles]:(state, status)=>{
      state.emailSend = status
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};