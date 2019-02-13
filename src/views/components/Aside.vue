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
   <el-scrollbar>
      <el-row
         v-bind:style="{ 'background-image': 'url(' + imagen + ')',
         'line-height':'60px',
         'border':'1px solid',
         'background-size':'200px 150px',
         'background-repeat':'no-repeat' }">
         <el-col :span="24">
            <img src="src\assets\logo.jpg" alt="Avatar" 
            style="border-radius:50%;height:60px; margin:10px; width:60px;">
         </el-col>
         <el-col :span="24" style="color:#32468c; padding:10px;">
            <router-link id="perfil" to="/profile">
               <p id="name_user">{{nickName}}</p>
            </router-link>
            <p style="line-height: 14px;font-size: 0.7em;text-align: center;"> {{perfil}}</p>
         </el-col>
      </el-row>
      <el-menu
         :show-timeout="200"
         :default-active="$route.path"
         mode="vertical"
         router
         background-color="#273b47"
         text-color="#bfcbd9"
         active-text-color="#409EFF"
         :unique-opened = "isUniqueOpen"
         >
         <el-menu-item index="/">
            <i class="fas fa-home"></i>
            <span>Inicio</span>
         </el-menu-item>
         <el-submenu index="/vacaciones">
            <template slot="title">
               <i class="fas fa-plane-departure"></i>
               <span> Vacaciones</span> 
            </template>
            <el-menu-item-group>
               <el-menu-item index="/vacaciones/request"><i class="far fa-calendar-plus"></i>Solicitar vacaciones</el-menu-item>
               <el-menu-item index="/vacaciones/approved" v-if="rolId === 1 || rolId === 3 || rolId === 2 || rolId === 5"><i class="far fa-calendar-check"></i>Autorizar vacaciones</el-menu-item>
            </el-menu-item-group>
         </el-submenu>
         <el-submenu index="1">
            <template slot="title">
               <i class="fas fa-business-time"></i>
               <span>Incidencias</span> 
            </template>
            <el-menu-item-group>
               <el-menu-item index="/incidencias/request"><i class="far fa-edit"></i>Capturar incidencia</el-menu-item>
               <el-menu-item index="/incidencias/approved" v-if="rolId === 1 || rolId === 3 || rolId === 2 || rolId === 5"><i class="fas fa-clipboard-check"></i>Autorizar incidencia</el-menu-item>
            </el-menu-item-group>
         </el-submenu>
         <el-menu-item index="/reportes" v-if="rolId === 1 || rolId === 3 || rolId === 2 || rolId === 5">
            <i class="fas fa-chart-bar"></i>
            <span>Reportes</span>
         </el-menu-item>
      </el-menu>
   </el-scrollbar>
</template>
<script>

export default {
   name:'AsideBar',
   data(){
      return{
         isUniqueOpen: true,
         imagen:'/src/assets/1.jpg'
      };
   },
   computed:{
      nickName(){
        return this.$store.state.authModule.user.nombre
      },
      perfil(){
         return this.$store.state.authModule.user.rol_empleado
      },
      rolId(){
         return this.$store.state.authModule.user.idrol_intranet
      }
   }
}
</script>
<style scoped>
   i{margin-right: 5px;}
   .el-menu li{
      font-weight: 550;
   }
   .el-menu-item-group ul > li{
      padding-left: 30px !important;
      font-weight: 300;
   }
   #name_user{
      line-height:20px;
      font-weight:600;
      text-align:center;
      font-size: 1em;
      margin-bottom: 0.5rem;
      background: red;
      color:white;
      border-radius: 10px;
   }
   #perfil:hover{
      text-decoration: none;
   }
   #name_user:hover{
      background: #273b47;
   }

   /* implementación media querys
   *  Extra small devices (portrait phones, less than 576px)*/
   @media (max-width: 575.98px) { }

   /*Small devices (landscape phones, 576px and up)*/
   @media (min-width: 576px) and (max-width: 767.98px) {}

   /*Medium devices (tablets, 768px and up)*/
   @media (min-width: 768px) and (max-width: 991.98px) {}

   /*Large devices (desktops, 992px and up)*/
   @media (min-width: 992px) and (max-width: 1199.98px) {}

   /*Extra large devices (large desktops, 1200px and up)*/
   @media (min-width: 1200px) {}
</style>


