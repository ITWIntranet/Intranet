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
  <el-container id="main-container">
    <el-header><i id="menu" style="float:left; margin:10px;color:#fff;" :class="isCollapse ?'fas fa-bars fa-2x':'fa fa-times fa-2x'" @click="iscollapseMenu"></i>
      <i id="menu2" style="float:left; margin:10px;color:#fff;" :class="isCollapse ?'fa fa-times fa-2x':'fas fa-bars fa-2x'" @click="iscollapseMenu"></i><navBar/>
    </el-header>
    <el-container>
      <el-aside :class="isCollapse ?'menuCollpase':'menuNoCollapse'"><sideBar/></el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </el-container>
</template>

<script>
import navBar from '@/views/components/Header';
import sideBar from '@/views/components/Aside';
import menu from '@/types/menu';
import { mapActions } from 'vuex';
import {store} from '@/main';

//import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    navBar,
    sideBar
  },
  computed:{
    isCollapse(){
      return this.$store.state.menu.menuCollpase
    }
  },
  methods:{
    ...mapActions({
      collapse: menu.actions.collapseMenu
    }),
    iscollapseMenu(){
      var menuIsCollapse= this.isCollapse?false:true;
      this.collapse(menuIsCollapse);
    }
  }
  //mixins: [ResizeMixin],
  /*computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }*/
}
</script>

<!--
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
-->
<style scoped>
  #main-container{height: 100%;}
  .el-header {
    line-height: 60px;
    padding: 0px;
  }
  
  .el-aside {
    background-color: #304156;
    color: #333;
    line-height: 200px;
  }
      
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-header{
    background-color: #545c64;
  }
  .menuCollpase{
    width:0px !important;
    -webkit-transition:150ms ease-out;
    -moz-transition:150ms ease-out;
    -o-transition:150ms ease-out;
    transition:150ms ease-out;
  }
  .menuNoCollapse{
    width:200px !important;
    -webkit-transition:150ms ease;
    -moz-transition:150ms ease;
    -o-transition:150ms ease;
    transition:150ms ease;
  }
  #menu2{
    display: none;
  }

  /* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) { 
    .menuCollpase{
    width:200px !important;
    -webkit-transition:150ms ease;
    -moz-transition:150ms ease;
    -o-transition:150ms ease;
    transition:150ms ease;
    }
    .menuNoCollapse{
      width:0px !important;
      -webkit-transition:150ms ease-out;
      -moz-transition:150ms ease-out;
      -o-transition:150ms ease-out;
      transition:150ms ease-out;
    }
    #menu{
      display: none;
    }
    #menu2{
      display: initial;
    }
  }

  /*Small devices (landscape phones, 576px and up)*/
  @media (min-width: 576px) and (max-width: 767.98px) {
    
  }

  /*Medium devices (tablets, 768px and up)*/
  @media (min-width: 768px) and (max-width: 991.98px) {}

  /*Large devices (desktops, 992px and up)*/
  @media (min-width: 992px) and (max-width: 1199.98px) {}

  /*Extra large devices (large desktops, 1200px and up)*/
  @media (min-width: 1200px) {}
</style>
