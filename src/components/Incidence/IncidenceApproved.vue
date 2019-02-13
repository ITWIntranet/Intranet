<template>
   <section id="IncidenceApproved">
        <el-row>
            <el-col :span="24"><h5>Módulo de Incidencias</h5></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><h6>Incidencias pendientes de autorización</h6></el-col>
        </el-row>
        <el-row :gutter="10" id="approveIncidence">
            <el-col :span="24"><p><strong>Incidencias pendientes por aprobar </strong></p></el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="incidenciasPendientes" max-height="500" style="width:90%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <p><strong>Fecha Inicial:  </strong>{{ props.row.fecha_inicial }}</p>
                            <p><strong>Fecha Final:  </strong>{{ props.row.fecha_final }}</p>
                            <p><strong>Justificación:  </strong>{{ props.row.comentario }} </p>
                            <p><strong>Notificación:  </strong>{{ props.row.email_1 }} </p>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="N°" prop="incidencias_id" width="50">
                    </el-table-column>
                    <el-table-column prop="nombre" label="Empleado" width="200">
                    </el-table-column>
                    <el-table-column prop="fecha_solicitud" label="Fecha de Solicitud" width="160">
                    </el-table-column>
                    <el-table-column prop="total_dias" label="Total días" width="100">
                    </el-table-column>

                    <el-table-column
                        label="Opciones"
                        width="120">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="Aceptar solicitud" placement="left">
                                <el-button type="success" size="small" icon="el-icon-check" circle @click.native.prevent="approveDialog(scope.$index,incidenciasPendientes)"></el-button>
                            </el-tooltip>    
                            <el-tooltip class="item" effect="dark" content="Rechazar solicitud" placement="right">
                                <el-button type="danger" size="small" icon="el-icon-close" circle @click.native.prevent="rejectDialog(scope.$index, incidenciasPendientes)"></el-button>
                            </el-tooltip>                        
                            <el-dialog
                                title="Confirmación de solicitud."
                                :visible.sync="dialogApprove"
                                width="40%"
                                :before-close="handleClose">
                                <el-row>
                                    <el-row :gutter="8">
                                        <el-col :span="22" style="float:centre; margin-top: 20px;">
                                            <div class="block"><p>¿Deseas autorizar la siguiente solicitud?.</p></div>
                                            <p>Incidencia de <strong>{{aprobacionIncidencias.nombreEmp}}</strong> por un periodo de <strong>{{aprobacionIncidencias.totDias}}</strong>
                                                día(s), <br> iniciando el <strong>{{aprobacionIncidencias.fechaIni}}</strong> al <strong>{{aprobacionIncidencias.fechaFin}}</strong>. </p>
                                        </el-col>
                                    </el-row>
                                </el-row>
                                <el-row :gutter="8">
                                    <el-col :span="22" style="float:centre; margin-top: 10px;">
                                        <el-form :model="modelRef" ref="modelRef" :rules="rules_incidence">
                                            <el-form-item prop="tipoIncidencia">
                                                <el-select v-model="modelRef.tipoIncidencia" clearable placeholder="Selecciona el tipo de incidencia">
                                                    <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>

                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogApprove = false">Cancelar</el-button>
                                    <el-button type="primary" @click.native.prevent="approveIncidence(scope.$index, incidenciasPendientes)">Confirmar</el-button>
                                </span>


                                
                            </el-dialog>
                            <el-dialog
                                title="Rechazo de solicitud."
                                :visible.sync="dialogReject"
                                width="40%"
                                :before-close="handleClose">
                                <el-row>
                                    <el-row :gutter="8">
                                        <el-col :span="22" style="float:centre; margin-top: 20px;">
                                            <div class="block"><p>¿Deseas rechazar la siguiente solicitud?.</p></div>
                                            <p>Incidencia de <strong>{{aprobacionIncidencias.nombreEmp}}</strong> por un periodo de <strong>{{aprobacionIncidencias.totDias}}</strong>
                                                día(s), <br> iniciando el <strong>{{aprobacionIncidencias.fechaIni}}</strong> al <strong>{{aprobacionIncidencias.fechaFin}}</strong>. </p>
                                        </el-col>
                                    </el-row>
                                </el-row>
                                <el-row :gutter="8">
                                    <el-col :span="22" style="float:center; margin-top: 10px;">
                                        <el-form :model="modelRef" ref="modelRef" :rules="rules_incidence">
                                            <el-form-item prop="comentario">
                                                <el-input type="textarea" :rows="2" v-model="modelRef.comentario" placeholder="Captura el motivo del rechazo.">Captura el motivo de rechazo.</el-input>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>

                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogReject = false">Cancelar</el-button>
                                    <el-button type="primary" @click.native.prevent="rejectIncidence(scope.$index, incidenciasPendientes)">Confirmar</el-button>
                                </span>
                            </el-dialog>
                        </template>

                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </section>

</template>
<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import incidenceTypes from '@/types/incidence';
    import store from '@/main';
    import io from 'socket.io-client';//Libreria necesaria para notificaciones real-time
    import axios from 'axios';

    export default {
        name: 'incidence-approved',
        data(){
            return{
                dialogReject: false,
                dialogApprove: false,
                options: [{
                value: '1',
                label: 'Compensatorio'
                }, {
                value: '5',
                label: 'Incapacidad IMSS'
                }, {
                value: '3',
                label: 'Enfermedad (Requiere Justificante)'
                }, {
                value: '7',
                label: 'Permiso Con Goce de Sueldo'
                }, {
                value: '8',
                label: 'Permiso Sin Goce de Sueldo'
                }, {
                value: '10',
                label: 'Vacaciones'
                }, {
                value: '6',
                label: 'Matrimonio'
                }, {
                value: '9',
                label: 'Titulación'
                }, {
                value: '2',
                label: 'Defunción de Familiar'
                }, {
                value: '4',
                label: 'Falta No Justificada'
                }],
                typeIncidence: '',
                aprobacionIncidencias:{
                    nombreEmp: '',
                    fechaIni: '',
                    fechaFin: '',
                    totDias: '',
                    correo: '',
                    },
                modelRef: {
                    tipoIncidencia: '',
                    comentario: '',
                },
                rules_incidence:{
                    tipoIncidencia:[
                        {required: true, message: 'Favor de seleccionar el tipo de incidencia', trigger: 'blur'}
                    ],
                    comentario:[
                        {required: true, message: 'Favor de capturar un comentario', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            ...mapActions({
                porAutorizar: incidenceTypes.actions.autorizarIncidencias,
                authorization: incidenceTypes.actions.administrarIncidencias //Autorizar incidencias
            }),
            ...mapMutations({
                deleteReg: incidenceTypes.actions.deleteRegister,
                removeItem: incidenceTypes.mutations.deleteRegister
            }),
            approveDialog(index, rows){
                this.dialogApprove= true;
                this.aprobacionIncidencias.nombreEmp = rows[index].nombre;
                this.aprobacionIncidencias.fechaIni = rows[index].fecha_inicial;
                this.aprobacionIncidencias.fechaFin = rows[index].fecha_final;
                this.aprobacionIncidencias.totDias = rows[index].total_dias;
                this.aprobacionIncidencias.correo = rows[index].email_1;
            },
            rejectDialog(index, rows){
                this.dialogReject= true;
                this.aprobacionIncidencias.nombreEmp = rows[index].nombre;
                this.aprobacionIncidencias.fechaIni = rows[index].fecha_inicial;
                this.aprobacionIncidencias.fechaFin = rows[index].fecha_final;
                this.aprobacionIncidencias.totDias = rows[index].total_dias;
                this.aprobacionIncidencias.correo = rows[index].email_1;
            },

            handleClose(done) {
            this.$confirm('Are you sure to close this dialog?')
            .then(_ => {
 
            }).catch(_ => {});

            },

        approveIncidence(index, rows){
            //this.$refs[formName].validate((valid) => {
               // if(valid){
                    this.authorization({
                        id: rows[index].evento_emp_id,
                        comment: this.modelRef.tipoIncidencia,
                        status: 'APROBADO'
                    })
                    .then(
                        response=>{
                            this.removeItem(index);
                            this.$message({
                                message: 'Incidencia aprobada correctamente.',
                                type: 'success',
                            });
                            this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                emailType:10,
                                userData:{
                                    name: this.aprobacionIncidencias.nombreEmp,
                                    estado: 'APROBADA',
                                    fecha_ini: this.aprobacionIncidencias.fechaIni,
                                    fecha_fina: this.aprobacionIncidencias.fechaFin,
                                    dias: this.aprobacionIncidencias.totDias,
                                },
                                Mailto: this.aprobacionIncidencias.correo,//this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                            }).then(response=>{},error=>{});
                            this.dialogApprove= false;
                            this.modelRef.tipoIncidencia='';
                        },
                        error=>{
                            this.$message({
                                message: 'Servicio no disponible, favor de intentarlo más tarde.',
                                type: 'warning'
                            });
                        }
                    );
                //}

            //});   
        },

        rejectIncidence(index, rows){
           // this.$refs[formDesc].validate((valid) => {
                //if(valid){
                    this.authorization({
                        id: rows[index].evento_emp_id,
                        comment: this.modelRef.comentario,
                        status: 'RECHAZADO'
                    })
                    .then(
                        response=>{
                            this.removeItem(index);
                            this.$message({
                                message: 'Solicitud rechazada correctamente.',
                                type: 'success',
                            });
                            this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                            emailType:10,
                            userData:{
                                name: this.aprobacionIncidencias.nombreEmp,
                                estado: 'RECHAZADA',
                                fecha_ini: this.aprobacionIncidencias.fechaIni,
                                fecha_fina: this.aprobacionIncidencias.fechaFin,
                                dias: this.aprobacionIncidencias.totDias,
                            },
                            Mailto: this.aprobacionIncidencias.correo,//this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                            }).then(response=>{},error=>{});
                            this.dialogReject= false;
                            this.modelRef.comentario='';
                        },
                        error=>{
                            this.$message({
                                message: 'Servicio no disponible, favor de intentarlo más tarde.',
                                type: 'warning'
                            });
                        }
                    );
                //}
            //});

        }
    },
        computed:{
            ...mapGetters({
                incidenciasPendientes: incidenceTypes.getters.recordsIncidencesPending
            }),
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
            if(this.$store.state.modulesIncidence.regIncidenciasPorAprobar.length == 0){
                const userId = this.$store.state.authModule.user.empleado_id;
                this.porAutorizar(userId)
                    .then(
                    response=>{
                    },
                    error=>{

                    }
                );;
            }
        }
    }
</script>
<style scoped>
    .el-select{
        width: 300px;
    }
    h4, h6{font-weight: 700;}
    #approveIncidence{
        background-color: #1d5b85;
        border-radius: 10em;
    }
    #approveIncidence p{
        padding: 5px;
        margin-bottom: 0;
        color: #fff;
    }
    #approveIncidence div >p > span {
        font-weight: 500;
    }

    /* implementación media querys
    *  Extra small devices (portrait phones, less than 576px)*/
    @media (max-width: 575.98px) { 
        #approveIncidence{
            border-radius: 25px 25px;
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

