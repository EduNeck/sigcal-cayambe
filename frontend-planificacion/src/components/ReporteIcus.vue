<template>
  <div class="reporte-icus compacto">
    <!-- Indicador de carga -->
    <div v-if="cargando" class="loading-indicator">
      <p>Cargando datos del ICUS...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="error-container">
      <div class="error-icon"></div>
      <p>{{ error }}</p>
      <button @click="cargarDatosIcus" class="retry-button">
        Reintentar
      </button>
    </div>

    <!-- Reporte principal -->
    <div v-if="!cargando && !error">
      <!-- Header del reporte -->
      <div class="reporte-header">
        <div class="header-content">
          <img 
            src="@/assets/logo_ventana.png" 
            alt="Logo Cayambe" 
            class="logo"
          />
          <div class="header-text">
            <h1 class="titulo-principal titulo-compacto">
              INFORME DE COMPATIBILIDAD DE USOS DE SUELO
            </h1>
            <h2 class="subtitulo subtitulo-compacto">
              Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe
            </h2>
          </div>
        </div>
        
        <!-- Fecha del informe arriba -->
        <div class="fecha-informe-header">
          <div class="fecha-contenedor">
            <label>Fecha del Informe:</label>
            <span class="fecha-valor">{{ fechaReporte }}</span>
          </div>
          <!-- Número ICUS debajo de la fecha -->
          <div class="icus-numero-header">
            <span class="icus-numero-principal">ICUS N° {{ datosFinales.id || 'S/N' }}</span>
          </div>
        </div>
      </div>

      <!-- Contenido del reporte -->
      <div class="reporte-contenido">
        <!-- BLOQUE 1 -->
        <div class="bloque-reporte bloque-1">
          <div class="bloque-grid">
            <!-- Sección: Información Predial en Unipropiedad -->
            <div class="seccion informacion-predial">
              <div class="seccion-header">
                <div class="fecha-reporte">
                  {{ fechaReporte }}
                </div>
              </div>
              <h3>INFORMACIÓN PREDIAL EN UNIPROPIEDAD</h3>
              
              <!-- DATOS DEL TITULAR DE DOMINIO -->
              <div class="subseccion">
                <h4>DATOS DEL TITULAR DE DOMINIO</h4>
                <div class="campo-grupo" v-if="datosFinales.numero_documento">
                  <label>C.C./RUC:</label>
                  <span>{{ datosFinales.numero_documento }}</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.propietario">
                  <label>Nombre / Razón Social:</label>
                  <span>{{ datosFinales.propietario }}</span>
                </div>
              </div>

              <!-- DATOS DEL PREDIO -->
              <div class="subseccion">
                <h4>DATOS DEL PREDIO</h4>
                <div class="campo-grupo" v-if="datosFinales.clave_catastral">
                  <label>Clave Catastral:</label>
                  <span>{{ datosFinales.clave_catastral }}</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.clave_anterior">
                  <label>Clave Catastral Anterior:</label>
                  <span>{{ datosFinales.clave_anterior }}</span>
                </div>

                <div class="campo-grupo" v-if="datosFinales.derechos_acciones">
                  <label>En Derechos y Acciones:</label>
                  <span>{{ datosFinales.derechos_acciones }}%</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.area_construccion">
                  <label>Área de Construcción:</label>
                  <span>{{ formatearArea(datosFinales.area_construccion) }} m²</span>
                </div>
              </div>

              <!-- DATOS DEL LOTE -->
              <div class="subseccion">
                <h4>DATOS DEL LOTE</h4>
                <div class="campo-grupo" v-if="datosFinales.area_escritura">
                  <label>Área según Escritura:</label>
                  <span>{{ formatearArea(datosFinales.area_escritura) }} m²</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.area_gis">
                  <label>Área Gráfica:</label>
                  <span>{{ formatearArea(datosFinales.area_gis) }} m²</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.frente">
                  <label>Frente:</label>
                  <span>{{ formatearArea(datosFinales.frente) }} m</span>
                </div>

                <div class="campo-grupo" v-if="datosFinales.nombre_parroquia">
                  <label>Parroquia:</label>
                  <span>{{ datosFinales.nombre_parroquia }}</span>
                </div>
                
                <div class="campo-grupo" v-if="datosFinales.sector">
                  <label>Barrio/Sector:</label>
                  <span>{{ datosFinales.sector }}</span>
                </div>
              </div>
            </div>

            <!-- Sección: Implantación Gráfica del Lote -->
            <div class="seccion implantacion-grafica">
              <h3>IMPLANTACIÓN GRÁFICA DEL LOTE</h3>
              
              <div class="mapa-container">
                <div v-if="datosFinales.geometria_geojson" class="mapa-placeholder">
                  <p>Mapa del predio</p>
                  <span>{{ datosFinales.clave_catastral || 'Sin clave catastral' }}</span>
                </div>
                <div v-else class="sin-geometria">
                  <p>Sin información geográfica</p>
                </div>
              </div>

              <div class="coordenadas-info" v-if="datosFinales.geometria_geojson">
                <small>Coordenadas disponibles en formato GeoJSON</small>
              </div>
            </div>
          </div>
        </div>

        <!-- BLOQUE 2 -->
        <div class="bloque-reporte bloque-2">
          <div class="seccion compatibilidad-uso-suelo">
            <h3>COMPATIBILIDAD DE USO DE SUELO</h3>
            
            <!-- INFORME DE COMPATIBILIDAD -->
            <div class="subseccion informe-compatibilidad">
              <h4>INFORME DE COMPATIBILIDAD</h4>
              <div class="campo-grupo resultado-principal" v-if="datosFinales.resultado_informe">
                <label>Resultado del Informe:</label>
                <span class="resultado-texto">
                  {{ datosFinales.resultado_informe }}
                </span>
              </div>
            </div>

            <!-- DETALLES DE USO -->
            <div class="subseccion detalles-uso">
              <div class="campo-grupo" v-if="datosFinales.id_actividad || datosFinales.actividad">
                <label>Actividad:</label>
                <span>
                  <span v-if="datosFinales.id_actividad" class="codigo-campo">[{{ datosFinales.id_actividad }}]</span>
                  {{ datosFinales.actividad }}
                </span>
              </div>
              
              <div class="campo-grupo" v-if="datosFinales.id_suelo || datosFinales.uso_suelo">
                <label>Uso de Suelo:</label>
                <span>
                  <span v-if="datosFinales.id_suelo" class="codigo-campo">[{{ datosFinales.id_suelo }}]</span>
                  {{ datosFinales.uso_suelo }}
                </span>
              </div>
              
              <div class="campo-grupo" v-if="datosFinales.id_tipologia || datosFinales.tipologia">
                <label>Tipología:</label>
                <span>
                  <span v-if="datosFinales.id_tipologia" class="codigo-campo">[{{ datosFinales.id_tipologia }}]</span>
                  {{ datosFinales.tipologia }}
                </span>
              </div>
              
              <div class="campo-grupo" v-if="datosFinales.compatibilidad">
                <label>Compatibilidad:</label>
                <span :class="getCompatibilidadClass(datosFinales.compatibilidad)">
                  {{ datosFinales.compatibilidad }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- BLOQUE 3 -->
        <div class="bloque-reporte bloque-3">
          <div class="seccion observaciones-final">
            <div class="notas-info" v-if="datosFinales.notas">
              <h3>NOTAS ADICIONALES</h3>
              <div class="notas-contenido">
                {{ datosFinales.notas }}
              </div>
            </div>

            <!-- Código QR -->
            <div class="qr-info" v-if="qrCodeDataUrl">
              <h4>CÓDIGO QR DE VERIFICACIÓN</h4>
              <div class="qr-container">
                <img :src="qrCodeDataUrl" alt="Código QR del ICUS" class="qr-code" />
              </div>
            </div>

            <div class="fecha-usuario-info">
              <div class="info-grid">
                <div class="campo-grupo" v-if="datosFinales.usuario">
                  <label>Responsable:</label>
                  <span>{{ datosFinales.usuario }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- /reporte-contenido -->
    </div> <!-- /!cargando && !error -->

    <!-- Footer del reporte -->
    <div class="reporte-footer">
      <p>
        Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe<br>
        Dirección de Planificación y Ordenamiento Territorial
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import QRCode from 'qrcode'
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ReporteIcus',
  props: {
    datosIcus: { type: Object, default: () => ({}) },
    icusId: { type: [String, Number], default: 15 }
  },
  data() {
    return { datosIcusLocal: {}, cargando: false, error: null, qrCodeDataUrl: null }
  },
  computed: {
    fechaReporte() {
      if (this.datosFinales.fecha) return this.formatearFecha(this.datosFinales.fecha)
      return this.formatearFecha('2024-08-13')
    },
    datosFinales() {
      return Object.keys(this.datosIcus).length > 0 ? this.datosIcus : this.datosIcusLocal
    },
    textoQR() {
      const datos = this.datosFinales
      const fecha = this.fechaReporte.replace(/\s+/g, '-')
      return ['ICUS', fecha, datos.id || 'S/N', datos.clave_catastral || 'Sin-clave', (datos.propietario || 'Sin-propietario').substring(0, 50)].join('|')
    }
  },
  mounted() {
    if (this.icusId && !Object.keys(this.datosIcus).length) this.cargarDatosIcus(this.icusId)
    this.$nextTick(() => { this.generarQR() })
  },
  watch: {
    icusId(newId) { if (newId && !Object.keys(this.datosIcus).length) this.cargarDatosIcus(newId) },
    textoQR() { this.generarQR() }
  },
  methods: {
    async cargarDatosIcus(id) {
      this.cargando = true; this.error = null
      try {
        const { data } = await axios.get(`${API_BASE_URL}/icus/recuperarIcus/${id}`)
        this.datosIcusLocal = data
        this.$nextTick(() => this.generarQR())
      } catch (error) {
        this.error = 'Error al cargar los datos del ICUS'
        if (error.response) {
          if (error.response.status === 404) this.error = 'ICUS no encontrado'
          else if (error.response.status === 500) this.error = 'Error interno del servidor'
        } else if (error.request) this.error = 'No se pudo conectar con el servidor'
      } finally { this.cargando = false }
    },

    async cargarListaIcus(page = 1, limit = 10, search = '') {
      this.cargando = true; this.error = null
      try {
        const { data } = await axios.get(`${API_BASE_URL}/icus/recuperarIcus`, { params: { page, limit, search } })
        return data
      } catch (e) { this.error = 'Error al cargar la lista de ICUS'; throw e }
      finally { this.cargando = false }
    },

    formatearArea(v){ if(!v) return '-'; return Number(v).toFixed(2) },
    formatearFecha(f){ if(!f) return '-'; return new Date(f).toLocaleDateString('es-EC',{year:'numeric',month:'long',day:'numeric'}) },
    getCompatibilidadClass(c){
      if(!c) return ''
      const comp = c.toLowerCase()
      if (comp.includes('no compatible')) return 'no-compatible'
      if (comp.includes('compatible')) return 'compatible'
      if (comp.includes('condicion')) return 'condicionado'
      return ''
    },

    imprimirReporte(){ window.print() },
    async generarQR(){
      try{
        if(this.textoQR){
          this.qrCodeDataUrl = await QRCode.toDataURL(this.textoQR,{ width:96, margin:0 })
        }
      }catch(e){ this.qrCodeDataUrl=null }
    }
  }
}
</script>

<style scoped>
/* ===== Escala compacta global ===== */
.compacto {
  --pad-xl: 10mm;   
  --pad-lg: 12px;
  --pad-md: 8px;
  --pad-sm: 4px;
  --gap-lg: 12px;
  --gap-md: 8px;
  --gap-sm: 6px;
  --fs-base: 11px;  
  --fs-small: 9.5px;
  --fs-xs: 9px;
  --line: 1.25;
  --border: 1px;
}

.reporte-icus {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: var(--pad-xl);
  background: #fff;
  font-family: Arial, sans-serif;
  font-size: var(--fs-base);
  line-height: var(--line);
  color: #333;
  box-sizing: border-box;
}

/* Header */
.reporte-header {
  border-bottom: 2px solid #1e40af; /* antes 3px */
  padding-bottom: 6mm;               /* antes 15mm */
  margin-bottom: 8mm;                /* antes 20mm */
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--gap-md); /* antes 15mm */
}

.logo { width: 46px; height: 46px; object-fit: contain; flex-shrink: 0; }

.header-text { flex: 1; }

.titulo-principal {
  font-size: 15px; /* antes 18px */
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 4px 0;
  text-align: center;
  line-height: 1.15;
}
.subtitulo {
  font-size: 12px; /* antes 14px */
  font-weight: 400;
  color: #374151;
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

/* Fecha header */
.fecha-informe-header { 
    margin-top: 6px; 
    padding-top: 6px; 
    border-top: 1px solid #e5e7eb; 
}
.fecha-contenedor { 
    display: flex; 
    justify-content: flex-end; 
    align-items: center; 
    gap: 6px; 
}
.fecha-contenedor label { 
    font-weight: 700; 
    color: #374151; 
    font-size: var(--fs-small); 
}
.fecha-valor { 
    background: #f3f4f6; 
    padding: 3px 8px; 
    border-radius: 3px; 
    border: 1px solid #d1d5db; 
    font-weight: 700; 
    color: #1f2937; 
    font-size: var(--fs-small); 
}

/* Número ICUS en header */
.icus-numero-header {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  padding-top: 8px;
}

.icus-numero-principal {
  background-color: #059669;
  color: white;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Contenido */
.reporte-contenido { 
    margin-bottom: 8mm; 
}

/* Bloques */
.bloque-reporte { 
    margin-bottom: 8mm; 
    page-break-inside: avoid; 
}
.bloque-1 {
  border: var(--border) solid #c7d2fe; 
  border-radius: 6px;
  padding: var(--pad-lg);
  background-color: #f8fafc;
}
.bloque-2, .bloque-3, .bloque-4 {
  border: var(--border) solid #e5e7eb;
  border-radius: 6px;
  padding: var(--pad-md);
  background-color: #fafafa;
}

/* Grid Bloque 1 */
.bloque-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-lg); /* antes 20px */
}

/* Secciones */
.seccion {
  background: #fff;
  border-radius: 6px;
  padding: var(--pad-md);
  border: var(--border) solid #e5e7eb;
  position: relative;
}

/* Headers de sección */
.seccion-header { 
    position: absolute; 
    top: -12px; 
    right: 8px; 
    z-index: 2; 
}
.fecha-reporte, .icus-numero {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .3px;
}
.fecha-reporte { 
    background: #1e40af; 
    color: #fff; 
}
.icus-numero    { 
    background: #059669; 
    color: #fff; 
}

/* Títulos */
h3 {
  font-size: 12px; /* antes 14px */
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px 0; /* antes 15px */
  padding-bottom: 2px;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: .4px;
}
.subseccion { 
    margin-bottom: 8px; 
    padding: 6px; 
    background: #fafcff; 
    border: 1px solid #e2e8f0; 
    border-radius: 4px; 
}
.subseccion h4 {
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 6px 0;
  padding-bottom: 2px;
  border-bottom: 1px solid #cbd5e1;
  text-transform: uppercase;
  letter-spacing: .2px;
}

/* Campos */
.campo-grupo { 
    display: flex; 
    margin-bottom: 4px; 
    align-items: flex-start; 
}
.campo-grupo label { 
    font-weight: 700; 
    color: #374151; 
    
    min-width: 130px; 
    margin-right: 8px; 
    font-size: var(--fs-small); 
}
.campo-grupo span  { 
    flex: 1; 
    color: #1f2937; 
    font-size: var(--fs-small); 
}

/* Mapa */
.mapa-container {
  min-height: 150px; /* antes 200px */
  border: 1px dashed #d1d5db; /* antes 2px */
  border-radius: 6px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f3f4f6;
  margin: 6px 0; /* antes 10px */
}
.mapa-placeholder p { 
    margin: 0 0 4px 0; 
    font-weight: 700; 
    font-size: 12px; 
}
.mapa-placeholder span { 
    font-size: var(--fs-small); 
    color: #374151; 
}
.sin-geometria { 
    text-align: center; 
    color: #9ca3af; 
    font-style: italic; 
}
.coordenadas-info { 
    text-align: center; 
    color: #6b7280; 
    font-size: 9px; 
    margin-top: 4px; 
}

/* Grids pequeños */
.areas-predial, .areas-grid, .info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-sm);
}

/* Compatibilidad */
.compatibilidad span { 
    padding: 2px 5px; 
    border-radius: 3px; 
    font-weight: 700; 
    font-size: var(--fs-small); 
}
.compatible { 
    background: #dcfce7; 
    color: #166534; 
}
.no-compatible { 
    background: #fecaca; 
    color: #dc2626; 
}
.condicionado { 
    background: #fef3c7; 
    color: #d97706; 
}

/* Notas */
.notas-contenido {
  padding: 8px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.35;
  font-size: var(--fs-small);
}

/* QR */
.qr-info { 
    margin-top: 10px; 
    padding: 10px; 
    background: #f8fafc; 
    border: 1px solid #e2e8f0; 
    border-radius: 6px; 
    text-align: center; 
}
.qr-info h4 { 
    font-size: 11px; 
    font-weight: 700; 
    color: #374151; 
    margin: 0 0 6px 0; 
    text-transform: uppercase; 
    letter-spacing: .3px; 
}
.qr-container { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 6px; 
}
.qr-code { 
    width: 96px; 
    height: 96px; 
    border: 1px solid #e5e7eb; 
    border-radius: 4px; 
    background: #fff; 
    padding: 4px; 
}
.qr-descripcion { 
    max-width: 280px; 
    word-break: break-all; 
    color: #6b7280; 
    font-size: 8.5px; 
    line-height: 1.25; 
}

/* Footer */
.reporte-footer {
  border-top: 1px solid #1e40af; /* antes 2px */
  padding-top: 6mm;               /* antes 10mm */
  text-align: center;
  color: #6b7280;
  font-size: 10px;
  position: fixed;
  bottom: 12mm; left: var(--pad-xl); right: var(--pad-xl);
}
.reporte-footer p { margin: 0; line-height: 1.3; }

/* Impresión */
@media print {
  @page { size: A4; margin: 12mm; } /* antes 15mm */
  .reporte-icus { 
    width: 100%; 
    min-height: auto; 
    margin: 0; 
    padding: 0; 
    box-shadow: none; 
    font-size: 10.5px; 
}
  .reporte-header { 
    page-break-after: avoid; 
    margin-bottom: 8mm; 
    padding-bottom: 5mm; 
}
  .fecha-informe-header { 
    margin-top: 4px; 
    padding-top: 4px; 
    border-top: 1px solid #000!important; 
  }
  .fecha-contenedor { justify-content: center; }
  .fecha-valor { 
    border: 1px solid #000!important; 
    background: #f0f0f0!important; 
    -webkit-print-color-adjust: exact; 
    print-color-adjust: exact; 
}

  /* Número ICUS en impresión */
  .icus-numero-header {
    justify-content: center;
    margin-top: 6px;
    padding-top: 4px;
  }

  .icus-numero-principal {
    background-color: #059669 !important;
    color: white !important;
    border: 1px solid #000 !important;
    font-size: 11px !important;
    padding: 4px 12px !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .logo { 
    width: 40px; 
    height: 40px; 
  }
  .titulo-principal { 
    font-size: 14px; 
  }
  .subtitulo { 
    font-size: 11px; 
  }
  .bloque-reporte { 
    page-break-inside: avoid; 
    margin-bottom: 8mm; 
  }
  .bloque-1 { 
    border: 1px solid #1e40af; 
    padding: 8px; 
  }
  .bloque-grid { 
    grid-template-columns: 1fr 1fr; 
    gap: 10px; 
  }
  .mapa-container { 
    min-height: 120px; 
  }
  .fecha-reporte, .icus-numero { 
    font-size: 9px; 
    padding: 2px 6px; 
  }
  .seccion-header { 
    top: -10px; 
    right: 6px; 
  }
  .subseccion { 
    margin-bottom: 6px; 
    padding: 6px; 
    page-break-inside: avoid; 
  }
  .subseccion h4 { 
    font-size: 10px; 
    margin-bottom: 4px; 
  }
  .campo-grupo { 
    margin-bottom: 3px; 
  }
  .campo-grupo label { 
    font-size: 8.5px; 
    min-width: 110px; 
  }
  .campo-grupo span { 
    font-size: 8.5px; 
  }
  .resultado-texto { 
    font-size: 10.5px!important; 
  }
  .qr-info { 
    page-break-inside: avoid; 
    border: 1px solid #000!important; 
    -webkit-print-color-adjust: exact; 
    print-color-adjust: exact; 
  }
  .qr-code { 
    width: 88px!important; 
    height: 88px!important; 
    border: 1px solid #000!important; 
  }
  .qr-descripcion { 
    font-size: 8px!important; 
    color: #000!important; 
  }
  .reporte-footer { 
    position: fixed; 
    bottom: 8mm; 
    left: 0; 
    right: 0; 
    padding: 4mm 12mm; 
  }
}

/* Pantalla */
@media screen {
  .reporte-icus { 
    box-shadow: 0 3px 10px rgba(0,0,0,.08); 
    margin: 16px auto; 
  }
  .reporte-footer { 
    position: relative; 
    bottom: auto; 
    left: auto; 
    right: auto; 
  }
}

/* Sección de compatibilidad (look liviano) */
.compatibilidad-uso-suelo { 
    background: #f8f9fa; 
    border-left: 3px solid #0ea5e9; 
}
.informe-compatibilidad { 
    background: #eef6ff; 
    padding: 10px; 
    margin-bottom: 8px; 
    border-radius: 6px; 
    border: 1px solid #cfe8ff; 
}
.resultado-principal label { 
    font-weight: 700; 
    font-size: 12px; 
    color: #495057; 
    display: block; 
    margin-bottom: 6px; 
}
.resultado-texto { 
    font-size: 12px; 
    line-height: 1.35; 
    color: #374151; 
    background: #f8f9fa; 
    padding: 8px; 
    border-radius: 4px; 
    border: 1px solid #dee2e6; 
    display: block; 
    white-space: pre-wrap; 
}

/* Estados de error (sin cambios funcionales) */
.error-container { 
    text-align: center; 
    padding: 24px; 
    color: #e74c3c; 
    background: #fdf2f2; 
    border: 1px solid #fecaca; 
    border-radius: 6px; 
    margin: 12px; 
}
.error-container .error-icon { 
    font-size: 40px; 
    margin-bottom: 12px; 
}
.error-container .retry-button { 
    margin-top: 10px; 
    padding: 8px 16px; 
    background: #3498db; 
    color: #fff; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer; 
}
.error-container .retry-button:hover { 
    background: #2980b9; 
}
</style>
