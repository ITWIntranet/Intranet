<template>
    <div id="principal">

        <el-carousel :interval="3000" height="45em">
           <el-carousel-item>
                <Bienvenidos/>
            </el-carousel-item>
            <el-carousel-item>
                <Birthdays/>
            </el-carousel-item>
            

        </el-carousel>

        <el-dialog title="Cambio de password" :visible.sync="changePass" 
            class="changePass" center width="30%" :before-close="handleClose"
            :show-close="showClose" :close-on-click-modal="closeOnClickModal">
            <p style="align:justify;">Por políticas de seguridad, es recomendable cambiar tu contraseña en tu primer inicio de sesión.<br>
             Lo puedes realizar en esta modal o más tarde desde el menú Perfil.</p>
            <el-form :model="UserPass" :rules="rules" ref="UserPass" :status-icon="icon_form">
                <el-form-item label="Password Actual: " prop="oldPass">
                    <el-input type="password" v-model="UserPass.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Nuevo Password: " prop="newPass">
                    <el-input type="password" v-model="UserPass.newPass" autocomplete="off" maxlength="16"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">Más tarde</el-button>
                <el-button type="primary" @click="submitChangePass('UserPass')">Cambiar</el-button>
            </span>
        </el-dialog>
    </div>
</template>

</template>
<script>
import util from 'util';
import {mapActions, mapGetters} from 'vuex';
import home from '@/types/home';
import auth from '@/types/auth';
import store from '@/main';
import Birthdays from '@/components/home/Birthdays';
import Bienvenidos from '@/components/home/Bienvenidos';
export default {
    name: 'Home',
    data(){
        var validatorOldPass = (rule, value, callback)=>{
            if(value != this.$store.state.authModule.user.pass){
               callback(new Error('La contraseña no es igual a la contraseña actual'));
            }else{
                callback();
            }   
        };
        var validatorNewPass = (rule, value, callback)=>{
            if(!/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/.test(value)){
               callback(new Error('Tú contraseña debe incluir(Mayúsculas-Minúsculas)(0-9)(caracteres especiales).'));
            }else if(value.length < 8){
                callback(new Error('La longitud mínima requerida es de 8 caracteres alfanúmericos' ) );
            }else{
                callback();
            }
        };
        return{
            UserPass:{
                oldPass:'',
                newPass:''
            },
            rules:{
                oldPass:[
                    {required: true, message: 'Favor de ingresar tu password actual', trigger: 'blur'},
                    {validator:validatorOldPass, trigger:'change'},
                    {validator:validatorOldPass, trigger:'blur'}
                ],
                newPass:[
                    {required: true, message: 'Favor de ingresar nuevo password', trigger: 'blur'},
                    {validator:validatorNewPass, trigger:'change'},
                    {validator:validatorNewPass, trigger:'blur'}
                ]
            },
            icon_form:true,
            showClose:false,
            closeOnClickModal:false
        }
    },
    mounted(){
       //Validamos que existan datos antes de solicitarlos al servidor.
        if(this.$store.state.Home.diasInhabiles.length == 0){
            this.allDiasInabiles();
        }
        if(this.$store.state.Home.diasCumpleanios.length == 0){
            this.diasCumpleanios();
        }
    },
    methods:{
        ...mapActions({
            allDiasInabiles: home.actions.fetchDias,
            diasCumpleanios: home.actions.fetchCumpleanios,
            closeModal: auth.actions.laterChangePass,
            changePassUser : auth.actions.ChangePass
        }),
        handleClose(done) {
            this.closeModal();
        },
        submitChangePass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.changePassUser({
                        eid: this.$store.state.authModule.user.empleado_id,
                        pass:this.UserPass.newPass
                    }).then(
                        response=>{
                            this.closeModal();
                            this.$message({
                                message: 'El cambio de su password se registro correctamente.',
                                type: 'success'
                            });
                        },
                        error=>{
                            this.$message({
                                message: 'Servicio no disponible, favor de intentarlo más tarde.',
                                type: 'warning'
                            });
                    });
                }
            });
        }
    },
    components:{
        Birthdays,
        Bienvenidos
    },
    computed:{
        changePass:{
            get: function(){
                return this.$store.state.authModule.user.pass_default === '0'?true:false;
            },
            set: function(){
            }
        }
    }
}
</script>
<style>
    #principal{
        width: 100%;
    }
    .changePass{
        overflow: hidden;
    }
     /* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {
  }

  /*Small devices (landscape phones, 576px and up)*/
  @media (min-width: 576px) and (max-width: 767.98px) {
  }

  /*Medium devices (tablets, 768px and up)*/

  @media (min-width: 768px) and (max-width: 991.98px) {
    
  }

  /*Large devices (desktops, 992px and up)*/
  @media (min-width: 992px) and (max-width: 1199.98px) {}

  /*Extra large devices (large desktops, 1200px and up)*/
  @media (min-width: 1200px) {

  }
</style>

