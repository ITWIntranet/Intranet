<template> 
    <section id="Reports">
        <el-row>
            <el-col :span="24"><h5>Reportes</h5></el-col>
        </el-row>
        <el-col>
            <el-tabs v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane label="Vacaciones" name="first">
                    <el-col :span="24">

                        <el-table :data="vacationReports.filter(data => !search || data.nombre.toLowerCase().includes(search.toLowerCase()))" height="500"  style="width:auto">
                            <el-table-column  prop="nombre" width="300">
                            <template slot="header" slot-scope="scope">
                                <el-input v-model="search" size="mini" placeholder="Filtro por Nombre Empleado">
                            </el-input></template>
                            </el-table-column>
                            <el-table-column label="Fecha Inicial" prop="fecha_inicial" width="140"></el-table-column>
                            <el-table-column label="Fecha Final" prop="fecha_final" width="140"></el-table-column>
                            <el-table-column label="Total Días" prop="total_dias" width="120"></el-table-column>
                            <el-table-column label="Estatus" prop="estatus1" width="130"></el-table-column>
                            <el-table-column label="Doc. Adjunto" prop="attached" width="160"></el-table-column>
                        </el-table>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="Incidencias" name="second">

                        <el-table :data="incidenceReports.filter(data => !search || data.nombre.toLowerCase().includes(search.toLowerCase()))"  height="500"  style="width:auto">
                            <el-table-column prop="nombre" width="300">
                            <template slot="header" slot-scope="scope">
                                <el-input v-model="search" size="mini" placeholder="Filtro por Nombre Empleado">
                            </el-input></template>
                            </el-table-column>
                            <el-table-column label="Motivo" prop="evento" width="240"></el-table-column>
                            <el-table-column label="Justificación" prop="comentario" width="240"></el-table-column>
                            <el-table-column label="Fecha Inicial" prop="fecha_inicial" width="140"></el-table-column>
                            <el-table-column label="Fecha Final" prop="fecha_final" width="140"></el-table-column>
                            <el-table-column label="Total Días" prop="total_dias" width="120"></el-table-column>
                            <el-table-column label="Estatus" prop="estatus1" width="130"></el-table-column>
                            <el-table-column label="Doc. Adjunto" prop="filename" width="160"></el-table-column>
                        </el-table>
                        <div>
                            <el-pagination :total-rows="100" v-model="currentPage" :per-page="10">
                            </el-pagination>
                        </div>

                </el-tab-pane>
                <el-tab-pane label="Vacaciones por Vencer" name="third">

                        <el-table :data="daysToExpire.filter(data => !search || data.nombre.toLowerCase().includes(search.toLowerCase()))"  height="500"  style="width:auto">
                            <el-table-column  prop="nombre" width="250">
                            <template slot="header" slot-scope="scope">
                                <el-input v-model="search" size="mini" placeholder="Filtro por Nombre Empleado">
                            </el-input></template>
                            </el-table-column>
                            <el-table-column label="Fecha de Ingreso" prop="fecha_antiguedad" width="180"></el-table-column>
                            <el-table-column label="Adicionales" prop="dias_adicionales" width="130"></el-table-column>
                            <el-table-column label="Vigencia" prop="fecha_vd_adicionales" width="130"></el-table-column>
                            <el-table-column label="Vacaciones" prop="dias_xvencer" width="130"></el-table-column>
                            <el-table-column label="Vigencia" prop="fecha_vd_xvencer" width="130"></el-table-column>
                        </el-table>
                        <div>
                            <el-pagination :total-rows="100" v-model="currentPage" :per-page="10">
                            </el-pagination>
                        </div>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </section>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import types from '@/types/reports';
import store from '@/main';
    export default {
        name: 'reports',
        data () {
            return {
                currentPage: '',
                activeTab: 'first',
                search: '',
                //vacationTable: [],
                //incidenceTable: [],
                //expireTable:[],
            }
        },
        computed:{
            ...mapGetters({
                vacationReports: types.getters.vacationHistoric,
                incidenceReports: types.getters.incidenceHistoric,
                daysToExpire: types.getters.vacationToExpire
            })
        },
        methods: {
            ...mapActions({
                viewVacations: types.actions.getAllVacaciones,
                viewIncidence: types.actions.getAllIncidences,
                viewToExpire: types.actions.getAllExpire
            }),
            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
        mounted(){
            //Validamos que existan datos antes de solicitarlos al servidor.
            if(Object.keys(this.$store.state.reports.allVacations).length == 0){
                this.viewVacations();
            };
            if(Object.keys(this.$store.state.reports.allIncidencias).length == 0){
                this.viewIncidence();
            };
            if(Object.keys(this.$store.state.reports.toExpire).length == 0){
                this.viewToExpire();
            }
        }


    }

</script>

<style scoped>



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