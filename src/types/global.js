import namespace from '@/utils/namespace';

export default namespace('global', {
  actions: [
    'changeLanguage'
  ],
  getters: [
    'processing',
    'language',
    'resetAllState',
    'BaseURL'
  ],
  mutations: [
    'startProcessing',
    'stopProcessing',
    'setLanguage',
    'setState'
  ]
});
