import namespace from '@/utils/namespace'

export default namespace('incidents', {
  getters: [
    'recordsIncidencesApproved',
    'recordsIncidencesPending'

  ],
  actions: [
    'consultarIncidencias',
    'autorizarIncidencias',
    'administrarIncidencias',
    'registrarIncidencias',
    'sendNewRegister'
  ],
  mutations: [
    'setIncidencias',
    'setRecordsIncidence',
    'deleteRegister',
    'reset',
    'sendRequest'
  ]
})

