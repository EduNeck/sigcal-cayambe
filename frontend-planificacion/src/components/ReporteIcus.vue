<template>
  <div class="reporte-icus">
    <!-- Indicador de carga -->
    <div v-if="cargando" class="loading-indicator">
      <p>Cargando datos del ICUS...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
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
            <h1 class="titulo-principal">
              INFORME DE COMPATIBILIDAD DE USOS DE SUELO
            </h1>
            <h2 class="subtitulo">
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
            <div class="seccion-header">
              <div class="icus-numero">
                ICUS N° {{ datosFinales.id || 'S/N' }}
              </div>
            </div>
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
              <div class="qr-descripcion">
                <small>{{ textoQR }}</small>
              </div>
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
    </div>
  </div>

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

export default {
  name: 'ReporteIcus',
  props: {
    datosIcus: {
      type: Object,
      default: () => ({})
    },
    icusId: {
      type: [String, Number],
      default: 15
    }
  },
  data() {
    return {
      datosIcusLocal: {},
      cargando: false,
      error: null,
      qrCodeDataUrl: null
    }
  },
  computed: {
    fechaReporte() {
      // Si hay fecha en los datos, la usamos; sino usamos fecha por defecto del reporte
      if (this.datosFinales.fecha) {
        return this.formatearFecha(this.datosFinales.fecha)
      }
      // Fecha por defecto del reporte: 13 de agosto de 2024
      return this.formatearFecha('2024-08-13')
    },
    datosFinales() {
      // Si hay datos pasados como prop, usarlos; si no, usar los datos cargados
      return Object.keys(this.datosIcus).length > 0 ? this.datosIcus : this.datosIcusLocal
    },

    textoQR() {
      // Formato: ICUS|fecha-reporte|id_predio|clave_catastral|propietario
      const datos = this.datosFinales
      const fecha = this.fechaReporte.replace(/\s+/g, '-') // Reemplazar espacios con guiones
      
      return [
        'ICUS',
        fecha,
        datos.id || 'S/N',
        datos.clave_catastral || 'Sin-clave',
        (datos.propietario || 'Sin-propietario').substring(0, 50) // Limitar longitud
      ].join('|')
    }
  },
  mounted() {
    if (this.icusId && !Object.keys(this.datosIcus).length) {
      this.cargarDatosIcus(this.icusId)
    }
    // Generar QR code inicial
    this.$nextTick(() => {
      this.generarQR()
    })
  },
  watch: {
    icusId(newId) {
      if (newId && !Object.keys(this.datosIcus).length) {
        this.cargarDatosIcus(newId)
      }
    },
    
    textoQR() {
      // Regenerar QR cuando cambien los datos
      this.generarQR()
    }
  },
  methods: {
    async cargarDatosIcus(id) {
      this.cargando = true
      this.error = null
      
      try {
        const response = await axios.get(`http://localhost:4001/api/icus/recuperarIcus/${id}`)
        this.datosIcusLocal = response.data
        console.log('Datos ICUS cargados:', response.data)
        
        // Generar QR code después de cargar datos
        this.$nextTick(() => {
          this.generarQR()
        })
      } catch (error) {
        console.error('Error al cargar datos ICUS:', error)
        this.error = 'Error al cargar los datos del ICUS'
        
        // Mostrar mensaje de error más específico
        if (error.response) {
          if (error.response.status === 404) {
            this.error = 'ICUS no encontrado'
          } else if (error.response.status === 500) {
            this.error = 'Error interno del servidor'
          }
        } else if (error.request) {
          this.error = 'No se pudo conectar con el servidor'
        }
      } finally {
        this.cargando = false
      }
    },

    async cargarListaIcus(page = 1, limit = 10, search = '') {
      this.cargando = true
      this.error = null
      
      try {
        const response = await axios.get('http://localhost:4001/api/icus/recuperarIcus', {
          params: { page, limit, search }
        })
        return response.data
      } catch (error) {
        console.error('Error al cargar lista de ICUS:', error)
        this.error = 'Error al cargar la lista de ICUS'
        throw error
      } finally {
        this.cargando = false
      }
    },

    formatearArea(valor) {
      if (!valor) return '-'
      return Number(valor).toFixed(2)
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '-'
      return new Date(fecha).toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    getCompatibilidadClass(compatibilidad) {
      if (!compatibilidad) return ''
      const comp = compatibilidad.toLowerCase()
      if (comp.includes('compatible')) return 'compatible'
      if (comp.includes('no compatible')) return 'no-compatible'
      if (comp.includes('condicionado')) return 'condicionado'
      return ''
    },
    
    imprimirReporte() {
      window.print()
    },

    async generarQR() {
      try {
        if (this.textoQR) {
          this.qrCodeDataUrl = await QRCode.toDataURL(this.textoQR, {
            width: 120,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
        }
      } catch (error) {
        console.error('Error al generar QR code:', error)
        this.qrCodeDataUrl = null
      }
    }
  }
}
</script>

<style scoped>
.reporte-icus {
  /* Tamaño A4: 210mm x 297mm */
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  background: white;
  font-family: 'Arial', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  box-sizing: border-box;
}

/* Header del reporte */
.reporte-header {
  border-bottom: 3px solid #1e40af;
  padding-bottom: 15mm;
  margin-bottom: 20mm;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15mm;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.titulo-principal {
  font-size: 18px;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 8px 0;
  text-align: center;
  line-height: 1.2;
}

.subtitulo {
  font-size: 14px;
  font-weight: normal;
  color: #374151;
  margin: 0;
  text-align: center;
  line-height: 1.3;
}

/* Fecha en el header */
.fecha-informe-header {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.fecha-contenedor {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.fecha-contenedor label {
  font-weight: bold;
  color: #374151;
  font-size: 12px;
}

.fecha-valor {
  background-color: #f3f4f6;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-weight: bold;
  color: #1f2937;
  font-size: 12px;
}

/* Contenido del reporte */
.reporte-contenido {
  margin-bottom: 30mm;
}

/* Estilos para los 4 bloques */
.bloque-reporte {
  margin-bottom: 20mm;
  page-break-inside: avoid;
}

.bloque-1 {
  border: 2px solid #1e40af;
  border-radius: 8px;
  padding: 15px;
  background-color: #f8fafc;
}

.bloque-2,
.bloque-3,
.bloque-4 {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  background-color: #f9fafb;
}

/* Grid para el Bloque 1 - Dos secciones lado a lado */
.bloque-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Secciones dentro de los bloques */
.seccion {
  background-color: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  position: relative;
}

/* Headers de las secciones */
.seccion-header {
  position: absolute;
  top: -15px;
  right: 10px;
  z-index: 2;
}

.fecha-reporte {
  background-color: #1e40af;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

.icus-numero {
  background-color: #059669;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.informacion-predial {
  border-left: 4px solid #3b82f6;
}

.implantacion-grafica {
  border-left: 4px solid #059669;
}

/* Área de mapa */
.mapa-container {
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  margin: 10px 0;
}

.mapa-placeholder {
  text-align: center;
  color: #6b7280;
}

.mapa-placeholder p {
  margin: 0 0 5px 0;
  font-weight: bold;
  font-size: 14px;
}

.mapa-placeholder span {
  font-size: 12px;
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
  font-size: 10px;
  margin-top: 5px;
}

/* Áreas del predio */
.areas-predial {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

/* Grid de información final */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-general,
.ubicacion-info,
.areas-info,
.uso-suelo-info,
.notas-info,
.fecha-info {
  margin-bottom: 15mm;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
  page-break-inside: avoid;
}

h3 {
  font-size: 14px;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 15px 0;
  padding-bottom: 3px;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Subsecciones dentro de la información predial */
.subseccion {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.subseccion h4 {
  font-size: 12px;
  font-weight: bold;
  color: #374151;
  margin: 0 0 8px 0;
  padding-bottom: 2px;
  border-bottom: 1px solid #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.campo-grupo {
  display: flex;
  margin-bottom: 6px;
  align-items: flex-start;
}

.campo-grupo label {
  font-weight: bold;
  color: #374151;
  min-width: 140px;
  margin-right: 10px;
  font-size: 10px;
}

.campo-grupo span {
  flex: 1;
  color: #1f2937;
  font-size: 10px;
}

.areas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* Compatibilidad colores */
.compatibilidad span {
  padding: 3px 6px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 11px;
}

.compatible {
  background-color: #dcfce7;
  color: #166534;
}

.no-compatible {
  background-color: #fecaca;
  color: #dc2626;
}

.condicionado {
  background-color: #fef3c7;
  color: #d97706;
}

/* Notas */
.notas-contenido {
  padding: 10px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 11px;
}

/* Código QR */
.qr-info {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
}

.qr-info h4 {
  font-size: 12px;
  font-weight: bold;
  color: #374151;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-code {
  width: 120px;
  height: 120px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  padding: 5px;
}

.qr-descripcion {
  max-width: 300px;
  word-break: break-all;
  color: #6b7280;
  font-size: 9px;
  line-height: 1.3;
}

/* Footer del reporte */
.reporte-footer {
  border-top: 2px solid #1e40af;
  padding-top: 10mm;
  text-align: center;
  color: #6b7280;
  font-size: 11px;
  position: fixed;
  bottom: 15mm;
  left: 20mm;
  right: 20mm;
}

.reporte-footer p {
  margin: 0;
  line-height: 1.4;
}

/* Estilos para impresión A4 */
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }
  
  .reporte-icus {
    width: 100%;
    min-height: auto;
    margin: 0;
    padding: 0;
    box-shadow: none;
    font-size: 11px;
  }
  
  .reporte-header {
    page-break-after: avoid;
    margin-bottom: 15mm;
    padding-bottom: 10mm;
  }
  
  .fecha-informe-header {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #000 !important;
  }

  .fecha-contenedor {
    justify-content: center;
  }

  .fecha-valor {
    border: 1px solid #000 !important;
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .titulo-principal {
    font-size: 16px;
  }
  
  .subtitulo {
    font-size: 12px;
  }
  
  .bloque-reporte {
    page-break-inside: avoid;
    margin-bottom: 15mm;
  }
  
  .bloque-1 {
    border: 2px solid #1e40af;
    padding: 10px;
  }
  
  .bloque-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .mapa-container {
    min-height: 150px;
  }
  
  .areas-predial {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }
  
  .fecha-reporte,
  .icus-numero {
    font-size: 10px;
    padding: 3px 8px;
  }
  
  .seccion-header {
    top: -12px;
    right: 8px;
  }

  .subseccion {
    margin-bottom: 10px;
    padding: 8px;
    page-break-inside: avoid;
  }

  .subseccion h4 {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .campo-grupo {
    margin-bottom: 4px;
  }

  .campo-grupo label {
    font-size: 9px;
    min-width: 120px;
  }

  .campo-grupo span {
    font-size: 9px;
  }
  
  .info-general,
  .ubicacion-info,
  .areas-info,
  .compatibilidad-uso-suelo {
    page-break-inside: avoid;
    margin-bottom: 10mm;
    padding: 8px;
  }
  
  .notas-info {
    page-break-inside: avoid;
  }
  
  .reporte-footer {
    position: fixed;
    bottom: 10mm;
    left: 0;
    right: 0;
    padding: 5mm 15mm;
  }
}

@media screen {
  .reporte-icus {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-height: none;
  }
  
  .reporte-footer {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
  }
}

/* Optimización para contenido extenso en A4 */
@media print {
  .informe-compatibilidad {
    background-color: #f0f8ff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid #000 !important;
    page-break-inside: avoid;
  }

  .resultado-texto {
    background-color: #f8f9fa !important;
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 11px !important;
  }

  .detalles-uso {
    border: 1px solid #000 !important;
    page-break-inside: avoid;
  }

  .codigo-campo {
    color: #333 !important;
    font-weight: bold;
  }

  .compatible {
    background-color: #e8f5e8 !important;
    color: #2d5a2d !important;
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .no-compatible {
    background-color: #ffe8e8 !important;
    color: #8b2635 !important;
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .condicional {
    background-color: #fff8e1 !important;
    color: #8b6914 !important;
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .areas-info {
    break-inside: avoid;
  }
  
  .compatibilidad-uso-suelo {
    break-inside: avoid;
  }
  
  .notas-contenido {
    font-size: 10px;
    line-height: 1.4;
  }

  /* QR Code para impresión */
  .qr-info {
    page-break-inside: avoid;
    background-color: #f8fafc !important;
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .qr-code {
    width: 100px !important;
    height: 100px !important;
    border: 1px solid #000 !important;
  }

  .qr-descripcion {
    font-size: 8px !important;
    color: #000 !important;
  }
}

/* Compatibilidad específica */
.compatibilidad-uso-suelo {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
}

.informe-compatibilidad {
  background-color: #e8f4fd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #bee5eb;
}

.compatibilidad-principal {
  text-align: center;
}

.resultado-principal {
  text-align: left;
}

.resultado-principal label {
  font-weight: bold;
  font-size: 14px;
  color: #495057;
  display: block;
  margin-bottom: 8px;
}

.resultado-texto {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  display: block;
  white-space: pre-wrap;
}

.compatibilidad-principal label {
  font-weight: bold;
  font-size: 14px;
  color: #495057;
  display: block;
  margin-bottom: 8px;
}

.compatibilidad-principal span {
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.detalles-uso {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.codigo-campo {
  color: #6c757d;
  font-weight: bold;
  font-size: 0.9em;
  margin-right: 5px;
}

.compatible {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.no-compatible {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.condicional {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Estados de carga y error */
.loading-container {
  text-align: center;
  padding: 40px;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  margin: 20px;
}

.error-container .error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-container .retry-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-container .retry-button:hover {
  background-color: #2980b9;
}
</style>