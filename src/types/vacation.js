import namespace from '@/utils/namespace'

export default namespace('vacation', {
  getters: [
      'vacaciones',          //Objeto Vacaciones para guardar el detalle de las vacaciones
      'registrosVacaciones', //Arrays con historico de vacaciones
      'diasDisponibles',     //Dias disponibles para vaciones
      'diasAdicional',       //Dias adicionales disponibles
      'fechaExpDiaAdicional',//Fecha de expiración para dias Adicionales
      'diasAVencer',         //Dias a vencer
      'fechaExpDias',         //Fecha de expiración para dias x vencer
      'recordsVacations',
      'recordsAutorizacion',
      'getDaysVacation',
      'Correo',
  ],
  actions: [
    'fetchVacations', //Action para consultar todos los registros de vacaciones y datos del usuario.
    'registrarVacaciones',  //Action para crear nuevas solicitudes
    'fetchAutorizaciones',
    'administrarSolicitudes',
    'fetchDiasVacaciones',
    'addNewRequest',
    'updateDays',
    'DatosCorreo',
  ],
  mutations: [
    'setVacaciones',
    'setRecordsAutorizacion',
    'removeItemAutorization',
    'addRequest',
    'reset',
    'setDaysVacation',
    'updateDaysOfVacation',
    'setCorreo'
  ]
})