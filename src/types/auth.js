import namespace from '@/utils/namespace'

export default namespace('auth', {  
  getters: [
    'user', 
    'logged'
  ],
  actions: [ 
    'login',
    'register',
    'logout',
    'updateProfile',
    'laterChangePass',
    'ChangePass',
    'getUser',
    'resetPassword'
  ],
  mutations: [
    'setUser',
    'setLogout',
    'setDefaultPass',
    'setPass'
  ]
}); 