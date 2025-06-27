const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType } = require('docx');
const fs = require('fs');

// Cambia esto por tu host y puerto reales si es necesario
const HOST = "http://localhost";
const PORT = "3000";
const BASE = `${HOST}:${PORT}`;

// ...antes del arreglo tableRows...
const apis = [
  // ================= SEGURIDAD =================
  { nombre: "test", descripcion: "Ruta de prueba de seguridad", metodo: "GET", endpoint: "/test", parametros: "-" },
  { nombre: "autenticarUsuario", descripcion: "Autentica un usuario con login y contraseña", metodo: "POST", endpoint: "/autenticarUsuario", parametros: "login, pswd" },
  { nombre: "ingresaUsuario", descripcion: "Ingresa un nuevo usuario al sistema", metodo: "POST", endpoint: "/ingresaUsuario", parametros: "login, pswd, name, email, active, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural" },
  { nombre: "recuperaUsuario", descripcion: "Obtiene los datos de un usuario específico", metodo: "GET", endpoint: "/recuperaUsuario/:login", parametros: "login" },
  { nombre: "recuperaTodosUsuarios", descripcion: "Lista todos los usuarios del sistema", metodo: "GET", endpoint: "/recuperaTodosUsuarios", parametros: "-" },
  { nombre: "actualizaUsuario", descripcion: "Actualiza los datos de un usuario", metodo: "PUT", endpoint: "/actualizaUsuario/:login", parametros: "login, datos a actualizar" },
  { nombre: "cambiarEstadoUsuario", descripcion: "Cambia el estado (activo/inactivo) de un usuario", metodo: "PUT", endpoint: "/cambiarEstadoUsuario/:login", parametros: "login, active" },
  { nombre: "cambiarPrivAdmin", descripcion: "Cambia el privilegio de administrador de un usuario", metodo: "PUT", endpoint: "/cambiarPrivAdmin/:login", parametros: "login, priv_admin" },
  { nombre: "cambiarContrasena", descripcion: "Cambia la contraseña de un usuario", metodo: "PUT", endpoint: "/cambiarContrasena/:login", parametros: "login, pswd" },
  { nombre: "actualizarClaveUsuario", descripcion: "Actualiza la clave de un usuario", metodo: "PUT", endpoint: "/actualizarClaveUsuario", parametros: "login, claveAnterior, claveNueva" },
  { nombre: "creaUsuarioDibujo", descripcion: "Crea o actualiza un usuario de dibujo", metodo: "POST", endpoint: "/creaUsuarioDibujo", parametros: "username, password, role" },
  { nombre: "reseteaClaveUsuario", descripcion: "Resetea la clave de un usuario", metodo: "PUT", endpoint: "/reseteaClaveUsuario/:login", parametros: "login" },
  { nombre: "reseteaClaveDibujo", descripcion: "Resetea la clave de un usuario de dibujo", metodo: "PUT", endpoint: "/reseteaClaveDibujo/:username", parametros: "username, password" },

  // ================= VALORACION =================
  { nombre: "getAllValSueloCal", descripcion: "Obtiene todos los registros de valoracion_suelo_cal", metodo: "GET", endpoint: "/valoracion_suelo_cal", parametros: "-" },
  { nombre: "getAllValMejorasCal", descripcion: "Obtiene todos los registros de valoracion_mejoras_cal", metodo: "GET", endpoint: "/valoracion_mejoras_cal", parametros: "-" },
  { nombre: "getAllPredioResultadoUrb", descripcion: "Obtiene todos los registros de predio_resultado_urb", metodo: "GET", endpoint: "/predio_resultado_urb", parametros: "-" },
  { nombre: "getAllValoresPatrimonio", descripcion: "Obtiene todos los registros de valores_patrimonio_urb", metodo: "GET", endpoint: "/valores_patrimonio_urb", parametros: "-" },
  { nombre: "getAllTipologiaUrb", descripcion: "Obtiene todos los registros de valores_tipologia_urb", metodo: "GET", endpoint: "/valores_tipologia_urb", parametros: "-" },
  { nombre: "getAllFactorTamanioUrb", descripcion: "Obtiene todos los registros de factor_tamanio_urb", metodo: "GET", endpoint: "/factor_tamanio_urb", parametros: "-" },
  { nombre: "getAllFittoCorvini", descripcion: "Obtiene todos los registros de fitto_corvini", metodo: "GET", endpoint: "/fitto_corvini", parametros: "-" },
  { nombre: "getAllValoresComercialesPeritaje", descripcion: "Obtiene todos los registros de valores_comerciales_peritaje", metodo: "GET", endpoint: "/valoresComercialesPeritaje", parametros: "-" },
  { nombre: "ejecutaValoracion", descripcion: "Ejecuta la valoración", metodo: "POST", endpoint: "/ejecuta_valoracion", parametros: "pr_anio, var_tipo, pr_clave, var_usuario" },
  { nombre: "certificadoCatastralGeografico", descripcion: "Obtiene certificado catastral geográfico", metodo: "POST", endpoint: "/certificado_catastral_geografico", parametros: "codigo" },
  { nombre: "insertaCertificadoCatastral", descripcion: "Inserta certificado catastral", metodo: "PUT", endpoint: "/inserta-certificado-catastral", parametros: "tipo, anio, clave, usuario, codigo" },

  // ================= VALIDACIONES =================
  // (Agrupadas por tipo, todas GET con query param id)
  ...[
    'vcontrol_alicuotas_a','vcontrol_alicuotas_b','vcontrol_inconsistencia_alicuotas','vcontrol_ph_sin_fm','vcontrol_predios_con_porcentaje_exedente','vcontrol_predios_sin_geometria','vcontrol_predios_sin_servicios','vcontrol_predios_sin_uso','vcontrol_geo_discrepancia_zona_valor_tipo_predio',
    'vcontrol_bloques_geometrias_invalidas','vcontrol_bloques_no_digitados','vcontrol_bloques_sin_geometria','vcontrol_fichas_digitadas_por_usuario_b','vcontrol_predios_geometrias_invalidas','vcontrol_predios_no_digitados','vcontrol_predios_sin_vias',
    'vcontrol_bloques_urb','vcontrol_predios_sin_zona_valor',
    'vcontrol_overlaps_bloques','vcontrol_overlaps_predio','vcontrol_overlaps_zonas_valor','vcontrol_participacion_sin_cuadrar','vcontrol_predios_sin_foto','vcontrol_predios_sin_tenencia','vcontrol_registros_por_digitador','vcontrol_zonas_valor_geometrias_invalidas'
  ].map(ruta => ({
    nombre: ruta,
    descripcion: `Validación: ${ruta.replace(/_/g, ' ')}`,
    metodo: "GET",
    endpoint: `/${ruta}`,
    parametros: "id (query param)"
  })),

  // ================= REPORTE FICHA =================
  { nombre: "obtieneDatosPredio", descripcion: "Obtiene listado general de predios", metodo: "GET", endpoint: "/ficha_predio", parametros: "query params" },
  { nombre: "obtienePatrimonioPorId", descripcion: "Obtiene patrimonio urbano por ID de predio", metodo: "GET", endpoint: "/patrimonio-urbano/:id_predio", parametros: "id_predio" },
  { nombre: "obtieneFichaPredioPorId", descripcion: "Obtiene ficha_predio por ID", metodo: "GET", endpoint: "/ficha_predio/:id_predio", parametros: "id_predio" },
  { nombre: "obtieneFichaTenenciaPorId", descripcion: "Obtiene ficha de tenencia por ID de predio", metodo: "GET", endpoint: "/ficha_tenencia/:id_predio", parametros: "id_predio" },
  { nombre: "obtieneFichaBloquesPorId", descripcion: "Obtiene ficha de bloques por ID de bloque", metodo: "GET", endpoint: "/ficha_bloques/:id_bloques", parametros: "id_bloques" },
  { nombre: "obtieneFichaViasPorId", descripcion: "Obtiene ficha de vías por ID de vías", metodo: "GET", endpoint: "/ficha_vias/:id_vias", parametros: "id_vias" },
  { nombre: "obtieneFichaMejorasPorId", descripcion: "Obtiene ficha de mejoras por ID de mejoras", metodo: "GET", endpoint: "/ficha_mejoras/:id_mejoras", parametros: "id_mejoras" },
  { nombre: "obtieneDatosVisorPredio", descripcion: "Obtiene datos del visor del predio por ID", metodo: "GET", endpoint: "/datos_visor_predio/:id_predio", parametros: "id_predio" },

  // ================= PREDIOS AVALUO COMPLETO =================
  { nombre: "getPrediosAvaluoCompleto", descripcion: "Obtiene predios avaluo completo con filtros", metodo: "GET", endpoint: "/predios-avaluo", parametros: "query params" },

  // ================= PARAMETROS GENERALES =================
  { nombre: "getParametrosGenerales", descripcion: "Obtiene parámetros generales", metodo: "GET", endpoint: "/parametros_generales", parametros: "-" },

  // ================= GEO CONSULTAS =================
  { nombre: "getAreaPredio", descripcion: "Obtiene el área de un predio por clave catastral", metodo: "GET", endpoint: "/geo_consultas/area_predio/:codCat", parametros: "codCat" },

  // ================= CROQUIS =================
  { nombre: "getPredioExtentByCodCat", descripcion: "Obtiene la extensión (bbox) de un predio por clave catastral", metodo: "GET", endpoint: "/bbox_predio/:codCat", parametros: "codCat" },

  // ================= CERTIFICADO LINDEROS =================
  { nombre: "getCertificadoLinderosByClave", descripcion: "Obtiene certificado linderos por clave", metodo: "GET", endpoint: "/certificado-linderos/:clave", parametros: "clave" },
  { nombre: "updateGeoLinderosByClave", descripcion: "Actualiza geo_linderos por clave", metodo: "PUT", endpoint: "/actualiza-linderos/:clave", parametros: "clave, body" },

  // ================= CERTIFICADO CATASTRAL =================
  { nombre: "recuperaCertificado", descripcion: "Recupera todos los certificados", metodo: "GET", endpoint: "/certificados", parametros: "-" },
  { nombre: "recuperaCertificadoById", descripcion: "Recupera un certificado por ID", metodo: "GET", endpoint: "/certificado_by_id/:id", parametros: "id" },
  { nombre: "insertaCertificado", descripcion: "Inserta un nuevo certificado", metodo: "POST", endpoint: "/genera_certificado", parametros: "body" },
  { nombre: "actualizaCertificado", descripcion: "Actualiza un certificado existente", metodo: "PUT", endpoint: "/actualiza_certificado/:id", parametros: "id, body" },
  { nombre: "eliminaCertificado", descripcion: "Elimina un certificado", metodo: "DELETE", endpoint: "/elimina_certificado/:id", parametros: "id" },
  { nombre: "getCertificadoCatastralDetallePorClave", descripcion: "Obtiene datos completos de certificado catastral por clave catastral", metodo: "GET", endpoint: "/certificado_detalle_by_clave/:clave", parametros: "clave" },

  // ================= CATASTRO VIAS =================
  { nombre: "insertCatastroVias", descripcion: "Inserta un registro en catastro_vias", metodo: "POST", endpoint: "/inserta_vias", parametros: "body" },
  { nombre: "updateCatastroVias", descripcion: "Actualiza un registro en catastro_vias", metodo: "PUT", endpoint: "/actualiza_vias/:id", parametros: "id, body" },
  { nombre: "getCatastroViasById", descripcion: "Obtiene un registro de catastro_vias por ID", metodo: "GET", endpoint: "/vias_by_id/:id", parametros: "id" },
  { nombre: "getCatastroViasByIdVias", descripcion: "Obtiene un registro de catastro_vias por idVias", metodo: "GET", endpoint: "/vias_by_idVias/:id", parametros: "id" },
  { nombre: "getCatastroVistaViasByPredio", descripcion: "Obtiene un registro de la vista_vias_completa por id_predio", metodo: "GET", endpoint: "/vista_vias_by_idPredio/:id", parametros: "id" },
  { nombre: "deleteCatastroViasByIdVias", descripcion: "Elimina un registro de catastro_vias por idVias", metodo: "POST", endpoint: "/elimina_vias_by_id/:id", parametros: "id" },

  // ================= CATASTRO TENENCIA =================
  { nombre: "insertCatastroTenencia", descripcion: "Inserta nuevo registro en catastro_tenencia", metodo: "POST", endpoint: "/inserta_tenencia", parametros: "body" },
  { nombre: "updateCatastroTenencia", descripcion: "Actualiza un registro de catastro_tenencia por ID", metodo: "PUT", endpoint: "/actualiza_tenencia/:id", parametros: "id, body" },
  { nombre: "getCatastroTenenciaById", descripcion: "Obtiene un registro de catastro_tenencia por ID", metodo: "GET", endpoint: "/tenencia_by_id/:id", parametros: "id" },
  { nombre: "getListadoTenenciaByPredio", descripcion: "Obtiene todas las tenencias de un predio por ID de predio", metodo: "GET", endpoint: "/tenencia_by_predio/:predio", parametros: "predio" },
  { nombre: "deleteCatastroTenencia", descripcion: "Elimina una tenencia por ID", metodo: "DELETE", endpoint: "/elimina_tenencia_by_id/:id", parametros: "id" },
  { nombre: "insertMultiplesTenenciasBasicas", descripcion: "Inserta varias tenencias básicas", metodo: "POST", endpoint: "/inserta_varias_tenencias", parametros: "body" },

  // ================= CATASTRO PREDIO =================
  { nombre: "insertaIdentificacionPredio", descripcion: "Inserta un registro en catastro_predio", metodo: "POST", endpoint: "/inserta_identificacion_predio", parametros: "body" },
  { nombre: "updateCatastroPredio", descripcion: "Actualiza un registro en catastro_predio", metodo: "PUT", endpoint: "/actualiza_catastro_predio/:id", parametros: "id, body" },
  { nombre: "getCatastroPredioById", descripcion: "Obtiene un predio por ID", metodo: "GET", endpoint: "/catastro_predio_by_id/:id", parametros: "id" },
  { nombre: "getCatastroPredioByTipo", descripcion: "Obtiene un predio por tipo de predio", metodo: "GET", endpoint: "/catastro_predio_by_tipo/:tipo", parametros: "tipo" },
  { nombre: "updateCaracteristicasPredio", descripcion: "Actualiza características del predio", metodo: "PUT", endpoint: "/catastro_actualiza_caracteristicas/:id", parametros: "id, body" },
  { nombre: "updateObservaciones", descripcion: "Actualiza observaciones del predio", metodo: "PUT", endpoint: "/actualiza_observaciones/:id", parametros: "id, body" },
  { nombre: "deleteCatastroPredio", descripcion: "Elimina un predio por ID", metodo: "POST", endpoint: "/elimina_predio_by_id/:id", parametros: "id" },
  { nombre: "recuperaIdPredioByClave", descripcion: "Obtiene el id del predio por clave catastral", metodo: "GET", endpoint: "/recupera_id_predio_by_clave/:clave", parametros: "clave" },
  { nombre: "recuperaClaves", descripcion: "Recupera todas las claves catastrales", metodo: "GET", endpoint: "/claves_catastrales", parametros: "-" },
  { nombre: "updateCaracteristicasRurales", descripcion: "Actualiza características rurales de un predio", metodo: "PUT", endpoint: "/actualiza_caracteristicas_rurales/:id", parametros: "id, body" },

  // ================= CATASTRO PARROQUIA =================
  { nombre: "insertCatastroParroquia", descripcion: "Inserta una nueva parroquia", metodo: "POST", endpoint: "/inserta_parroquia", parametros: "body" },
  { nombre: "updateCatastroParroquia", descripcion: "Actualiza una parroquia por su ID", metodo: "PUT", endpoint: "/actualiza_parroquia_by_id/:id", parametros: "id, body" },
  { nombre: "getCatastroParroquiaById", descripcion: "Obtiene una parroquia por su ID", metodo: "GET", endpoint: "/parroquia_by_id/:id", parametros: "id" },
  { nombre: "deleteCatastroParroquiaById", descripcion: "Elimina una parroquia por ID", metodo: "DELETE", endpoint: "/elimina_parroquia_by_id/:id", parametros: "id" },

  // ================= CATASTRO MEJORAS =================
  { nombre: "insertCatastroMejoras", descripcion: "Inserta un registro en catastro_mejoras", metodo: "POST", endpoint: "/inserta_mejora", parametros: "body" },
  { nombre: "actualizaMejoras", descripcion: "Actualiza un registro en catastro_mejoras", metodo: "PUT", endpoint: "/actualiza_mejora/:id", parametros: "id, body" },
  { nombre: "recuperaMejorasByIdMejoras", descripcion: "Obtiene un registro de catastro_mejoras por ID", metodo: "GET", endpoint: "/mejora_by_id/:id", parametros: "id" },
  { nombre: "recuperaMejorasByIdPredio", descripcion: "Obtiene todos los registros de catastro_mejoras por id_predio", metodo: "GET", endpoint: "/mejoras_by_idPredio/:id", parametros: "id" },
  { nombre: "recuperaVistaMejorasByIdPredio", descripcion: "Obtiene todos los registros de la vista_obras_mejoras por id_predio", metodo: "GET", endpoint: "/vista_mejoras_by_idPredio/:id", parametros: "id" },
  { nombre: "eliminaMejoras", descripcion: "Elimina un registro de Mejoras por ID", metodo: "POST", endpoint: "/elimina_mejora_by_id/:id", parametros: "id" },

  // ================= CATASTRO DOCUMENTOS =================
  { nombre: "insertaDocumento", descripcion: "Inserta un nuevo documento", metodo: "POST", endpoint: "/inserta_documento", parametros: "body" },
  { nombre: "actualizaDocumento", descripcion: "Actualiza un documento por su ID", metodo: "PUT", endpoint: "/actualiza_documento_by_id/:id", parametros: "id, body" },
  { nombre: "obtieneDocumentoById", descripcion: "Obtiene un documento por su ID", metodo: "GET", endpoint: "/documento_by_id/:id", parametros: "id" },
  { nombre: "eliminaDocumento", descripcion: "Elimina un documento por ID", metodo: "DELETE", endpoint: "/elimina_documento_by_id/:id", parametros: "id" },
  { nombre: "obtieneDocumentos", descripcion: "Obtiene todos los documentos", metodo: "GET", endpoint: "/obtiene_documentos", parametros: "-" },

  // ================= CATASTRO CIUDADANO =================
  { nombre: "obtieneDatosCiudadano", descripcion: "Obtiene todos los registros de catastro_ciudadano (con filtros)", metodo: "GET", endpoint: "/recupera_ciudadano", parametros: "query params" },
  { nombre: "obtieneDatosCiudadanoById", descripcion: "Obtiene un ciudadano por ID", metodo: "GET", endpoint: "/recupera_ciudadano_by_id/:id", parametros: "id" },
  { nombre: "insertaCiudadano", descripcion: "Inserta un nuevo ciudadano", metodo: "POST", endpoint: "/inserta_ciudadano", parametros: "body" },
  { nombre: "actualizaCiudadanoByid", descripcion: "Actualiza ciudadano por ID", metodo: "PUT", endpoint: "/actualiza_ciudadano/:id", parametros: "id, body" },
  { nombre: "recuperaCiudadanoTenencia", descripcion: "Obtiene ciudadanos para tenencia", metodo: "GET", endpoint: "/ciudadano_tenencia", parametros: "-" },
  { nombre: "eliminaCiudadanoById", descripcion: "Elimina ciudadano por ID", metodo: "DELETE", endpoint: "/elimina_ciudadano_by_id/:id", parametros: "id" },

  // ================= CATASTRO BLOQUES =================
  { nombre: "insertCatastroBloques", descripcion: "Inserta un nuevo bloque", metodo: "POST", endpoint: "/inserta_bloque", parametros: "body" },
  { nombre: "updateCatastroBloques", descripcion: "Actualiza un bloque por su ID", metodo: "PUT", endpoint: "/actualiza_bloque_by_idBloque/:id", parametros: "id, body" },
  { nombre: "getCatastroBloquesById", descripcion: "Obtiene un bloque por su ID", metodo: "GET", endpoint: "/bloque_by_idBloque/:id", parametros: "id" },
  { nombre: "getCatastroBloquesByIdPredio", descripcion: "Obtiene bloque(s) por ID del predio", metodo: "GET", endpoint: "/bloque_by_idPredio/:id", parametros: "id" },
  { nombre: "getCatastroVistaBloquesByIdPredio", descripcion: "Obtiene vista completa de bloques por ID de predio", metodo: "GET", endpoint: "/vista_bloques_by_idPredio/:id", parametros: "id" },
  { nombre: "deleteCatastroBloquesById", descripcion: "Elimina un bloque por ID", metodo: "POST", endpoint: "/elimina_bloque_by_id/:id", parametros: "id" },

  // ================= CATALOGO =================
  { nombre: "getDescripcionById", descripcion: "Obtiene descripción por ID", metodo: "GET", endpoint: "/catalogo/:id", parametros: "id" },
  { nombre: "getCatalogoByTipoAtributo", descripcion: "Obtiene descripción por ID y Tipo", metodo: "GET", endpoint: "/catalogo/:id/:tipo", parametros: "id, tipo" },
  { nombre: "getCatalogoByTipoAtributoQuery", descripcion: "Obtiene todos los registros por tipo de atributo (query param)", metodo: "GET", endpoint: "/catalogo", parametros: "id_tipo_atributo" },
  { nombre: "getAllCatastroParroquia", descripcion: "Obtiene todas las parroquias", metodo: "GET", endpoint: "/catastro_parroquia", parametros: "-" },
  { nombre: "getProvincias", descripcion: "Obtiene todas las provincias", metodo: "GET", endpoint: "/catalogo_provincia", parametros: "-" },
  { nombre: "getCantonesByProvincia", descripcion: "Obtiene cantones por ID de provincia", metodo: "GET", endpoint: "/catalogo_cantonByProvincia/:id", parametros: "id" },
  { nombre: "getDescripcionById2", descripcion: "Obtiene descripción de catastro_catalogo por ID", metodo: "GET", endpoint: "/catalogo_descripcion/:id", parametros: "id" },
  { nombre: "getCatalogoDominio", descripcion: "Obtiene dominios del catálogo", metodo: "GET", endpoint: "/catalogo_dominios", parametros: "-" },
  { nombre: "updateCatalogoDominio", descripcion: "Actualiza dominio del catálogo", metodo: "PUT", endpoint: "/actualiza_catalogo_dominios/:id", parametros: "id, body" },
  { nombre: "getTipoAtributo", descripcion: "Obtiene id y descripcion de catastro_tipo_atributo", metodo: "GET", endpoint: "/tipo_atributo", parametros: "-" },

  // ================= CATALOGO PROVINCIA CANTON =================
  { nombre: "getProvincias2", descripcion: "Obtiene todas las provincias", metodo: "GET", endpoint: "/catalogo_provincia", parametros: "-" },
  { nombre: "getCantonesByProvincia2", descripcion: "Obtiene todos los cantones por ID de provincia", metodo: "GET", endpoint: "/catalogo_cantonByProvincia/:id", parametros: "id" },

  // ================= CATALOGO FOTOS =================
  { nombre: "insertFotoPredio", descripcion: "Inserta nueva foto en catalogo_fotos", metodo: "POST", endpoint: "/inserta_foto", parametros: "descripcion, principal, id_predio, foto" },
  { nombre: "updateFotoPredio", descripcion: "Actualiza una foto existente", metodo: "PUT", endpoint: "/actualiza_foto/:id", parametros: "id, body" },
  { nombre: "getFotoPredioById", descripcion: "Obtiene foto por ID", metodo: "GET", endpoint: "/foto_by_id/:id", parametros: "id" },
  { nombre: "getFotoPredioByIdPredio", descripcion: "Obtiene todas las fotos por ID de predio", metodo: "GET", endpoint: "/fotos_by_idPredio/:id", parametros: "id" },
  { nombre: "deleteFotoPredioById", descripcion: "Elimina foto por ID", metodo: "POST", endpoint: "/elimina_foto_by_id/:id", parametros: "id" },

  // ================= AVALUOS =================
  { nombre: "recuperaPatrimonioCertificado", descripcion: "Recupera datos de patrimonio certificado", metodo: "GET", endpoint: "/patrimonio-certificado", parametros: "clave_catastral, anio_proceso, tipo_predio" }
];

const tableRows = [
  new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ text: "Nombre", bold: true })], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ text: "Descripción", bold: true })], width: { size: 30, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ text: "Método", bold: true })], width: { size: 10, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ text: "Endpoint", bold: true })], width: { size: 25, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ text: "Parámetros", bold: true })], width: { size: 20, type: WidthType.PERCENTAGE } }),
    ]
  }),
  ...apis.map(api =>
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(api.nombre)] }),
        new TableCell({ children: [new Paragraph(api.descripcion)] }),
        new TableCell({ children: [new Paragraph(api.metodo)] }),
        new TableCell({ children: [new Paragraph(`${BASE}${api.endpoint}`)] }),
        new TableCell({ children: [new Paragraph(api.parametros)] }),
      ]
    })
  )
];

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "Informe de APIs de Seguridad",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          text: `Base URL: ${BASE}`,
          spacing: { after: 200 }
        }),
        new Table({
          rows: tableRows
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Informe_APIs_Seguridad.docx", buffer);
  console.log("Informe generado: Informe_APIs_Seguridad.docx");
});