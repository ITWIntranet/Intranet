<template>
<div>
  <el-row>
    <el-col>
      <div class="el-row back">
        <span><a><i class="fas fa-camera fa-lg camera-user"></i></a></span>
        <span class="edit-profile" @click="dialogVisible= true"><a><i class="fas fa-user-edit fa-lg "></i> Editar perfil</a></span>
        <span class="update-pass" @click="dialogPassword= true"><a><i class="fas fa-key fa-lg "></i> Cambiar password</a></span>
        <button class="img-profile" :style="{'background-image': 'url('+foto+')'}">
          <i class="fas fa-camera camera-user-upload"></i>
        </button>
        <div class="info-user">
          <p><strong>{{datosP.nombre}}</strong><br>
            <strong style="font-size:0.7em;">{{datosP.rol}}</strong>
          </p>
        </div>
      </div>
      <el-card>
        <el-row>
          <el-col :span="8" :offset="3">
            <p id="datos-client">
              <i class="fas fa-project-diagram fa-lg info" style="color:#1054a0;"></i><strong style="color:#1054a0;"> Área:</strong> {{datosEmp.nombre_area}}<br>
              <i class="fas fa-city fa-lg info"></i><strong style="color:#1054a0;"> Cliente:</strong> {{datosEmp.cliente}}
            </p>
          </el-col>
          <el-col :span="12">
              <p>
                <i class="fas fa-medal fa-lg info"></i><strong style="color:#1054a0;"> Fecha Ingreso: </strong>{{datosP.fecha_ingreso}}<br>
                <i class="fas fa-graduation-cap fa-lg info"></i><strong style="color:#1054a0;"> Universidad: </strong>{{datosP.universidad}}
              </p>
          </el-col>
        </el-row>
      </el-card>
      <div class="el-row">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Datos Personales" name="first">
            <p class="el-icon-caret-bottom"> DATOS PERSONALES</p>
            <hr>
            <el-row>
              <el-col :span="6" :offset="1">
                <p>Nacimiento</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.fecha_nacimiento}}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="DPer" :span="6" :offset="1">
                <p>CURP</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.curp}}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="DPer" :span="6" :offset="1">
                <p>NSS</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.nss}}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="DPer" :span="6" :offset="1">
                <p>RFC</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.rfc}}</p>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Domicilio" name="second">
            <p class="el-icon-caret-bottom"> DOMICILIO</p>
            <hr>
            <el-col :span="9">
              <el-row>
                <el-col :span="4" :offset="1">
                  <p class="cabecera">Calle</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.calle}}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="DPer"  :span="4" :offset="1">
                  <p>Núm Ext.</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.num_exterior}}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="DPer"  :span="4" :offset="1">
                  <p>Núm Int.</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.num_interior}}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="DPer"  :span="6" :offset="1">
                  <p>Colonia</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.colonia}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="14">
              <el-row>
                <el-col :span="6" :offset="1">
                  <p>Delegación/<br>Municipio</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                <el-select v-model="datosP.delegacion" placeholder="datosP.delegacion" disabled>
                  <el-option
                    v-for="item in getdelegacion"
                    :key="item.delegacion_id"
                    :label="item.delegacion"
                    :value="item.delegacion_id"> 
                  </el-option>
                </el-select>
                </el-col>
                <!--el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.delegacion}}</p>
                </el-col-->
              </el-row>
              <el-row>
                <el-col class="DPer"  :span="6" :offset="1">
                  <p>CP</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.cp}}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="DPer"  :span="6" :offset="1">
                  <p>Estado</p>
                </el-col>
                <el-col class="DPer"  :span="8" :offset="1">
                  <p>{{datosP.estado}}</p>                    
                </el-col>
              </el-row>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Contacto" name="third">
            <p class="el-icon-caret-bottom"> CONTACTO</p>
            <hr>
            <el-row>
              <el-col :span="6" :offset="1">
                <p>Télefono</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.telefono}}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="DPer" :span="6" :offset="1">
                <p>Celular</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.celular}}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="DPer" :span="6" :offset="1">
                <p>Correo</p>
              </el-col>
              <el-col class="DPer" :span="10" :offset="1">
                <p>{{datosP.email_2}}</p>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>
  
  <!-- Modal para actualizar datos de empleado-->
  <el-dialog
    title="Editar Información Personal"
    :visible.sync="dialogVisible"
    width="60%" center>
    <el-form  :model="datosP" status-icon :rules="rulesProfile" ref="datosP" id="formEdit" :label-position="labelPosition" label-width="100px">
      <el-form-item label="Nombre: ">
        <h5>{{datosP.nombre}}</h5>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="Calle:" prop="calle">
            <el-input v-model="datosP.calle" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="Núm Ext.:" prop="num_exterior">
            <el-input v-model="datosP.num_exterior" maxlength="7"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="Núm Int.:" prop="num_interior">
            <el-input v-model="datosP.num_interior" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="Delegación/Municipio:" prop="delegacion">
            <el-select ref="seleccionado" v-model="datosP.delegacion">
              <el-option
                v-for="item in getdelegacion"
                :key="item.delegacion_id"
                :label="item.delegacion"
                :value="item.delegacion_id"> 
              </el-option>
             </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="0">
          <el-form-item label="Colonia:" prop="colonia">
            <el-input v-model="datosP.colonia" maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="Codigo Postal:" prop="cp">
            <el-input v-model="datosP.cp" maxlength="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item label="Télefono:" prop="telefono">
            <el-input v-model="datosP.telefono" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="Celular:" prop="celular">
            <el-input v-model="datosP.celular" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="Correo Eléctronico:" prop="email_2">
            <el-input v-model="datosP.email_2" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--el-row>
        <el-col :span="23" :offset="0">
          <br>
          <p style="text-align: right; margin: auto"><el-button style="float:center;" type="warning" icon="el-icon-warning" @click="submitFormProfile('datosP')" round>Actualizar Perfil</el-button></p>
        </el-col>
      </el-row-->
    </el-form>
    <span slot="footer">
      <p style="text-align: right; margin: auto"><el-button style="float:center;" type="warning" icon="el-icon-warning" @click="submitFormProfile('datosP')" round>Actualizar Perfil</el-button></p>
    </span>
  </el-dialog>
  <!-- Modal para actualizar password -->
  <el-dialog
    title="Cambiar Contraseña"
    :visible.sync="dialogPassword"
    width="60%" center>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="formPassword" :label-position="labelPosition" label-width="100px" autofocus>
      <el-row> 
        <el-col :span="7">
          <el-form-item label="Contraseña Actual:" prop="PasswordAct">
            <el-input  id="Password" type="password" v-model="ruleForm.PasswordAct" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="Nueva Contraseña:" prop="newPassword1">
            <el-input id="newPassword"  type="password" v-model="ruleForm.newPassword1" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="Confirmar Contraseña:" prop="newPassword2">
            <el-input id="confirmNewPassword" type="password" v-model="ruleForm.newPassword2" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <p style="text-align: right; margin: auto"><el-button style="float:center;" type="warning" icon="el-icon-warning" @click="submitForm('ruleForm')" round>Cambiar contraseña</el-button></p>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import profile from '@/types/profile';
import store from '@/main';
  export default {
    name: 'profile',
    data () {
      var ValidatePassword = (rule, value, callback) => {
        if (value !== this.$store.state.authModule.user.pass) {
          callback(new Error('Contraseña incorecta'));
        }
          callback();
      };
      var ValidatePassword1 = (rule, value, callback) => {
        if (value === this.$store.state.authModule.user.pass) {
          callback(new Error('La contraseña no puede ser la misma que la actual'));
        }
          callback();
      };
      var ValidatePassword2 = (rule, value, callback) => {
        if (value.length !== this.ruleForm.newPassword1.length) {
          callback(new Error('Contraseña Incorrecta'));
        }
        if (value !== this.ruleForm.newPassword1) {
          callback(new Error('Contraseña incorecta'));
        }
        if (value === this.$store.state.authModule.user.pass) {
          callback(new Error('La contraseña no puede ser la misma que la actual'));
        }
          callback();
      };
      var ValidateNA = (rule, value, callback) => {
        if (value !== 'N/A') {
          callback(new Error('Si no hay datos establecer como N/A'));
        }
          callback();
      };
      return {
        labelPosition: 'top',
         user_profile:'/src/assets/photo1.jpg',
         fondo:'/src/assets/fondo-credencial.jpg',
         activeName: 'first',
         labelPosition: 'top',
         dialogVisible:false,
         dialogPassword:false,
         ruleForm: {
          PasswordAct: '',
          newPassword1: '',
          newPassword2: '',
         },
         rules: {
           PasswordAct: [
            {required: true, message: 'Favor de ingresar su contraseña', trigger: 'change' },
            {min: 5, message: 'Su pasword no cumple con la longitud mínima', trigger: 'change' },
            {validator: ValidatePassword, trigger: 'change'}
           ],
           newPassword1: [
            {required: true, pattern: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/, message: 'Favor de ingresar la nueva contraseña longitud 8-16 caracteres, por lo menos: 1 Mayúscula, 1 Minúscula, 1 caracter no alfanumérico', trigger: 'change' },
            {validator: ValidatePassword1, trigger: 'change'},
           ],
           newPassword2: [
            {required: true, pattern: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/, message: 'Favor de confirmar su contraseña', trigger: 'change' },
            {validator: ValidatePassword2, trigger: 'change'},
           ],
         },
         rulesProfile: {
           calle: [
            {required: true, message: 'Favor de ingresar el nombre de la calle', trigger: 'change' },
           ],
           num_exterior: [
           {required: true, pattern: /[0-9]{1,5}|[0-9]{1,5}-[A-z]{1,5}/,message: 'Favor de ingresar el número exterior Ejemplo: 172, 172-A', trigger: 'blur' },
           ],
           num_interior: [
            {required: true, message: 'Favor de ingresar el número interior, sino existe ingresar N/A', trigger: 'change' },
           ],
           delegacion: [
            {required: true, message: 'Favor de ingresar la delegación/municipio'},
            /*{min: 1, message: 'Favor de ingresar el código postal', trigger: 'change' },*/
           ],
           colonia: [
            {required: true, message: 'Favor de ingresar la colonia', trigger: 'change' },
           ],
           cp: [
            {required: true, pattern: /[0-9]{5}/, message: 'Favor de ingresar el código postal'},
           ],
           telefono: [
            {required: true, pattern: /[0-9]{8,10}/, message: 'Favor de ingresar teléfono', trigger: 'change' },
           //{type: 'number', message: 'El teléfono debe ser solo números', trigger: "blur"},
            //{validator: ValidateNA, trigger: 'change'},
            //{max: 10, message: 'Favor de ingresar el código postal', trigger: 'change' }
           ],
           celular: [
            {required: true, pattern: /[0-9]{8,10}/, message: 'Favor de ingresar teléfono, si no existe ingresar N/A', trigger: 'change' },
            //{type: 'number', message: 'El teléfono celular debe ser solo números', trigger: "blur"},
            //{validator: ValidateNA, trigger: 'change'},
            //{max: 10, message: 'Favor de ingresar el código postal', trigger: 'change' }
           ],
           email_2: [
            {required: true, message: 'Favor de ingresar teléfono, si no existe ingresar N/A', trigger: 'change' },
            { type: 'email', message: 'ingresa una dirección de correo electronica válida', trigger: ['blur', 'change'] }
            //{type: 'email', message: 'Ingresar una dirección de correo electrónico', trigger: "blur"},
           ],
         },
      }
    },
    computed:{
        ...mapGetters({
                datosP: profile.getters.datosPersonales,
                datosEmp:profile.getters.datosEmpleado,
                getdelegacion:profile.getters.delegaciones,
            }),
        selectValue:{
          get: function(){
            return this.$store.state.Profile.datosP.delegacion;
          },
          set: function(){
          }
        },
        foto(){
          var fotoDefault = '/src/assets/boy.png';//this.$store.state.Profile.datosP.genero === '' ? '' : '';
          var foto = this.$store.state.Profile.datosP.foto;
          return foto == 'default.png' ? fotoDefault:foto;
        }
      },
      
    methods:{
      ...mapActions({
        datosPersonales:profile.actions.fetchDatosP,
        datosEmpleado:profile.actions.fetchDatosEmp,
        delegaciones:profile.actions.fetchDelegaciones,
        PasswordUp: profile.actions.PassUp,
        ProfileUp: profile.actions.ProfUp
      }),
      handleClick(tab, event) {
        console.log(tab, event);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.PasswordUp({
                eid: this.$store.state.authModule.user.empleado_id,
                pass: this.ruleForm.newPassword1
            })
            .then(
              response=>{
                this.dialogPassword= false;
                this.$message({
                  message: 'Cambio de contraseña correcto',
                  type: 'success'
                });
                this.$store.state.authModule.user.pass = this.ruleForm.newPassword1;
                this.ruleForm.PasswordAct = '';
                this.ruleForm.newPassword1 = '';
                this.ruleForm.newPassword2 = '';
                this.$refs[formName].resetFields();
              },
              error=>{
                /*console.log(error.data);
                                console.log(error.status);
                                console.log(error.statusText);
                                console.log(error.headers);
                                console.log(error.config);*/
                this.$message({
                  message: 'Servicio no disponible, favor de intentarlo más tarde.',
                  type: 'warning'
                });
              });
          } 
        });
      },
      submitFormProfile(formNameP) {
        this.$refs[formNameP].validate((valid) => {
          if (valid) {
            this.ProfileUp({
                calle:  this.datosP.calle,
                celular: this.datosP.celular,
                colonia: this.datosP.colonia,
                correo:  this.datosP.email_2,
                cp: this.datosP.cp,
                delegacion: this.datosP.delegacion != '/[0-9]{1,5}/' ? this.datosP.delegacion_id : this.datosP.delegacion,//this.$store.state.Profile.datosP.delegacion,//this.datosP.delegacion,//this.datosP.cp == '07820' ? '30' :'26',//this.selectValue,
                eid: this.$store.state.authModule.user.empleado_id,
                numext: this.datosP.num_exterior,
                numint: this.datosP.num_interior,
                telefono: this.datosP.telefono
            })
            .then(
              response=>{
                this.dialogVisible= false;
                this.$message({
                  message: 'Perfil Actualizado',
                  type: 'success'
                });
                //this.$store.state.authModule.user.pass = this.ruleForm.newPassword1;
                //this.ruleForm.PasswordAct = '';
                //this.ruleForm.newPassword1 = '';
                //this.ruleForm.newPassword2 = '';
                //this.$refs[formName].resetFields();
                console.log();
                console.log(error.data);
                                console.log(error.status);
                                console.log(error.statusText);
                                console.log(error.headers);
                                console.log(error.config);
              },
              error=>{
                this.$message({
                  message: 'Servicio no disponible, favor de intentarlo más tarde.',
                  type: 'warning'
                });
                console.log(error.data);
                                console.log(error.status);
                                console.log(error.statusText);
                                console.log(error.headers);
                                console.log(error.config);
                                console.log();
              });
          } 
        });
      },
    },
    mounted(){
       //Validamos que existan datos antes de solicitarlos al servidor.
       
        if(this.$store.state.Profile.datosP.length == 0){
          var id = this.$store.state.authModule.user.empleado_id;
            this.datosPersonales(id);
        }

        if(this.$store.state.Profile.datosEmp.length == 0){
          var id = this.$store.state.authModule.user.empleado_id;
            this.datosEmpleado(id);
        }
        if(this.$store.state.Profile.delegaciones.length == 0){
            this.delegaciones();
        }
    }
  }
</script>
<style>
  .ver{
    border: 2px solid rgb(240, 64, 21);
  }
  .camera-user{
    color:rgba(240, 235, 234, 0.5);
    cursor:pointer;
    margin: 10px;
  }
  .camera-user-upload{
    color:rgba(240, 235, 234, 0.5);
    cursor:pointer;
    position: relative;
    right:20px;
    bottom:40px;
  }
  .edit-profile{
    color:#EEE;
    background:rgba(210, 214, 210, 0.5);
    position: relative;
    left: 68%;
    top: 80%;
    cursor: pointer;
    width: 200px;
    height: 250px;
  }
  .update-pass{
    color:#EEE;
    background:rgba(210, 214, 210, 0.5);
    position: relative;
    left: 69%;
    top: 80%;
    cursor: pointer;
    width: 200px;
    height: 250px;
  }
  .img-profile{
    border-radius: 50%;
    width: 120px;
    height: 120px;
    position: absolute;
    left:40px;
    top: 130px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 150px;
    box-shadow: 0px 0px 0px 2px #fff inset;
    z-index: 400;
  }
  .back{
    background-image: url('/src/assets/perfil-back.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 10% 30%;
    height:200px;
    z-index:100;
  }
  .info-user{
    position: relative;
    line-height: 0.5cm;
    top: 120px;
    left:180px;
    color: snow;
    width: 300px;
  }
  .el-card__body{
    padding: 0%;
  }
  #formEdit .el-form-item{
    margin-bottom: 2px !important;
  }
  .info{
    margin: 10px;
    color:#1054a0;
  }
  #datos-client{
    line-height: 0.5cm;
    margin-left: 7%;
  }
  #rol{
    text-align: center;
    font-family: Georgia, serif;
    font-size: 20px;
    letter-spacing: 0.2px;
    word-spacing: 2px;
    font-weight: 700;
    font-style: oblique;
    font-variant: small-caps;
    border-radius: 25px 25px;
    background-color:transparent;
    border: 1px solid black;
    margin-top: 1.5em;
  }
  #Nombre{
    font-family: Tahoma, Geneva, sans-serif;
    font-size: 34px;
    font-weight: 700;
    text-transform: capitalize;
    border-radius: 25px 25px;
    background-color: rgba(242, 242, 242, 0.82);
  }  
  #contenedor{
    margin-top: 1em;
    height: 100%;
    width: 100%;
    border-radius: 15px 15px;
    background-color: rgb(194, 202, 202);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  #foto{
    border-radius: 50%;
    height: 15em;
    width: 15em;
  }
  .datosPer{
    border-radius: 25px 25px;
    background-color: rgba(242, 242, 242, 0.82);
  }
  .imagen{
    position:absolute;
    top:0px;
    width: 15em;
    float: left;
  }
  
  #formEdit{
    border-radius: 25px 25px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 34px;
    font-weight: 700;
    font-weight: bold;
  }

  .formPassword{
    border-radius: 25px 25px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 34px;
    font-weight: 700;
    font-weight: bold;
  }

/* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {
    #Nombre{
      font-family: Tahoma, Geneva, sans-serif;
      font-size: 20px;
      font-weight: 700;
      text-transform: capitalize;
      border-radius: 25px 25px;
      background-color: rgba(242, 242, 242, 0.82);
    }
    #foto{
      border-radius: 50%;
      height: 10em;
      width: 10em;
    }
    .el-col-10{
      width: 35%;
    }
    .el-col-offset-1 {
      margin-left: 0%;
    }
    .DPer{
      width: 30% !important;
      font-size: 14px;
    }
    .datosPer{
      width: 100%;
    }
    .lider{
      width: 50%;
    }
  }

  /*Small devices (landscape phones, 576px and up)*/
  @media (min-width: 576px) and (max-width: 767.98px) {}

  /*Medium devices (tablets, 768px and up)*/
  @media (min-width: 768px) and (max-width: 991.98px) {}

  /*Large devices (desktops, 992px and up)*/
  @media (min-width: 992px) and (max-width: 1199.98px) {}

  /*Extra large devices (large desktops, 1200px and up)*/
  @media (min-width: 1200px) {}
</style>

