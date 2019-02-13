<template>
  <div id="login_form" v-bind:style="{ 'background-image': 'url(' + imagen + ')' }">
    <el-row>
      <el-col :span="24" style="min-height:80px;"></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="9">
        <el-card class="box-card" style=" box-shadow: 5px 5px;">
          <img class="logo-itw" src="src\assets\logo.png" alt="logo itw">
          <el-tabs v-model="activeName">
            <el-tab-pane label="Login" name="login">
              <el-form ref="usuario" :model="usuario" label-width="100px" 
                :rules="rules_user" label-position="left" :status-icon="icon_form">
                <el-form-item label="Usuario" prop="email">
                  <el-input type="text" v-model="usuario.email">
                    <template slot="append">@itw.mx</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                  <el-input :type="typeInput" v-model="usuario.password">
                    <el-button id="btnView" slot="append" icon="el-icon-view" @click="changeTypeInput" plain></el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-row>
                <!--<el-col :span="24">
                  <el-switch v-model="remember" inactive-text="Recordar"></el-switch>
                </el-col>
                <el-col :span="24"><hr></el-col>-->
                <el-col :span="6" :offset="16">
                  <el-button type="primary" @click="iniciarSesion('usuario')" round>Iniciar</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Reset Password" name="reset">
              <el-form ref="usuario" :model="usuario" label-width="100px" 
                :rules="rules_user" label-position="left" :status-icon="icon_form">
                <el-form-item label="Usuario" prop="email">
                  <el-input type="email" v-model="usuario.email"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="resetPassword('usuario')" round>Reset</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import authTypes from '@/types/auth';
  import { mapActions } from 'vuex';
  import {store} from '@/main';
  import io from 'socket.io-client';//Libreria necesaria para notificaciones real-time
  import axios from 'axios';

  export default {
    name: 'login',
    data () {
      return {
        usuario: {
          email: '',
          password: '',
        },
        socket:io('http://65.99.252.240:3000/'),//El localhost, debera ser reemplazado por el dominio donde sea alojada la aplicacion
        typeInput:'Password',
        icon_form:true,
        remember: false,
        activeName: 'login',
        rules_user:{
          email:[
            { required: true, message: 'Favor de ingresar su usuario nombre.apellidoPaterno', trigger: 'blur' }
          ],
          password:[
            { required: true, message: 'Favor de ingresar su contraseña', trigger: 'blur' },
            { min: 5, message: 'Su pasword no cumple con la longitud mínima', trigger: 'blur' }
          ]
        },
        image:['/src/assets/img1.jpg','/src/assets/img2.jpg','/src/assets/img3.jpg'],
        isSesionActiva:null
      }
    },
    methods: {
      ...mapActions({
        login : authTypes.actions.login,
        validUser: authTypes.actions.getUser,
        reset: authTypes.actions.resetPassword
      }),
      iniciarSesion(formName){
          this.$refs[formName].validate((valid) => {//revisar documentacion de Element.io(Form)
            if (valid) {
              let usernick = this.usuario.email.toLowerCase().replace('@itw.mx','') + "@itw.mx";
              this.socket.emit('login_user',{username:usernick});//enviamos la peticion

              //Recibimos la respuesta para validar una sesion activa del usuario
              this.socket.on('login',(data)=>{
                this.sigin(data,usernick);
              });

            } else {
              this.$message.error('Favor de no dejar campos vacios.');
              this.usuario.password = '';
              return false;
            }
          });
      },
      sigin(data, userName){
        if(!data.session){
          this.login({
            user : userName
          })
          .then(
            response => {
              if( this.$store.state.authModule.user.estatus === "ACTIVO"){
                if( this.$store.state.authModule.user.pass === this.usuario.password){
                  this.$router.push('/');
                }else{
                  this.socket.emit("destroySesion",{username:userName});
                  this.$message.error('Usuario y/o password incorrecto.');
                  //this.usuario.password = '';//reset password
                  this.$refs.usuario.resetField('password');
                }
              }else{
                this.$message.warning('Tú usario se encuentra inactivo favor de cominicarse al área de RH.');
                //this.usuario.password = '';
                this.$refs.usuario.resetField('password');
              }
            },
            error => {
              //Agregar un bloque Try catch
              if(error.response.status >= 500 || error.response.status < 600){
                this.$message.error('Revise su conexión a internet y vuelva a intentarlo.');
              }else if(error.response.status >= 400 || error.response.status < 500  ){ //Client Error Status Code
                this.$message.error('Usuario y/o password incorrecto.');
              }
              //this.usuario.password = '';
              this.$refs.usuario.resetField('password');
            });
        }else{
          this.$message.error('Tiene una sessión activa en otro navegador.');
        }
      },
      resetPassword(formName){ 
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.validUser({email:this.usuario.email})
            .then(
              response=>{
                /*console.log(`========= LOG de respuesta ============= `);
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);*/
                //let passAleatorio = this.generarPassword();
                /*this.reset({
                  pwd:passAleatorio,
                  email: this.usuario.email,
                })
                .then(
                  response=>{*/
                    this.AxiosInstance.post('sendEmail',{
                      emailType:1,
                      userData:{
                        name:response.data.nombre,
                        password:response.data.password
                      },
                      Mailto:response.data.usuario
                    }).then(
                      response=>{
                        this.$message({
                          message: 'El password ha sido enviado a su correo.',
                          type: 'success',
                          showClose: true
                        });
                        this.$refs[formName].resetFields();
                      },
                      error=>{
                        console.log(`Error: ${error}`);
                        console.log(error.config);
                        this.$message({
                          message: 'El password ha sido enviado a su correo.',
                          type: 'success',
                          showClose: true
                        });
                        this.$refs[formName].resetFields();
                      }
                    );
                  /*},
                  error=>{
                    console.log(`Error al actualizar pwd: ${error}`);
                    console.log(error.config);
                    this.$message({
                      message: `Servicio no disponible favor de intentarlo más tarde.`,
                      type: 'warning',
                      showClose: true,
                    });
                    this.$refs[formName].resetFields();
                  }
                );*/
              },
              error=>{
                console.log(`Error al validar usuario: ${error}`);
                console.log(error.config);
                this.$message({
                  message: `El usuario: ${this.usuario.email}, no encontrado o se encuentra desactivado.`,
                  type: 'warning',
                  showClose: true,
                });
                 this.$refs[formName].resetFields();
              }
            );
          }else {
            this.$message.error('Favor de ingresar su usuario.');
            return false;
          }
        });
      },
      generarPassword:function(){
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&/()=?¡*[];';
        var result = '';
        for (var i = 16; i > 0; --i){
          result += chars[Math.floor(Math.random() * chars.length)];
        } 
        return result;
      },
      changeTypeInput(){
        this.typeInput ==='Password'? this.typeInput ='Text' : this.typeInput = 'Password' ;
      }
    },    
    computed:{
      imagen(){
        var i = Math.floor(Math.random() * 3);
        return this.image[Number.isInteger(i)?i:0];
      },
      AxiosInstance(){
        const instanceAxios = axios.create({
          baseURL: 'http://65.99.252.240:3000/',//en produccion sustituir por el dominio donde sea alojada el aplicatio Express
          timeout: 2000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        return instanceAxios;
      }
    },
    mounted(){
      var lasCookies = document.cookie;
      console.log(document.cookie);
    }
  }
</script>
<style>
  #login_form{
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .logo-itw{
    height: 6em;
    margin: 0em 5em;
  }
  .el-form-item__label{line-height: 20px;}
  .el-input-group__append{padding: 0 4px !important;}
  .el-input_inner{padding: 0 5px !important;}
  
  /* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {
    .el-col-offset-9 {
    margin-left: 10%;
    }
    .el-col-6 {
      width: 80%;
    }
    .logo-itw{
      margin: 0em 3.5em;
    }
    .el-form-item__error{
      font-size: 9px;
    }
    .el-col-offset-16 {
    margin-left: 60%;
    }
  }

  /*Small devices (landscape phones, 576px and up)*/
  @media (min-width: 576px) and (max-width: 767.98px) {
    .el-col-offset-9 {
    margin-left: 10%;
    }
    .el-col-6 {
      width: 80%;
    }
    .logo-itw{
      margin: 0em 3.5em;
    }
    .el-form-item__error{
      font-size: 9px;
    }
    .el-col-offset-16 {
    margin-left: 60%;
    }
  }

  /*Medium devices (tablets, 768px and up)*/

  @media (min-width: 768px) and (max-width: 991.98px) {
    .el-col-offset-9 {
    margin-left: 20%;
    }
    .el-col-6 {
      width: 60%;
    }
    .logo-itw{
      margin: 0em 9em;
    }
  }

  /*Large devices (desktops, 992px and up)*/
  @media (min-width: 992px) and (max-width: 1199.98px) {}

  /*Extra large devices (large desktops, 1200px and up)*/
  @media (min-width: 1200px) {

  }
</style>

