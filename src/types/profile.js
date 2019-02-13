import namespace from '@/utils/namespace'

export default namespace('profile', {
  getters: [
      'datosPersonales',
      'datosEmpleado',
      'delegaciones',
  ],
  actions: [
    'fetchDatosP',
    'fetchDatosEmp',
    'fetchDelegaciones',
    'fetchPassword',
    'PassUp',
    'ProfUp'
  ],
  mutations: [
    'setDatosP',
    'setDatosEmp',
    'reset',
    'setDelegaciones',
    'setPassword',
    'setDatosNuevos'
  ]
})