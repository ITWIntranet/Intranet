<template>
    <div id='fondo1' v-bind:style="{'background-image':'url('+imagen+')'}">
      <el-row>
        <el-col id="felicitacion" :offset="5">
          <p>Festejados {{Month}}  </p>
        </el-col>
        
      </el-row>
      <el-row  :gutter="50">
        <el-col id="payaso" :span="6" :offset="1" >
          <img  src="/src/assets/payaso.gif" style="width:5em" alt="">
        </el-col>
        <el-col id="cumple" :span="10" :offset="2">
        <el-scrollbar  >
          <ul style="padding:10px">
            <li v-for="Cumpleanio in Cumpleanios" :key="Cumpleanio.nombre">{{Cumpleanio.fechanac}} - {{Cumpleanio.nombre}}  </li>
          </ul>
        </el-scrollbar>
        </el-col>
      </el-row>
      
      
    </div>
  </template>

  <script>

  import {mapGetters} from 'vuex';
  import homeTypes from '@/types/home';
    export default {
      data() {
        return {
          imagen:'/src/assets/birthday.png',
          mounths:[
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
            ]
        }
      },
      computed:{
        Month(){
          var fecha = new Date();
          return this.mounths[fecha.getMonth()]
        },
        ...mapGetters({
                Cumpleanios: homeTypes.getters.diasCumpleanios
            })
      }
    }
  </script>
  <style>
    #fondo1{
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      font-family: cursive;
      font-size: 5em;
      border-radius: 25px 25px;
      color:rgb(238, 190, 87);
      text-shadow:1px 1px 1px rgba(25,25,25,1);
    }

    #cumple{
      text-shadow:1px 1px 1px rgba(25,25,25,1);
      font-weight:normal;
      color:#DD77E0;
      border: 14px dotted #FF42C6;
      letter-spacing:2pt;
      font-size:20px;
      font-family:comic sans, comic sans ms, cursive, verdana, arial, sans-serif;
    }
    
    li{
      list-style-type:none;
      margin: 0;
      padding: 0;
    }
    #bithdayTable{
      font-size: 20px;
      background: transparent  !important;
    }

     /* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {
    #fondo1{
      background-position: center;
      font-size: 3.5em;
    }
    .el-col-offset-5 {
      margin-left: 5%;
    }
    #payaso{
      display: none;
    }
    .el-col-10 {
    width: 80%;
    }
    #cumple{
      font-size: 15px;
    }
  }

  /*Small devices (landscape phones, 576px and up)*/
  @media (min-width: 576px) and (max-width: 767.98px) {
  }

  /*Medium devices (tablets, 768px and up)*/

  @media (min-width: 768px) and (max-width: 991.98px) {
    #fondo1{
      background-position: center;
      font-size: 3.5em;
    }
    .el-col-offset-5 {
      margin-left: 10%;
    }
    #payaso{
      display: none;
    }
    .el-col-10 {
    width: 80%;
    }
    #cumple{
      font-size: 15px;
    }
    #cumple{
      width: 90% ;
    }
  }

  /*Large devices (desktops, 992px and up)*/
  @media (min-width: 992px) and (max-width: 1199.98px) {}

  /*Extra large devices (large desktops, 1200px and up)*/
  @media (min-width: 1200px) {

  }
  </style>