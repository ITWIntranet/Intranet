import namespace from '@/utils/namespace'

export default namespace('home', {
  getters: [
      'diasInhabiles', 
      'diasCumpleanios'         
  ],
  actions: [
    'fetchDias',
    'fetchCumpleanios'
  ],
  mutations: [
    'setDiasInhabiles',
    'setCumpleanios',
    'reset'
  ]
})