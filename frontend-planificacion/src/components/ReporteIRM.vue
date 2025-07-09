<template>
  <div class="pagina-fondo">
    <div id="reporteIRM" class="reporte-a4">
      <!-- CABECERA -->
        <header class="reporte-header">
            <div class="header-top">
                <img src="../assets/logo_ventana.png" alt="Logo Municipio" class="logo-municipio" />
                <div class="titulo-municipio">
                <h2>INFORME DE REGULACIÓN MUNICIPAL</h2>
                <p class="entidad">Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</p>
                </div>
            </div>
        </header>


      <!-- CUERPO DEL REPORTE -->
      <main class="reporte-body">
        <!-- INFORMACION CERTIFICADO -->
        <section class="seccion">
          <v-row>
            <v-col cols="6">
              <p><strong>FECHA:</strong> 2025-07-08 12:54:07</p>
            </v-col>
            <v-col cols="6" class="text-end">
              <p><strong>IRM N°:</strong> 11423</p>
            </v-col>
          </v-row>
        </section>  
        <!-- INFORMACION CERTIFICADO -->
        <section class="seccion">
          <v-row>
            <v-col cols="6">
              <p><strong> INFORMACIÓN PREDIAL EN UNIPROPIEDAD</strong> URBANO</p>
            </v-col>
            <v-col cols="6" class="text-end">
              <p><strong> *IMPLANTACIÓN GRÁFICA DEL LOTE</strong></p>
            </v-col>
          </v-row>
        </section>            

        <!-- DATOS DEL TITULAR -->
        <section class="seccion">
          <h3>DATOS DEL TITULAR DE DOMINIO</h3>
          <p><strong>C.C./R.U.C:</strong> 1715583041</p>
          <p><strong>Nombre o razón social:</strong> ALBAREZ GUAILLA JUANA</p>
        </section>

        <!-- DATOS DEL PREDIO -->
        <section class="seccion">
            <v-row>
                <v-col cols="6">
                    <h3>DATOS DEL PREDIO</h3>
                    <p><strong>Clave catastral:</strong> 17025501500100500050000</p>
                    <p><strong>Clave catastral anterior:</strong> 170255150105005000 / 150105005000</p>
                    <p><strong>En derechos y acciones:</strong> NO</p>
                    <p><strong>Área de construcción:</strong> 0.00 m²</p>
                    <h3>DATOS DEL LOTE</h3>
                    <p><strong>Área según escritura:</strong> 0.00 m²</p>
                    <p><strong>Área gráfica:</strong> 1514.60 m²</p>
                    <p><strong>Frente:</strong> 56.00 m</p>
                    <p><strong>Tiene construcción:</strong> NO</p>
                    <p><strong>Parroquia:</strong> SANTA ROSA DE CUZUBAMBA</p>
                    <p><strong>Barrio/Sector:</strong> RUMIÑAHUI</p>
                </v-col>
                <v-col cols="6">
                    <img src="../assets/sin-croquis.png" alt="Sin Croquis" class="croquis-implantacion" />
                </v-col>
            </v-row>
        </section>

        <!-- NOTAS IRM -->
        <section class="seccion">
          <h3>NOTAS IRM</h3>
          <p>- PREDIO SIN ACCESO CATASTRADO</p>
        </section>

        <!-- REGULACIONES -->
        <section class="seccion">
          <h3>REGULACIONES Y ZONIFICACIÓN</h3>
          <p><strong>Zona:</strong> (C3) C2003-80</p>
          <p><strong>Altura máxima:</strong> 9 m</p>
          <p><strong>Número de pisos:</strong> 3</p>
          <p><strong>Frontal:</strong> 3 m</p>
          <p><strong>Lateral 1:</strong> 0 m</p>
          <p><strong>Lateral 2:</strong> 0 m</p>
          <p><strong>Posterior:</strong> 3 m</p>
          <p><strong>Entre bloques:</strong> 6 m</p>
          <p><strong>Forma de ocupación del suelo:</strong> (C) CONTINUA</p>
          <p><strong>Lote mínimo:</strong> 200 m²</p>
          <p><strong>Frente mínimo:</strong> 10 m</p>
          <p><strong>COS PB:</strong> 80.00%</p>
          <p><strong>COS TOTAL:</strong> 240.00%</p>
          <p><strong>Clasificación de suelo:</strong> (SU) SUELO URBANO NO CONSOLIDADO</p>
          <p><strong>Uso de suelo:</strong> (R2A) RESIDENCIAL 2A</p>
        </section>

        <!-- SERVICIOS BÁSICOS -->
        <section class="seccion">
          <h3>COBERTURA DE SERVICIOS BÁSICOS</h3>
          <p><strong>Abastecimiento de agua:</strong> No tiene</p>
          <p><strong>Alcantarillado:</strong> No tiene</p>
          <p><strong>Energía eléctrica:</strong> No tiene</p>
          <p><strong>Otros:</strong> Transporte público</p>
        </section>

        <!-- NOTAS FINALES -->
        <section class="seccion texto-legal">
          <h3>NOTAS</h3>
          <ul>
            <li>Los datos están referidos al Plan de Uso y Ocupación del Suelo vigente.</li>
            <li>La información consta en los archivos catastrales del GAD.</li>
            <li>Este informe no representa título legal alguno.</li>
            <li>No autoriza trabajos de construcción ni fraccionamientos.</li>
            <li>Validez de 2 años a partir de su emisión.</li>
            <li>Volado a calle máximo 60 cm.</li>
            <li>Radio de curvatura en esquinas: 3,00 m.</li>
            <li>Predios colindantes a Panamericana E35-E28: acera de 2.50 m desde cuneta.</li>
          </ul>
        </section>
      </main>

      <!-- PIE DE PÁGINA -->
      <footer class="reporte-footer">
        <p>Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</p>
        <p>Dirección de Planificación y Ordenamiento Territorial</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReporteIRM'
}
</script>

<style scoped>
/* Fondo gris fuera del reporte */
.pagina-fondo {
  background-color: #f0f0f0;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

/* Contenedor del reporte */
.reporte-a4 {
  background: white;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  color: #000;
}

/* Cabecera */
.reporte-header {
  margin-bottom: 15px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-municipio {
  width: 60px;
  height: auto;
}

.croquis-implantacion {
  width: 100%;
  height: 280px;
}

.titulo-municipio {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.titulo-municipio h2 {
  margin: 0;
  font-size: 16px;
}

.titulo-municipio .entidad {
  font-size: 12px;
  margin-top: 4px;
}

.reporte-info {
  text-align: right;
  font-size: 12px;
  min-width: 120px;
}
/* Secciones */
.seccion {
  margin-bottom: 15px;
}

.seccion h3 {
  font-size: 14px;
  margin-bottom: 6px;
  border-bottom: 1px solid #ccc;
}

.seccion p {
  margin: 2px 0;
}

ul {
  margin: 0;
  padding-left: 16px;
}

ul li {
  font-size: 12px;
  margin-bottom: 4px;
}

/* Pie de página */
.reporte-footer {
  text-align: center;
  font-size: 12px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 20px;
}

/* Estilos para impresión */
@media print {
  .pagina-fondo {
    background-color: white !important;
    padding: 0 !important;
  }

  .reporte-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
    padding: 0;
    margin: 0;
  }

  .reporte-footer,
  .reporte-header {
    position: fixed;
    left: 0;
    right: 0;
  }

  .reporte-header {
    top: 0;
  }

  .reporte-footer {
    bottom: 0;
  }

  .reporte-body {
    margin-top: 100px;
    margin-bottom: 80px;
  }
}
</style>
