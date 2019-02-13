import namespace from '@/utils/namespace'

export default namespace('menu', {  
  getters: [
    'collapse'
  ],
  actions: [ 
    'collapseMenu'
  ],
  mutations: [
    'setCollapse'
  ]
});