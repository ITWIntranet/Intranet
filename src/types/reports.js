import namespace from '@/utils/namespace'

export default namespace('reports', {
    getters: [
        'vacationHistoric',
        'incidenceHistoric',
        'vacationToExpire'
    ],
    actions: [
        'getAllVacaciones',
        'getAllIncidences',
        'getAllExpire'
    ],
    mutations: [
        'setAllVacations',
        'startProcessing',
        'setAllIncidences',
        'setAllExpire'
    ]
})