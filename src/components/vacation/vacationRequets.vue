<template>
    <section id="vacationRequest">
        <el-row>
            <el-col :span="24"><h5>Módulo de Vacaciones</h5></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><h6>Historial de Vacaciones</h6></el-col>
        </el-row>
        <el-row :gutter="10" id="detailVacation">
            <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="Días disponibles para solicitar vacaciones." placement="top-end">
                    <p><strong>Días disponibles: </strong>{{detailDia.diasDisponibles}}</p>
                </el-tooltip>
            </el-col>
            <el-col :span="7" v-if="detailDia.diasAdicional>0">
                <el-tooltip class="item" effect="dark" :content="msg_negociados" placement="top-end">
                    <p>
                        <strong>Días negociados: </strong>
                        <strong>{{detailDia.diasAdicional}}</strong>
                        <el-tag color="white" size="mini">Vigencia: {{detailDia.fechaExpDiaAdicional}}</el-tag>
                    </p>
                </el-tooltip>
            </el-col>
            <el-col :span="7" v-if="detailDia.diasAVencer>0">
                <el-tooltip class="item" effect="dark" :content="msg_xvencer" placement="top-start">
                    <p>
                        <strong>Días a vencer:</strong>
                        <strong>{{detailDia.diasAVencer}}</strong>
                        <el-tag color="white" size="mini">Vigencia: {{detailDia.fechaExpDias}}</el-tag>
                    </p>
                </el-tooltip>
            </el-col>
            <el-col :span="4">
                <el-tooltip class="item" effect="dark" :content="msg_total" placement="top-start">
                    <p>
                        <strong>Total días:</strong>
                        <strong>{{total}}</strong>
                    </p>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="historialVacaciones" height="300" style="width: 100%">
                    <el-table-column type="index" label="N°" prop="vacaciones_id" width="50">
                    </el-table-column>
                    <el-table-column prop="fecha_solicitud" label="Fecha Solicitud" width="190">
                    </el-table-column>
                    <el-table-column prop="total_dias" label="Total días" width="180">
                    </el-table-column>
                    <el-table-column prop="fecha_inicial" label="Fecha Inicio" width="180">
                    </el-table-column>
                    <el-table-column prop="fecha_final" label="Fecha Fin" width="180">
                    </el-table-column>
                    <el-table-column prop="estatus1" label="Estatus" width="180">
                        <template slot-scope="scope">
                            <el-tag
                            :type="scope.row.estatus1 === 'APROBADO' ? 'success' : scope.row.estatus1 === 'PENDIENTE' ? 'warning' : 'danger'"
                            disable-transitions>{{scope.row.estatus1}}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" style="float:right;    margin-top: 10px;">
                <el-tooltip class="item" effect="dark" content="Genera una nueva solicitud." placement="top">
                     <el-button type="primary" circle @click="dialogVisible= true"><i class="fas fa-plus"></i></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <!-- Modal Dialog para capturar solicitudes de vacaciones-->
        <el-dialog id="modal"
            title="Capturar vacaciones"
            :visible.sync="dialogVisible"
            :show-close="showClose"
            width="35%"
            :fullscreen="size_window"
            :before-close="handleClose" center>
            <!-- Formulario de captura -->
           <el-form ref="newVacation" :model="newVacation" 
              :rules="rules_vacation" label-position="left" :status-icon="icon_form">
              <el-form-item>
                  <el-row :gutter="2">
                    <el-col :span="10">
                        <p><strong>Días solicitados: </strong>{{detailDias.diasASolicitar}}</p>
                    </el-col>
                    <el-col :span="14">
                        <p><strong>Fecha regreso: </strong>{{detailDias.fechaRegreso}}</p>
                    </el-col>
                  </el-row>
              </el-form-item>
              <el-form-item label="Fechas:" prop="fechas">
                <el-date-picker id="fechas"
                    v-model="newVacation.fechas"
                    type="daterange"
                    range-separator="Al"
                    start-placeholder="Fecha Inicio"
                    end-placeholder="Fecha Fin"
                    format="dd/MM/yyyy"
                    value-format="yyyy/MM/dd"
                    ref="rangeDate"
                    :picker-options="validateDate"
                    v-on:change="calcDatesAndReturn('rangeDate')"></el-date-picker>
              </el-form-item>
              <el-form-item label="Doc. Soporte">
                <el-upload id="cargar"
                    class="upload-demo"
                    drag
                    ref="upload"
                    action="http://65.99.252.240:3000/file_atachment/"
                    :auto-upload="false"
                    :name="file_ref"
                    :file-list="detailDias.files"
                    :limit="1"
                    accept=".doc,.docx,.png,.pdf,.jpg,.jpeg"
                    list-type="picture">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
                    <div slot="tip" class="el-upload__tip">Solo archivos con un tamaño menor de 500kb</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newVacation')">Cancelar</el-button>
                <el-button type="primary" @click="submitForm('newVacation')">Solicitar</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import vacationTypes from '@/types/vacation';
    import store from '@/main';
    import Vue from 'vue';
    import io from 'socket.io-client';//Libreria necesaria para notificaciones real-time
    import axios from 'axios';

    export default {
        name: 'vacationRequest',
        data(){
            var hollyDay = (rule, value, callback)=>{
                var dates = new Date(value[0]);
                if (this.dayHolliday(dates)) {
                    callback(new Error('Favor de seleccionar un fecha habil.'));
                }else{
                    callback();
                }       
            };
            return{
                showClose:false,
                validateDate:{
                    disabledDate(time) {
                        return time.getDay() ===  6 || time.getDay() === 0 || time.getTime() <= Date.now();
                    }
                },
                detailDias:{
                    fechaRegreso:'',
                    diasASolicitar:0,
                    fechaI:'',
                    fechaF:'',
                    files:[]
                },
                dialogVisible:false,
                msg_negociados: 'Días reincorporados por tu líder, para ser efectivos antes de la vigencia.',
                msg_xvencer:'Días que no has utilizado y pueden perderse de no ser efectivos antes de la vigencia.',
                msg_total:'Número total de días que puedes hacer efectivos para solictar vacaciones.',
                rules_vacation:{
                    fechas:[
                        { required: true, message: 'Favor de capturar las fechas de sus vacaciones', trigger: 'blur' },
                        {validator:hollyDay, trigger:'change'}
                    ]
                },
                icon_form:true,
                file:[],
                newVacation:{
                    file:[],
                    fechas:[]
                },                
            }
        },
        methods:{
            ...mapActions({
                allVacations: vacationTypes.actions.fetchVacations,
                registrerVacations: vacationTypes.actions.registrarVacaciones,
                addSolicitud: vacationTypes.actions.addNewRequest,
                diasVacaciones: vacationTypes.actions.fetchDiasVacaciones,
                updateDaysOfVacation : vacationTypes.actions.updateDays,
                DatosCorreo:vacationTypes.actions.DatosCorreo
            }),
            handleClose(done) {
                this.$confirm('¿Deseas cancelar tu solicitud?')
                .then(_ => {
                    done(this.newVacation.fechas = null,this.detailDias.diasASolicitar=0,this.detailDias.fechaRegreso='',this.dialogVisible = false,this.detailDias.files = []);
                    this.$refs[newVacation].resetFields();
                    this.detailDias.diasASolicitar=0;
                    this.detailDias.fechaRegreso='';
                    this.dialogVisible = false;
                    this.detailDias.files = [];
                })
                .catch(_ => {});
            },
            calcDatesAndReturn(){
                var dias = this.diffDate(this.newVacation.fechas[0], this.newVacation.fechas[1] );
                var diasSolicitados = 0;
                //Calculamos de diferencia entre dos fechas
                var i;
                var day = new Date(this.newVacation.fechas[0]);
                if(dias > 1){ //Para validar más de una solicitud
                    for(i=0; i< dias; i++ ){
                        var y = new Date(this.newVacation.fechas[0]);
                        y.setDate(y.getDate()+i);
                        var r = this.dayHolliday(y);
                        r ? diasSolicitados : diasSolicitados++;
                    }
                }else{ //Para validar la solicitud de un solo día
                    this.dayHolliday(day) ? diasSolicitados : diasSolicitados++ ;
                }
                this.detailDias.diasASolicitar = diasSolicitados;
                // .Calculo de fechas
                
                //Calculo de fecha de regreso a labores
                var diaHabil = true;
                var nDias = 1;
                var dayR = new Date(this.newVacation.fechas[1]);
                while(diaHabil){
                    dayR.setDate(dayR.getDate()+ nDias);//Fecha inicio + dif entre las dos fechas ingresadas
                    var r = this.dayHolliday(dayR); //Evaluamos que la fecha devuelta sea habil
                    r ? nDias++ :diaHabil=false;
                    this.detailDias.fechaRegreso = dayR.getDate() + "/" + (dayR.getMonth()+1) +"/"+dayR.getFullYear();
                }
                //. Calculo de fecga regreso
                //Guardamos las fechas Inicio y fin dentro de las propiedades del modelo a enviar a la BD
                var fechaIni = this.newVacation.fechas[0].split('/');
                var fechaFin = this.newVacation.fechas[1].split('/');
                this.detailDias.fechaF = fechaFin[2]+"/"+fechaFin[1]+"/"+fechaFin[0];
                this.detailDias.fechaI = fechaIni[2]+"/"+fechaIni[1]+"/"+fechaIni[0];
            },
            diffDate:function(fechaI, fechaF){ //Obtenemos la diferencia de dias entre dos fechas
                var dias = 0;
                var fechaIni = new Date(fechaI);
                var fechaFin = new Date(fechaF);
                if(fechaIni.getTime() === fechaFin.getTime()){ //para casos donde se solicita un día
                    dias = 1;
                }else{ //Casos donde es mas de un día
                    //para considerar la fecha fin dentro del intervalo aumentamos
                    //un día a la fecha fin.
                    fechaFin.setDate(fechaFin.getDate()+1);
                    var dif = fechaFin.getTime() - fechaIni.getTime();//Obtenemos la diferencia
                    dias = Math.round(dif / (1000 * 60 * 60 * 24));//Convertimos de milisegundos a días.
                }
                return dias;
            },
            dayHolliday:function(days){ //Evaluamos si una fecha es Festivo o inhabil
                var result = false;
                if(days.getDay()=== 0 || days.getDay() === 6 ){
                    result =  true;
                }else{
                    //True si el dia es festivo o inhabil - False dia habil
                    var diasInhabiles =this.$store.state.Home.diasInhabiles;
                    var i;
                    for(i=0; i< diasInhabiles.length; i++){
                        var day =  new Date(diasInhabiles[i]['fecha'])
                        if(days.getTime() === day.getTime()){
                            result = true;
                            break;
                        }else{ 
                            result = false;
                        }
                    }
                }
                return result;
            },
            restarDias(nDias){
                var fechaDiasAdicionales;
                var fechaDiasxVencer;
                var difDiasAdic=0;
                var difDiasxVenc=0;
                var hoy = new Date();
                var dateAdi = '';
                var dateExp =  '';

                //Evaluamos que exista una fecha en "Dias adicionales" y "Dias x vencer"
                typeof this.detailDia.fechaExpDiaAdicional === 'string' ? dateAdi = this.detailDia.fechaExpDiaAdicional.split('/'): dateAdi= [] ;
                typeof this.detailDia.fechaExpDias === 'string' ? dateExp = this.detailDia.fechaExpDias.split('/') : dateExp = [];
                
                //Evaluamos que exista una fecha en "Dias adicionales" y "Dias x vencer"
                //y convertimos el string a Date para guardar en las variables "fechaDiasAdicionales" y "fechaDiasxVencer"
                typeof this.detailDia.fechaExpDiaAdicional === 'string' ? fechaDiasAdicionales = new Date(dateAdi[2]+'/'+dateAdi[1]+'/'+dateAdi[0]) : fechaDiasAdicionales = '';
                typeof this.detailDia.fechaExpDias === 'string' ? fechaDiasxVencer = new Date(dateExp[2]+'/'+dateExp[1]+'/'+dateExp[0]) : fechaDiasxVencer= ''; 

                //Evaluamos la diferencia de ambas fechas respecto al dia de Hoy
                typeof fechaDiasAdicionales === 'object' ? difDiasAdic = fechaDiasAdicionales.getTime() - hoy.getTime() : difDiasAdic = 0;
                typeof fechaDiasxVencer === 'object' ? difDiasxVenc = fechaDiasxVencer.getTime() - hoy.getTime() : difDiasxVenc = 0;
                //evaluar en cual de los dos hay menos diferencia de dias para ser al primero que le restaremos los dias
                while (nDias > 0) {
                    if(difDiasxVenc > difDiasAdic && this.detailDia.diasAdicional > 0 ){ 
                        //Cuando la fecha de "Dias Adicionales" esta proxima vencer
                        var diasRestados = 0;
                        for (let index = 1; index <= this.detailDia.diasAdicional; index++) {
                            //Aumentamos nuestro contador de los dias a restar a dias Adicionales
                            diasRestados = index; 
                            //Restamos 1 al NDias solicitados
                            nDias = nDias -1;
                            if(nDias === 0){break;}
                        }
                        this.detailDia.diasAdicional = this.detailDia.diasAdicional - diasRestados;
                        this.detailDia.diasAdicional === 0 ? this.detailDia.fechaExpDiaAdicional = '':'';
                        //los igualamos a 0 'difDiasxVenc' para que entre en el siguiente bloque IF y continue restando dias
                        this.detailDia.diasAdicional === 0 ? difDiasxVenc = 0 :''; 
                    }else if(difDiasAdic > difDiasxVenc && this.detailDia.diasAVencer > 0 ){
                        //Cuando la fecha de "Dias x Vencer" esta proxima vencer
                        var diasRestados = 0;
                        for (let index = 1; index <= this.detailDia.diasAVencer; index++) {
                            //Aumentamos nuestro contador de los dias a restar a dias Adicionales
                            diasRestados = index; 
                            //Restamos 1 al NDias solicitados
                            nDias = nDias -1;
                            if(nDias === 0){break;}
                        }
                        this.detailDia.diasAVencer = this.detailDia.diasAVencer - diasRestados;
                        this.detailDia.diasAVencer === 0 ? this.detailDia.fechaExpDias = '':'';
                        //los igualamos a 0 'difDiasAdic' para que entre en el siguiente bloque IF y continue restando dias
                        this.detailDia.diasAVencer === 0 ? difDiasAdic = 0 :''; 
                    }else if(difDiasAdic == difDiasxVenc && this.detailDia.diasAdicional > 0 ){
                        //cuando las fechas son iguales, restará primero a dias adicionales
                        var diasRestados = 0;
                        for (let index = 1; index <= this.detailDia.diasAdicional; index++) {
                            //Aumentamos nuestro contador de los dias a restar a dias Adicionales
                            diasRestados = index;
                            //Restamos 1 al NDias solicitados
                            nDias = nDias -1;
                            if(nDias === 0){break;}
                        }
                        this.detailDia.diasAdicional = this.detailDia.diasAdicional - diasRestados;
                        this.detailDia.diasAdicional === 0 ? this.detailDia.fechaExpDiaAdicional = '':'';
                        //los igualamos a 0 'difDiasxVenc' para que entre en el siguiente bloque IF y continue restando dias
                        this.detailDia.diasAdicional === 0 ? difDiasxVenc = 0 :'';
                    }else if(difDiasxVenc > difDiasAdic && this.detailDia.diasAdicional === 0 ){
                        //Cuando la fecha de "Dias adicionales esta en 0" se resta a Días x vencer
                        var diasRestados = 0;
                        for (let index = 1; index <= this.detailDia.diasAVencer; index++) {
                            //Aumentamos nuestro contador de los dias a restar a dias Adicionales
                            diasRestados = index; 
                            //Restamos 1 al NDias solicitados
                            nDias = nDias -1;
                            if(nDias === 0){break;}
                        }
                        this.detailDia.diasAVencer = this.detailDia.diasAVencer - diasRestados;
                        this.detailDia.diasAVencer === 0 ? this.detailDia.fechaExpDias = '':'';
                        //los igualamos a 0 'difDiasAdic' para que entre en el siguiente bloque IF y continue restando dias
                        this.detailDia.diasAVencer === 0 ? difDiasAdic = 0 :''; 
                    }else if(difDiasAdic > difDiasxVenc && this.detailDias.difDiasxVenc === 0 ){
                        //Cuando la fecha de "Dias x vencer esta en 0" se resta a Días Adicionales
                        var diasRestados = 0;
                        for (let index = 1; index <= this.detailDia.diasAdicional; index++) {
                            //Aumentamos nuestro contador de los dias a restar a dias Adicionales
                            diasRestados = index; 
                            //Restamos 1 al NDias solicitados
                            nDias = nDias -1;
                            if(nDias === 0){break;}
                        }
                        this.detailDia.diasAdicional = this.detailDia.diasAdicional - diasRestados;
                        this.detailDia.diasAdicional === 0 ? this.detailDia.fechaExpDiaAdicional = '':'';
                        //los igualamos a 0 'difDiasxVenc' para que entre en el siguiente bloque IF y continue restando dias
                        this.detailDia.diasAdicional === 0 ? difDiasxVenc = 0 :'';
                    }else{
                        this.detailDia.diasDisponibles = this.detailDia.diasDisponibles - nDias;
                        nDias = 0;
                    }
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.detailDias.diasASolicitar=0;
                this.detailDias.fechaRegreso='';
                this.dialogVisible = false;
                this.detailDias.files = [];
            },
            submitUpload(){
                this.$refs.upload.submit();
            },
            /** Metodo al realizar click en el boton Solicitar
             * el cual ejecuta las validaciones del formulario.
             * 
             * Ademas valida si estamos pidiendo mas dias de los disponibles.
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.detailDias.diasASolicitar > (this.total) ){
                            this.$confirm('¿Deseas solicitar más días de los disponibles?   NOTA:Tú solicitud estara sujeta a consideraciones adicionales para su aprobación.', 'Warning', {
                                confirmButtonText: 'Aceptar',
                                cancelButtonText: 'Cancelar',
                                type: 'warning'
                            }).then(() => {
                                this.registrarSolicitud();
                                    this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                        emailType:2,
                                        userData:{
                                            name:this.$store.state.authModule.user.nombre,
                                            dias:this.detailDias.diasASolicitar,
                                            fecha_ini: this.detailDias.fechaI,
                                            fecha_fina: this.detailDias.fechaF,
                                            fecha_regreso:this.detailDias.fechaRegreso,
                                        },
                                        Mailto:this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                                    }).then(response=>{},error=>{});
                                    this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                        emailType:3,
                                        userData:{
                                            name:this.$store.state.authModule.user.nombre,
                                            dias:this.detailDias.diasASolicitar,
                                            fecha_ini: this.detailDias.fechaI,
                                            fecha_fina: this.detailDias.fechaF,
                                            fecha_regreso:this.detailDias.fechaRegreso,
                                        },
                                        Mailto:this.$store.state.authModule.user.correolider//'alfredo.juarez@itw.mx',
                                    }).then(response=>{},error=>{});
                            }).catch(() => {});
                        }else{
                            this.registrarSolicitud();
                                this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                    emailType:2,
                                    userData:{
                                    name:this.$store.state.authModule.user.nombre,
                                    dias:this.detailDias.diasASolicitar,
                                    fecha_inicial: this.detailDias.fechaI,
                                    fecha_final: this.detailDias.fechaF,
                                    fecha_regreso:this.detailDias.fechaRegreso,
                                    },
                                    Mailto:this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                                }).then(response=>{},error=>{});
                                this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                        emailType:3,
                                        userData:{
                                            name:this.$store.state.authModule.user.nombre,
                                            dias:this.detailDias.diasASolicitar,
                                            fecha_ini: this.detailDias.fechaI,
                                            fecha_fina: this.detailDias.fechaF,
                                            fecha_regreso:this.detailDias.fechaRegreso,
                                        },
                                        Mailto:this.$store.state.authModule.user.correolider//'alfredo.juarez@itw.mx',
                                    }).then(response=>{},error=>{});
                        }
                        
                    } 
                });
            },
            /***
             * Funcion para registrar las nuevas 
             * solicitudes de vacaciones.
             */
            registrarSolicitud(){
                this.$refs.upload.submit(); //Cargamos el archivo al servidor;
                this.restarDias(this.detailDias.diasASolicitar);
                this.registrerVacations({
                    // ====  Datos de solicitud =====
                    autorizador: this.$store.state.authModule.user.lider, //autorizador
                    days: this.detailDias.diasASolicitar,//dias a solicitar
                    empleado: this.$store.state.authModule.user.empleado_id,//empleadoid
                    fecha_f: this.detailDias.fechaF,//fecha final de la solicitud
                    fecha_i: this.detailDias.fechaI,//fecha inicial de la solicitud
                    fecha_r: this.detailDias.fechaRegreso,//fecha return
                    files:this.detailDias.files[0],//archivo soporte
                    // ====  Datos para actualizar Dias  ====
                    dias: this.detailDia.diasDisponibles,//saldo dias disponibles
                    diasadicionales: this.detailDia.diasAdicional,//saldo dias adicionales
                    fecha_diasadicionales: this.detailDia.fechaExpDiaAdicional,//f
                    diasxvencer: this.detailDia.diasAVencer,//saldo dias a vencer
                    fecha_diasxvencer: this.detailDia.fechaExpDias,//fecha de venc de dias por vencer
                    numDayBeforeSolicitud: this.$store.state.requestVacation.vacaciones.diasDisponibles
                })
                .then(
                    response=>{
                        var f = new Date();
                        this.$refs.upload.submit() //Cargamos el archivo al servidor;
                        this.dialogVisible= false;//Ocultamos modal
                        this.addSolicitud({ //Agregamos la nueva solicitud a los datos ya descargados
                            empleado_id: this.$store.state.authModule.user.empleado_id,
                            estatus1: 'PENDIENTE',
                            fecha_final: this.detailDias.fechaF,
                            fecha_inicial: this.detailDias.fechaI,
                            fecha_solicitud: f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear(),
                            filename: this.detailDias.files,
                            total_dias: this.detailDias.diasASolicitar,
                            vacaciones_id: 0
                        });
                        this.$message({
                            message: 'Solicitud de vacaciones registrada correctamente.',
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
        },
        computed:{
            ...mapGetters({
                historialVacaciones: vacationTypes.getters.registrosVacaciones,
                detailDia: vacationTypes.getters.vacaciones,
            }),
            file_ref(){
                var today = new Date();
                today = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                return 'docE' + this.$store.state.authModule.user.empleado_id + '_F'+today;
            },
            total(){
                //Realizamos sumatoria de todos los días disponibles
                var diasTotal = (this.detailDia.diasAVencer + this.detailDia.diasAdicional + (this.detailDia.diasDisponibles)); 
                return  isNaN(diasTotal)?0:diasTotal; //controlamos que el numero de dias disponibles sea númerico
            },
            size_window(){
                return window.innerWidth < 1000 ? true : false;
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
            const userId = this.$store.state.authModule.user.empleado_id;
            //Validamos que existan datos antes de solicitarlos al servidor.
            if(Object.keys(this.$store.state.requestVacation.vacaciones.registrosVacaciones).length == 0){
                this.allVacations(userId);
            }
            if(this.$store.state.requestVacation.vacaciones.vacacionesID === 0){
                this.diasVacaciones(userId);
            }
        }
    }
</script>
<style scoped>
    h4, h6{font-weight: 700;}
    #detailVacation{
        background-color: #1d5b85;
        border-radius: 10em;
    }
    #detailVacation p{
        padding: 5px;
        margin-bottom: 0;
        color: #fff;
    }
    #detailVacation div >p > span {
        font-weight: 500;
    }
    #modal{
        margin-left: 15%;
        /*width: 80%;*/
        overflow: auto;
    }
    #fechas{
        width: 90%;
    }
/* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {
      #detailVacation p{
        font-size: 12px;
    }
    .el-col-4, .el-col-7{
        width: 100% !important;
    }
    #detailVacation{
        border-radius: 25px 25px;
    }
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
        width: 100% !important;
    }
    #cargar>.el-upload>.el-upload-dragger{
        width: 100% !important;
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
