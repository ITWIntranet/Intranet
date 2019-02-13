<template>
    <div id='fondo' v-bind:style="{'background-image':'url('+imagen+')'}">
      <el-row>
        <el-col :offset="5">
          <p>Bienvenidos </p>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="10" :offset="2">
          <img id="empleado"  src="src/assets/emp.png" alt="">
        </el-col>
        <el-col :span="5" :offset="2"> 
          <img id="logo" src="/src/assets/logo.png" alt="">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" :offset="3"> 
          <img id="logo2" src="/src/assets/logo.png" alt="">
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
          imagen:'/src/assets/circuito.jpg',
          }
      },
      computed:{
       
      }
    }
  </script>
  <style>
    #fondo{
      background-position: right;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      font-family: cursive;
      font-size: 8em;
      border-radius: 25px 25px;
      color:rgb(238, 190, 87);
      text-shadow:1px 1px 1px rgba(25,25,25,1);
     }
    #logo{
      width: 3.5em;
    }
    #logo2{
        margin-top: .8em;
      }
    #empleado{
      width: 2.8em;
    }

    /* implementación media querys
    *  Extra small devices (portrait phones, less than 576px)*/
    @media (max-width: 575.98px) { 
      #fondo{
      background-repeat: no-repeat;
      font-family: cursive;
      background-size: auto;
      border-radius: 25px 25px;
      font-size: 3em;
      }
      #logo{
        width: 3em;
        display: none;
      }
      #empleado{
        width: 5.5em;
      }
      #logo2{
        margin-top: .8em;
        width: 5em;
      }
    }
    /*Small devices (landscape phones, 576px and up)*/
    @media (min-width: 576px) and (max-width: 767.98px) {
       #fondo{
      background-repeat: no-repeat;
      font-family: cursive;
      background-size: auto;
      border-radius: 25px 25px;
      font-size: 3em;
      }
      #logo{
        width: 3em;
        display: none;
      }
      #empleado{
        width: 5.5em;
      }
      #logo2{
        margin-top: .8em;
        width: 5em;
      }
    }

    /*Medium devices (tablets, 768px and up)*/
    @media (min-width: 768px) and (max-width: 991.98px) {
      #fondo{
      background-repeat: no-repeat;
      font-family: cursive;
      background-size: auto;
      border-radius: 25px 25px;
      font-size: 4em;
      }
      #logo{
        width: 3em;
        display: none;
      }
      #empleado{
        width: 4em;
      }
      #logo2{
        width: 3.5em;
      }
      .el-col-offset-2{
        margin-left: 2em;
      }
      .el-col-offset-3{
        margin-left:2.5em;
      }
    }

    /*Large devices (desktops, 992px and up)*/
    @media (min-width: 992px) and (max-width: 1199.98px) {}

    /*Extra large devices (large desktops, 1200px and up)*/
    @media (min-width: 1200px) {}
  </style>