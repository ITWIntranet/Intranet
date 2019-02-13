<!--
/**
 * Nombre del template:
 * Creado por:
 * Fecha Creación:
 * Modificado por:
 * Descripcion:
 */
-->
<template>
   <el-menu
         id="menu-header"
         :default-active="$route.path"
         class="el-menu-demo"
         mode="horizontal"
         router
         background-color="#545c64"
         text-color="#fff"
         active-text-color="#409EFF">
         <el-tooltip class="item" effect="dark" 
         :content="activo?'Usuario activo para recibir solicitudes.':'No recibiras nuevas solicitudes hasta estar activo.'" 
         placement="top">
            <el-menu-item :index="$route.path" v-if="rolId === 1 || rolId === 3 || rolId === 2 || rolId === 5">
               <span id="statusUser">Usuario {{activo?'activo':'inactivo'}}</span>
               <el-switch v-model="activo"></el-switch>
            </el-menu-item>
         </el-tooltip>
         <el-menu-item :index="$route.path" v-if="newRequest==0"><i class="fas fa-bell fa-lg"></i></el-menu-item>
         <el-submenu :index="$route.path" v-if="newRequest>0">
            <template slot="title">
               <el-badge :value="newRequest" class="item fas fa-bell fa-lg" type="primary"></el-badge>
            </template>
            <el-submenu index="2-2">
               <template slot="title"><i style="color:#fff; margin-right:5px;" class="fas fa-plane-departure"></i>VACACIONES</template>
               <el-menu-item index="/vacaciones/approved"> <!--Elemento quer se mostrara al lider-->
                  <i style="color:#fff; margin-right:5px;" class="fas fa-plane-departure"></i>
                  Nueva solicitud de vacaciones.
               </el-menu-item>
               <el-menu-item index="/vacaciones/request"><!--Elemnto para empleados-->
                  <i style="margin-right:5px;" :class="estatus==='APROBADO' ? 'far fa-check-circle' : 'far fa-times-circle' "></i>
                  Tú solicitud ha sido {{estatus}}.
               </el-menu-item>
            </el-submenu>
         </el-submenu>
         <el-tooltip class="item" effect="dark" content="Visita tú perfil." placement="top">
            <el-menu-item id="user" index="/profile">
               <img id="avatar" src="src\assets\logo.jpg" alt="Avatar"><p id="nick">{{nickName}}</p>
            </el-menu-item>
         </el-tooltip>
         <el-menu-item :index="$route.path" @click="logout">
            <i style="color:#fff;" class="fas fa-sign-out-alt fa-lg"></i>
         </el-menu-item>
   </el-menu>
</template>
<script>
   import {mapActions} from 'vuex';
   import authTypes from '@/types/auth';
   import store from '@/main';
   import globalTypes from '@/types/global';
   import io from 'socket.io-client';

   export default {
      name:'navBar',
      data(){
         return{
            estatus: 'aceptada',
            icon:'far fa-check-circle', //far fa-times-circle,
            activo: true,
            newRequest:0,
            socket:io('http://65.99.252.240:3000/')
         }
      },
      computed:{
         nickName(){
            return this.$store.state.authModule.user.nombre
         },
         rolId(){
            return this.$store.state.authModule.user.idrol_intranet
         }
      },
      methods:{
         ...mapActions({
            exit: authTypes.actions.logout
         }),
         cerrarSesion(){
            this.socket.emit("destroySesion",{username:this.$store.state.authModule.user.usuario});
         },
         logout(){
            this.$confirm('¿Deseas abandonar tu sesión?', 'Salir', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
            }).then(() => {
               this.cerrarSesion();
               this.exit();
               this.$router.push('/login');
            }).catch(() => {
                       
            });
         }
      }
   }
</script>
<style>
   #menu-header{
      float:right;
   }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
   }
   #user{
      width: 15.5em;
      display: flex;
   }
   #nick{
         width: 150;
         font-size: 1em;
      }
   #avatar{
      border-radius:50%;
      height:35px;
      width:35px;
      margin-right:10px;
      margin-top: 10px;
   }
   .avatar-item{
      width: 250px !important;
   }
   .el-switch__label--left{color: white;}
   #statusUser{
         display: initial;
      }

   /* implementación media querys
   *  Extra small devices (portrait phones, less than 576px)*/
   @media (max-width: 575.98px) { 
      #nick{
         display: none;
      }
      #user{
         width: 50px;
         padding: 0px 10px;
      }
      .el-message-box{
         width: 80%;
      }
      #statusUser{
         display: none;
      }
   }

   /*Small devices (landscape phones, 576px and up)*/
   @media (min-width: 576px) and (max-width: 767.98px) {}

   /*Medium devices (tablets, 768px and up)*/
   @media (min-width: 768px) and (max-width: 991.98px) {
      #user{
      width: 50px;
      padding: 0px 10px;
      }
   }

   /*Large devices (desktops, 992px and up)*/
   @media (min-width: 992px) and (max-width: 1199.98px) {}

   /*Extra large devices (large desktops, 1200px and up)*/
   @media (min-width: 1200px) {}
</style>

