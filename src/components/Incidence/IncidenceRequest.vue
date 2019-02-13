<template>
    <section id="incidenceRequest">
        <el-row>
            <el-col :span="24"><h5>Módulo de Incidencias</h5></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><h6>Registro de Incidencias</h6></el-col>
        </el-row>
        <el-row :gutter="10" id="detailIncidence">
            <el-col :span="10"><p><strong>Historial de Incidencias</strong></p></el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="historialIncidencias" height="350" style="width: 100%">
                    <el-table-column type="index" label="N°" prop="vacaciones_id" width="50">
                    </el-table-column>
                    <el-table-column prop="fecha_solicitud" label="Fecha Solicitud" width="130">
                    </el-table-column>
                    <el-table-column prop="evento" label="Tipo de Incidencia" width="260">
                    </el-table-column>
                    <el-table-column prop="comentario" label="Descripción" width="250">
                    </el-table-column>
                    <el-table-column prop="fecha_inicial" label="Fecha Inicio" width="130">
                    </el-table-column>
                    <el-table-column prop="fecha_final" label="Fecha Fin" width="130">
                    </el-table-column>
                    <el-table-column prop="total_dias" label="Días Totales" width="120">
                    </el-table-column>
                    <el-table-column prop="estatus1" label="Estatus" width="120">
                        <template slot-scope="scope">
                            <el-tag
                            :type="scope.row.estatus1 === 'APROBADO' ? 'success' : scope.row.estatus1 === 'PENDIENTE' ? 'warning' : 'danger'"
                            disable-transitions>{{scope.row.estatus1}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="filename" label="Doc. Adjunto" width="180">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" style="float:right;    margin-top: 10px;">
                <el-tooltip class="item" effect="dark" content="Registra una nueva incidencia." placement="top">
                     <el-button type="primary" circle @click="dialogVisible= true"><i class="fas fa-plus"></i></el-button>
                </el-tooltip>
            </el-col>
        </el-row>

        <!-- Modal Dialog para capturar solicitudes de incidencias-->
        <el-dialog id="modal" 
            title="Registro de incidencias"
            :fullscreen="size_window"
            width="30%"
            top="4vh"
            :visible.sync="dialogVisible"
            :before-close="handleClose" center>
            <!-- Formulario de captura -->
                <el-form ref="newIncidence" :model="newIncidence" 
                :rules="rules_incidence" label-position="top" :status-icon="icon_form">
                    <el-row :gutter="2">
                        <el-col :span="10">
                            <p><strong>Días solicitados: </strong>{{detailIncidence.diasASolicitar}}</p>
                        </el-col>
                    </el-row>
                    <el-form-item label="Selecciona el rango de fechas:" prop="fechas">
                        <center>
                        <el-date-picker
                        v-model="newIncidence.fechas"
                        type="daterange"
                        range-separator="A"
                        start-placeholder="Fecha Inicio"
                        end-placeholder="Fecha Fin"
                        format="dd/MM/yyyy"
                        value-format="yyyy/MM/dd"
                        v-on:change="calcDatesAndReturn"></el-date-picker>
                        </center>
                    </el-form-item>
                    <el-form-item label="Motivo:" prop="descripcion">
                        <center>
                        <el-input type="textarea" :rows="3" prop="comentario" style="width:95%" v-model="detailIncidence.comentario"
                        id="idDescription" placeholder="Captura el motivo de la incidencia." ></el-input>
                        </center>
                    </el-form-item>
                    <el-form-item label="Documento de soporte:">
                        <el-upload
                           class="upload-demo"
                            drag
                            action="http://65.99.252.240:3000/file_atachment/"
                            style="float:left;"
                            :file-list="detailIncidence.file_name" :auto-upload="false"
                            accept=".doc,.docx,.png,.pdf,.jpg,.jpeg"
                            list-type="picture">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text" >Suelta tu archivo aquí o <em>haz clic para cargar</em></div>
                            <div slot="tip" class="el-upload__tip">Solo archivos con un tamaño menor de 1Mb<br>Archivos permitidos: .doc,.docx,.png,.pdf,.jpg,.jpeg</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newIncidence')">Cancelar</el-button>
                <el-button type="primary" @click.native.prevent="submitForm('newIncidence')">Solicitar</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import incidenceTypes from '@/types/incidence';
    import store from '@/main';
    import Vue from 'vue';
    import io from 'socket.io-client';//Libreria necesaria para notificaciones real-time
    import axios from 'axios';

    export default {
        name: 'incidenceRequest',
        data(){
            return{
                value1: '',
                value2: '',
                description:'',
                detailIncidence:{
                    fecha_inicio: '',
                    fecha_fin: '',
                    diasASolicitar: '',
                    comentario: '',
                    file_name: [],
                },
                dialogVisible:false,
                rules_incidence:{
                    fechas:[
                        {required: true, message: 'Favor de capturar las fechas de tu incidencia', trigger: 'blur'}
                    ],
                    comentario:[
                        {required: true, message: 'Favor de capturar un comentario', trigger: 'blur'}
                    ]
                },
                icon_form:true,
                file:[],
                newIncidence:{
                    file:[],
                    fechas:[],
                    descripcion: ''
                },
            }
        },
        methods:{
            ...mapActions({
                allIncidencias: incidenceTypes.actions.consultarIncidencias,
                registrerIncidence: incidenceTypes.actions.registrarIncidencias,
                sendRegister: incidenceTypes.actions.sendNewRegister
            }),
            Correo(){
                this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                    emailType:4,
                    userData:{
                        name:this.$store.state.authModule.user.nombre,
                        dias:this.detailIncidence.diasASolicitar,
                        fecha_ini: this.detailIncidence.fecha_inicio,
                        fecha_fina: this.detailIncidence.fecha_fin,
                        motivo:this.detailIncidence.comentario,
                    },
                Mailto:this.$store.state.authModule.user.usuario//'alfredo.juarez@itw.mx',
                }).then(response=>{},error=>{});
                this.AxiosInstance.post('sendEmail',{ //Envio de Correo a Lider Después de una solicitud registrada con éxito
                    emailType:5,
                    userData:{
                        name:this.$store.state.authModule.user.nombre,
                        dias:this.detailIncidence.diasASolicitar,
                        fecha_ini: this.detailIncidence.fecha_inicio,
                        fecha_fina: this.detailIncidence.fecha_fin,
                        motivo:this.detailIncidence.comentario,
                    },
                Mailto:this.$store.state.authModule.user.correolider//'alfredo.juarez@itw.mx',
                }).then(response=>{},error=>{});
            },
            handleClose(done) {
                this.$confirm('¿Deseas cancelar la captura de la Incidencia?')
                .then(_ => {
                    //this.$refs[newIncidence].resetFields();
                    //done(IncidenceRequest.$refs(newIncidence).resetFields());
                    done(this.newIncidence.fechas='', this.detailIncidence.diasASolicitar=0,this.detailIncidence.comentario='',this.detailIncidence.file_name = [],this.dialogVisible = false)
                    /*this.$refs[newIncidence].resetFields()
                    this.detailIncidence.diasASolicitar=0;
                    this.detailIncidence.comentario='';
                    this.detailIncidence.file_name = [];
                    this.dialogVisible = false;*/
                })
                .catch(_ => {});
            },
            calcDatesAndReturn(){
                var dias = this.diffDate(this.newIncidence.fechas[0], this.newIncidence.fechas[1] );
                var diasSolicitados = 0;
                //Calculamos de diferencia entre dos fechas
                var i;
                var day = new Date(this.newIncidence.fechas[0]);
                if(dias > 1){ //Para validar más de una solicitud
                    for(i=0; i< dias; i++ ){
                        var y = new Date(this.newIncidence.fechas[0]);
                        y.setDate(y.getDate()+i);
                        var r = this.dayHolliday(y);
                        r ? diasSolicitados : diasSolicitados++;
                    }
                }else{ //Para validar la solicitud de un solo día
                    this.dayHolliday(day) ? diasSolicitados : diasSolicitados++ ;
                }
                this.detailIncidence.diasASolicitar = diasSolicitados;
                // .Calculo de fechas
                
                //Calculo de fecha de regreso a labores
                var diaHabil = true;
                var nDias = 1;
                var dayR = new Date(this.newIncidence.fechas[1]);
                while(diaHabil){
                    dayR.setDate(dayR.getDate()+ nDias);//Fecha inicio + dif entre las dos fechas ingresadas
                    var r = this.dayHolliday(dayR); //Evaluamos que la fecha devuelta sea habil
                    r ? nDias++ :diaHabil=false;
                    this.detailIncidence.fechaRegreso = dayR.getDate() + "/" + (dayR.getMonth()+1) +"/"+dayR.getFullYear();
                }
                var fechaUno = this.newIncidence.fechas[0].split("/");
                this.detailIncidence.fecha_inicio = fechaUno[2] + "/" + fechaUno[1] + "/" + fechaUno[0];
                var fechaDos = this.newIncidence.fechas[1].split("/");
                this.detailIncidence.fecha_fin = fechaDos[2] + "/" + fechaDos[1] + "/" + fechaDos[0];
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
            resetForm(newIncidence){
                this.$refs[newIncidence].resetFields();
                this.detailIncidence.diasASolicitar=0;
                this.detailIncidence.comentario='';
                this.detailIncidence.file_name = [];
                this.dialogVisible = false;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //this.detailIncidence.diasASolicitar;
                        this.registrerIncidence({ //PUT
                            empleado_id: this.$store.state.authModule.user.empleado_id, //numero empleado
                            fecha_inicio: this.detailIncidence.fecha_inicio, //fecha de inicio
                            fecha_fin: this.detailIncidence.fecha_fin, //fecha de termino
                            total_dias: this.detailIncidence.diasASolicitar, //total de dias 
                            comentario: this.detailIncidence.comentario, //comentario
                            file_name: this.detailIncidence.file_name, //nombre de archivo adjunto
                            autorizador_id: this.$store.state.authModule.user.lider //autorizador de la incidencia
                        })
                        .then(
                            response=>{
                                var f = new Date();
                                this.dialogVisible= false;//Ocultamos modal
                                var addRegister = { // GET
                                    empleado_id: this.$store.state.authModule.user.empleado_id, //numero empleado
                                    fecha_inicial: this.detailIncidence.fecha_inicio, //fecha de inicio
                                    fecha_final: this.detailIncidence.fecha_fin, //fecha de termino
                                    total_dias: this.detailIncidence.diasASolicitar, //total de dias 
                                    comentario: this.detailIncidence.comentario, //comentario
                                    file_name: this.detailIncidence.file_name, //nombre de archivo adjunto
                                    autorizador_id1: this.$store.state.authModule.user.lider, //autorizador de la incidencia
                                    estatus1:"PENDIENTE",
                                    evento:"En Revisión",
                                    evento_emp_id: 0,
                                    fecha_solicitud: f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear(),
                                    nombre:""
                                };
                                this.Correo();
                                this.sendRegister(addRegister);
                                this.detailIncidence.comentario='';
                                this.newIncidence.fechas = [];
                                this.$message({
                                    message: 'Solicitud de incidencia registrada correctamente.',
                                    type: 'success'
                                });
                                this.Correo();
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
        computed:{
            ...mapGetters({
                historialIncidencias: incidenceTypes.getters.recordsIncidencesApproved
            }),
            size_window(){
                return window.innerWidth < 1000 ? true: false
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
            //Validamos que existan datos antes de solicitarlos al servidor.
            if(Object.keys(this.$store.state.modulesIncidence.incidenciasPending).length == 0){
                const userId = this.$store.state.authModule.user.empleado_id;
                this.allIncidencias(userId);
            }
        }
    }
</script>
<style scoped>
    h4, h6{font-weight: 700;}
    #detailIncidence{
        background-color: #1d5b85;
        border-radius: 10em;
    }
    #detailIncidence p{
        padding: 5px;
        margin-bottom: 0;
        color: #fff;
    }
    #detailIncidence div >p > span {
        font-weight: 500;
    }
    .el-dialog {
        
        overflow: hidden;
    }

/* implementación media querys
  *  Extra small devices (portrait phones, less than 576px)*/
  @media (max-width: 575.98px) {

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

