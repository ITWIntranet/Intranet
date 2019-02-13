<template>
   <section id="vacationRequest">
        <el-row>
            <el-col :span="24"><h5>Módulo de Vacaciones</h5></el-col>
        </el-row>
        <el-row id="pendingVacation">
            <el-col :span="24"><h6>Vacaciones pendientes de autorización</h6></el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="vacacionesPendientes" height="300" 
                style="width:77%" :row-class-name="tableRowClassName">
                    <el-table-column type="expand" fixed>
                        <template slot-scope="props">
                            <el-row>
                                <el-col :span="12">
                                    <p>Fecha Inicial: {{ props.row.fecha_inicial }}</p>
                                </el-col>
                                <el-col :span="12">
                                    <p>Fecha Final: {{ props.row.fecha_final }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <p>Fecha Regreso: <a>{{ props.row.fecha_return }}</a></p>
                                </el-col>
                                <el-col :span="12">
                                    <p>Doc Soporte: <a>{{ props.row.filename }}</a></p>
                                </el-col>
                            </el-row>
                            <el-row v-if="props.row.total_dias> props.row.days_corresp_asolicitud">
                                <el-col :span="12">
                                    <p>Antigüedad: <strong><a>{{ antiguedadUser(props.row.fecha_antiguedad) }}</a> años.</strong></p>
                                </el-col>
                                <el-col :span="12">
                                    <p>Días adicionales permitidos: <strong><a>{{ diasAdicionalesxAntiguedad(props.row.fecha_antiguedad) }}</a> días.</strong></p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <p>Notificación: {{ props.row.email_1 }}</p>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="N°" prop="vacaciones_id" width="45">
                    </el-table-column>
                    <el-table-column prop="fecha_solicitud" label="Fecha Solicitud" width="129">
                    </el-table-column>
                    <el-table-column prop="total_dias" label="Días solicitados" width="135">
                    </el-table-column>
                    <el-table-column prop="days_corresp_asolicitud" label="Días disponibles" width="138">
                    </el-table-column>
                    <el-table-column prop="nombre" label="Empleado" width="200">
                    </el-table-column>
                    <el-table-column
                        label="Opciones"
                        width="160">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="Aceptar solicitud de vacaciones" placement="top">
                                <el-button type="success" size="small" icon="el-icon-check" circle
                                @click.native.prevent="approved(scope.$index,vacacionesPendientes)"></el-button>
                            </el-tooltip>    
                            <el-tooltip class="item" effect="dark" content="Rechazar solicitud de vacaciones" placement="top">
                                <el-button type="danger" size="small" icon="el-icon-close" circle
                                @click.native.prevent="toRefuse(scope.$index,vacacionesPendientes)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="Solicitud requiere revisión a detalle." placement="top">
                                <el-button type="warning" size="small" 
                                v-if="scope.row.total_dias> scope.row.days_corresp_asolicitud"
                                icon="el-icon-bell" circle  disabled></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog>
                    <el-label>Nombre: {{vacationRequest.nombreEmp}}</el-label>
                </el-dialog>
            </el-col>
        </el-row>
    </section>
</template>
<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import vacationTypes from '@/types/vacation';
    import store from '@/main';
    import io from 'socket.io-client';//Libreria necesaria para notificaciones real-time
    import axios from 'axios';

    export default {
        name: 'vacation-approved',
        data(){
            return{
                historialVacaciones:[],
                vacationRequest:{
                    fechaIni:'',
                    fechaFin:'',
                    nombreEmp:'',
                    totalDias:0,
                    solicitudID:0,
                    fechaAprobacion:'',
                    comentario:'',
                    correo: '',
                    regreso: '',
                }
            }
        },
        methods:{
            ...mapActions({
                allPending: vacationTypes.actions.fetchAutorizaciones,
                autorization: vacationTypes.actions.administrarSolicitudes
            }),
            ...mapMutations({
                removeItem: vacationTypes.mutations.removeItemAutorization
            }),
            approved(index, rows){
                this.dialogApprove = true;
                //Seteamos los datos con el registro seleccionado
                this.vacationRequest.fechaIni = rows[index].fecha_inicial;
                this.vacationRequest.fechaFin = rows[index].fecha_final;
                this.vacationRequest.nombreEmp = rows[index].nombre;
                this.vacationRequest.totalDias = rows[index].total_dias;
                this.vacationRequest.solicitudID = rows[index].vacaciones_id;
                this.vacationRequest.correo = rows[index].email_1;
                this.vacationRequest.regreso = rows[index].fecha_return;
                //Mostramos un mensaje confirmando la acción
                let msg = '<h5>¿Desea autorizar la siguiente solicitud?</h5><br>'+
                '<strong>Empleado: </strong>'+ this.vacationRequest.nombreEmp+'<strong> Días: </strong>'+this.vacationRequest.totalDias+'<br>'+
                '<strong>Inicio: </strong>'+this.vacationRequest.fechaIni+' <strong>Fin: </strong>'+this.vacationRequest.fechaFin+'<br><br>'+
                '<strong>Comentario: </strong>';

                this.$prompt(msg, 'Aprobación de vacaciones.', {
                    dangerouslyUseHTMLString: true,
                    distinguishCancelAndClose: true,
                    confirmButtonText: 'Aprobar',
                    cancelButtonText: 'Cancelar',
                    inputPlaceholder:'puede añadir comentario(opcional).'
                    }).then(({ value }) => { //Click Btn Aceptar
                        this.vacationRequest.comentario = value;
                        this.autorization({
                            id: this.vacationRequest.solicitudID,
                            comment:this.vacationRequest.comentario,
                            status:'APROBADO'
                        })
                        .then(
                            response=>{
                                /*console.log(response.data);
                                console.log(response.status);
                                console.log(response.statusText);
                                console.log(response.headers);
                                console.log(response.config);*/
                                this.removeItem(index);
                                this.$message({
                                    message: 'Solicitud de vacaciones aprobada correctamente.',
                                    type: 'success'
                                });
                                this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                    emailType:9,
                                    userData:{
                                        name: this.vacationRequest.nombreEmp,
                                        estado: 'APROBADA',
                                        dias: this.vacationRequest.totalDias,
                                        fecha_ini: this.vacationRequest.fechaIni,
                                        fecha_fina: this.vacationRequest.fechaFin,
                                        fecha_regreso: this.vacationRequest.regreso,
                                    },
                                    Mailto: this.vacationRequest.correo,//this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                                }).then(response=>{},error=>{});
                            },
                            error=>{
                                this.$message({
                                    message: 'Servicio no disponible, favor de intentarlo más tarde.',
                                    type: 'warning'
                                });
                            }
                        );

                    }).catch(action=>{
                    });
            },
            toRefuse(index, rows){
                this.dialogApprove = true;
                //Seteamos los datos con el registro seleccionado
                this.vacationRequest.fechaIni = rows[index].fecha_inicial;
                this.vacationRequest.fechaFin = rows[index].fecha_final;
                this.vacationRequest.nombreEmp = rows[index].nombre;
                this.vacationRequest.totalDias = rows[index].total_dias;
                this.vacationRequest.solicitudID = rows[index].vacaciones_id;
                this.vacationRequest.correo = rows[index].email_1;
                this.vacationRequest.regreso = rows[index].fecha_return;
                //Mostramos un mensaje confirmando la acción
                let msg = '<h5>¿Desea cancelar la siguiente solicitud?</h5><br>'+
                '<strong>Empleado: </strong>'+ this.vacationRequest.nombreEmp+'<strong> Días: </strong>'+this.vacationRequest.totalDias+'<br>'+
                '<strong>Inicio: </strong>'+this.vacationRequest.fechaIni+' <strong>Fin: </strong>'+this.vacationRequest.fechaFin+'<br><br>'+
                '<strong>Comentario: </strong>';

                this.$prompt(msg, 'Aprobación de vacaciones.', {
                    dangerouslyUseHTMLString: true,
                    distinguishCancelAndClose: true,
                    confirmButtonText: 'Rechazar',
                    cancelButtonText: 'Cancelar',
                    inputPlaceholder:'puede añadir comentario(opcional).'
                    }).then(({ value }) => { //Click Btn Aceptar
                        this.vacationRequest.comentario = value;
                        this.autorization({
                            id: this.vacationRequest.solicitudID,
                            comment:this.vacationRequest.comentario,
                            status:'RECHAZADO'
                        })
                        .then(
                            response=>{
                                this.removeItem(index);
                                this.$message({
                                    message: 'Solicitud de vacaciones rechazada correctamente.',
                                    type: 'success'
                                });
                                 this.AxiosInstance.post('sendEmail',{ //Envio de Correo Después de una solicitud registrada con éxito
                                        emailType:9,
                                        userData:{
                                            name: this.vacationRequest.nombreEmp,
                                            estado: 'RECHAZADA',
                                            dias: this.vacationRequest.totalDias,
                                            fecha_ini: this.vacationRequest.fechaIni,
                                            fecha_fina: this.vacationRequest.fechaFin,
                                            fecha_regreso: this.vacationRequest.regreso,
                                        },
                                        Mailto: this.vacationRequest.correo,//this.$store.state.authModule.user.usuario,//'alfredo.juarez@itw.mx',
                                    }).then(response=>{},error=>{});
                            },
                            error=>{
                                this.$message({
                                    message: 'Servicio no disponible, favor de intentarlo más tarde.',
                                    type: 'warning'
                                });
                            }
                        );

                    }).catch(action=>{
                    });
            },
            antiguedadUser:function(fechaIngreso){
                var birthday = new Date(fechaIngreso);
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            },
            diasAdicionalesxAntiguedad:function(fechaIngreso){
                var birthday = new Date(fechaIngreso);
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds
                var anios = Math.abs(ageDate.getUTCFullYear() - 1970);
                return  anios===0?1:anios===1?2:anios===2?3:anios===3?4:anios>=4?5:5;
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            }
        },
        computed:{
            ...mapGetters({
                vacacionesPendientes: vacationTypes.getters.recordsAutorizacion
            }),
            antiguedad(){
                vacacionesPendientes
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
            if(this.$store.state.requestVacation.registrosVacacionesPendientes.length == 0){
                const userId = this.$store.state.authModule.user.empleado_id;
                this.allPending(userId);
            }
        }
    }
</script>
<style scoped>
    .el-table .warning-row {
        background: oldlace;
    }
    .el-table .success-row {
        background: red;
    }
    #pendingVacation{
        background-color: #1d5b85;
        border-radius: 10em;
    }
    #pendingVacation h6{
        padding: 5px;
        margin-bottom: 0;
        color: #fff;
        font-weight: 700;
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

