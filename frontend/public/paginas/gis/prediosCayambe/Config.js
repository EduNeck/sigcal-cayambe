
Ext.namespace("Heron");
Ext.namespace("Heron.options");
Ext.namespace("Heron.options.map");
Ext.namespace("Heron.options.layertree");
Ext.namespace("Heron.examples");
Ext.namespace("Heron.options.wfs");
Ext.namespace("Heron.widgets.MapPanel");
//Ext.namespace("Heron.options.bookmarks");


/**
 * Defines settings for the Heron App layout wihtin Layout.js.
 *
 * The layout specifies a hierarchy of ExtJS (Panel) and GeoExt and Heron MC components.
 * For convenience specific settings within this layout are defined here
 * for structuring and reuse purposes.
 *
 **/

OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
Ext.BLANK_IMAGE_URL = 'http://cdnjs.cloudflare.com/ajax/libs/extjs/3.4.1-1/resources/images/default/s.gif';

var dia = new Date()

var anio = dia.getFullYear()

var map2 = this.Heron.App.map;
var xhost = location.hostname;
var urlMapas = "http://".concat(xhost, "/geoserver/cayambe/wms");

function ExportaMap()
{
    console.log(this.target.mapPanel.map);
    for (var i=this.Heron.App.map.layers.length-1; i>=0; --i) {
	if(!this.Heron.App.map.layers[i].isBaseLayer){
	    this.Heron.App.map.layers[i].addOptions({metadata: {
						    wfs: {
							protocol: 'fromWMSLayer',
							downloadFormats: Heron.options.wfs.downloadFormats
						    }
						}});
	}
    };

    //console.log("Pruebita");
    //ef.target.href = this.Heron.App.map.getRenderer().getCanvas().toDataURL('image/png');
    //var canvas = OpenLayers.Util.getElement("gx-map-panel"); 
//                // set download url (toDataURL() requires the use of a proxy)
//                OpenLayers.Util.getElement("downloadLink").href = canvas.toDataURL('image/png');			       
//ef.target.href = canvas.toDataURL('image/png');			       
}



    
/*
 * Common settings for MapPanel
 * These will be assigned as "hropts" within the MapPanel config
 */

var exportMapControl;
var point1 = new OpenLayers.Geometry.Point(-9960659, -9300621);
//point1.transform(new OpenLayers.Projection("EPSG:32717"), new OpenLayers.Projection("EPSG:900913")); 

var point2 = new OpenLayers.Geometry.Point(-7438848, 556631);
//point2.transform(new OpenLayers.Projection("EPSG:32717"), new OpenLayers.Projection("EPSG:900913")); 

var bounds = new OpenLayers.Bounds();
bounds.extend(point1);
bounds.extend(point2);
bounds.toBBOX(); 

Heron.options.map.settings = {
    projection: 'EPSG:900913',
    displayProjection: new OpenLayers.Projection("EPSG:32717"),
    units: 'm',
    //resolutions: [860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105, 0.0525, 0.0275, 0.0135],
    //maxExtent: '-180.0, -90.0, 180.0, 90.0',
    //maxExtent: '-20037508.34, -20037508.34, 20037508.34, 20037508.34',
    maxExtent: bounds,
    restrictedExtent : bounds,
    center: '-8699153.675, 4466.291',
    xy_precision: 3,
    maxResolution: 'auto',
    max_features: 10,
    zoom: 14,
    theme: null,

    /**
     * Useful to always have permalinks enabled. default is enabled with these settings.
     * MapPanel.getPermalink() returns current permalink
     *
     **/
    permalinks: {
        /** The prefix to be used for parameters, e.g. map_x, default is 'map' */
        paramPrefix: 'map',

        /** Encodes values of permalink parameters ? default false*/
        encodeType: false,
        /** Use Layer names i.s.o. OpenLayers-generated Layer Id's in Permalinks */
        prettyLayerNames: true
    },
    //    controls:[new OpenLayers.Control.ExportMap()]
   
};


/** Create a config for the search panel. This panel may be embedded into the accordion
 * or bound to the "find" button in the toolbar. Here we use the toolbar button.
 */
Heron.examples.searchPanelConfig = {
    xtype: 'hr_multisearchcenterpanel',
    height: 600,
    hropts: [

{
    searchPanel: {
	xtype: 'hr_searchbydrawpanel',
	name: __('Search by Drawing'),
	header: false
    },
    resultPanel: {
	xtype: 'hr_featuregridpanel',
	id: 'hr-featuregridpanel',
	header: false,
	autoConfig: true,
	autoConfigMaxSniff: 100,
	//exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
	exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText'],
	gridCellRenderers: Heron.options.gridCellRenderers,
	hropts: {
	    zoomOnRowDoubleClick: true,
	    zoomOnFeatureSelect: false,
	    zoomLevelPointSelect: 8,
	    zoomToDataExtent: false
	}
    }
},
{
    searchPanel: {
	xtype: 'hr_searchbyfeaturepanel',
	name: __('Search by Feature Selection'),
	description: 'Select feature-geometries from one layer and use these to perform a spatial search in another layer.',
	header: false,
	border: false,
	bodyStyle: 'padding: 6px',
	style: {
	    fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
	    fontSize: '12px'
	}
    },
    resultPanel: {
	xtype: 'hr_featuregridpanel',
	id: 'hr-featuregridpanel',
	header: false,
	border: false,
	autoConfig: true,
	//exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
	exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText'],
	gridCellRenderers: Heron.options.gridCellRenderers,
	hropts: {
	    zoomOnRowDoubleClick: true,
	    zoomOnFeatureSelect: false,
	    zoomLevelPointSelect: 8,
	    zoomToDataExtent: false
	}
    }
},
{
    searchPanel: {
	xtype: 'hr_gxpquerypanel',
	name: __('Build your own searches'),
	description: 'This search uses both search within Map extent and/or your own attribute criteria',
	header: false,
	border: false,
	caseInsensitiveMatch: true,
	autoWildCardAttach: true
    },
    resultPanel: {
	xtype: 'hr_featuregridpanel',
	id: 'hr-featuregridpanel',
	header: false,
	border: false,
	autoConfig: true,
	//exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
	exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText'],
	gridCellRenderers: Heron.options.gridCellRenderers,
	hropts: {
	    zoomOnRowDoubleClick: true,
	    zoomOnFeatureSelect: false,
	    zoomLevelPointSelect: 8,
	    zoomToDataExtent: true
	}
    }
}
    ]
};



/*
 * Layers to be added to the map.
 * Syntax is defined in OpenLayers Layer API.
 * ("isBaseLayer: true" means the layer will be added as base/background layer).
 */
Heron.options.map.layers = [


			    /*
			     * Google Maps
			     */
/*
                            new OpenLayers.Layer.Google(
							"Google Streets", // the default
{type: google.maps.MapTypeId.ROADMAP, visibility: false},
{singleTile: false, buffer: 0, isBaseLayer: true}
							),

			    new OpenLayers.Layer.Google(
							"Google Satellite",
{type: google.maps.MapTypeId.SATELLITE, visibility: true},
{singleTile: false, buffer: 0, isBaseLayer: true}

							),

			    new OpenLayers.Layer.Google(
							"Google Terrain",
{type: google.maps.MapTypeId.TERRAIN, visibility: false},
{singleTile: false, buffer: 0, isBaseLayer: true}
							),
*/
			    /*
			     * Basemap OpenStreetMap
			     */
			   new OpenLayers.Layer.OSM(
			   null,
			   null,
			   {singleTile: false, buffer: 0, isBaseLayer: true, numZoomLevels: 21}
			   ),

    /*
     * Información General Catastral
     */

    

new OpenLayers.Layer.WMS(
			     "Manzana",
			     urlMapas,
{layers: "otavalo:geo_manzana_urb", transparent: true, format: 'image/png'},
{singleTile: true, opacity: 0.5, isBaseLayer: false, visibility: false,  noLegend: false, transitionEffect: 'resize', YX:{'EPSG:32717':false}, queryable: true
 , metadata: {
	wfs: {
	    protocol: 'fromWMSLayer',
	    downloadFormats: Heron.options.wfs.downloadFormats
	}
    }
}),

new OpenLayers.Layer.WMS(
			     "Predios",
			     urlMapas,
{layers: "otavalo:geo_predio_urb", transparent: true, format: 'image/png'},
{singleTile: true, opacity: 0.5, isBaseLayer: false, visibility: false,  noLegend: false, transitionEffect: 'resize', YX:{'EPSG:32717':false}, queryable: true
 , metadata: {
	wfs: {
	    protocol: 'fromWMSLayer',
	    downloadFormats: Heron.options.wfs.downloadFormats
	}
    }
}),

new OpenLayers.Layer.WMS(
			     "Bloques",
			     urlMapas,
{layers: "otavalo:geo_bloque_urb", transparent: true, format: 'image/png'},
{singleTile: true, opacity: 0.5, isBaseLayer: false, visibility: false,  noLegend: false, transitionEffect: 'resize', YX:{'EPSG:32717':false}, queryable: true
 , metadata: {
	wfs: {
	    protocol: 'fromWMSLayer',
	    downloadFormats: Heron.options.wfs.downloadFormats
	}
    }
}),






];
 
// See ToolbarBuilder.js : each string item points to a definition
// in Heron.ToolbarBuilder.defs. Extra options and even an item create function
// can be passed here as well. "-" denotes a separator item.
Heron.options.map.toolbar = [
    {type: "featureinfo", options: {
	    //pressed: true,
	    popupWindow: {
		width: 460,
		height: 200,
		featureInfoPanel: {
		    showTopToolbar: true,
			infoFormat: 'application/vnd.ogc.gml',
			//infoFormat: 'text/html',
		    // Option values are 'Table' and 'Detail', default is 'Table'
		    displayPanels: ['Table', 'Detail'],
		    // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
		    //  exportFormats: ['CSV', 'XLS', 'GMLv2', 'Shapefile', 'GeoJSON', 'WellKnownText'],
                    //exportFormats: ['CSV', 'XLS', 'GMLv2', 'Shapefile', 'GeoJSON', 'GeoPackage'],
			exportFormats: ['CSV', 'XLS', 'GMLv2', 'GeoJSON', 'GeoPackage'],
		    //hideColumns: ['objectid', 'gid', 'Foto'],
			gridCellRenderers: [                                           
                                            {
                                                featureType: 'geo_predio_urb',
                                                attrName: 'clave_vinculo',
                                                renderer: {
                                                    fn: Heron.widgets.GridCellRenderer.browserPopupLink,
                                                    options: {
                                                        
							url: 'http://'.concat(xhost,'/sigcalotavalo/visor_datos_predio/index.php?predio_busqueda={id_predio}'),
                                                        winName: 'hrdemoWin',
                                                        bReopen: false,
                                                        hasMenubar: false,
                                                        hasToolbar: false,
                                                        hasAddressbar: false,
                                                        hasStatusbar: false,
                                                        hasScrollbars: true,
                                                        isResizable: true,
                                                        hasPos: true,
                                                        xPos: 10,
                                                        yPos: 20,
                                                        hasSize: true,
                                                        wSize: 800,
                                                        hSize: 600,
                                                        attrPreTxt: 'Link: '
                                                    }
                                                }
                                            }
                                        ],
		    maxFeatures: 10,
		    autoConfigMaxSniff: 10,

		    // In case that the same layer would be requested more than once: discard the styles
		    discardStylesForDups: true
		}
	    }
	}},
    {type: "pan"},
    {type: "-"} ,
    {type: "zoomin"},
    {type: "zoomout"},
    {type: "zoomvisible"},
    {type: "-"} ,
    {type: "zoomprevious"},
    {type: "zoomnext"},
    {type: "-"},
    //{type: "coordinatesearch", options: {onSearchCompleteZoom: 8, projection: 'EPSG:32717'}},
    {type: "coordinatesearch", options: {
	    formWidth: 320, formPageX: 15, formPageY: 100
	    , titleDescription: 'Elija un sistema de proyeccion de coordenadas: Coordenadas X/Y(UTM) o geograficas  Lon/Lat.<br>&nbsp;<br>', titleDescriptionStyle: 'font-size:11px; color:black;', bodyBaseCls: 'x-form-back', bodyItemCls: 'hr-html-panel-font-size-11', bodyCls: 'hr-html-panel-font-size-11', fieldMaxWidth: 200, fieldLabelWidth: 80, fieldLabelStyle: 'color: darkblue', layerName: 'Locatie NL - RD', onProjectionIndex: 1, onZoomLevel: -1, showProjection: true, showZoom: true, showAddMarkers: true, checkAddMarkers: true, showHideMarkers: true, checkHideMarkers: false, removeMarkersOnClose: true, showRemoveMarkersBtn: true, buttonAlign: 'center'// left, center, right
	    , hropts: [
{
    projEpsg: 'EPSG:4326', projDesc: 'EPSG:4326 - WGS 84', fieldLabelX: 'Lon [grados]', fieldLabelY: 'Lat [Grados]', fieldEmptyTextX: 'Introduzca la longitud...', fieldEmptyTextY: 'Introduzca la Latitud...', fieldMinX: -82.652, fieldMinY: -5.808, fieldMaxX: -74.006, fieldMaxY: 2.124, iconWidth: 32, iconHeight: 32, localIconFile: 'bluepin.png', iconUrl: null
},
{
    projEpsg: 'EPSG:32717', projDesc: 'EPSG:32717 - WGS 84 / 17S', fieldLabelX: 'X [m]', fieldLabelY: 'Y [m]', fieldEmptyTextX: 'Introduzca la coordenada X...', fieldEmptyTextY: 'Introduzca la coordenada Y...', fieldMinX: 377570.045, fieldMinY: 9401774.061, fieldMaxX: 1241453.413, fieldMaxY: 10218571.582, iconWidth: 32, iconHeight: 32, localIconFile: 'redpin.png', iconUrl: null
}

        ]
	}},

    {type: "-"} ,
    {type: "measurelength", options: {geodesic: true}},
    {type: "measurearea", options: {geodesic: true}},
    {type: "-"} ,
    {
        type: "searchcenter",
        // Options for SearchPanel window
        options: {
            show: false,

            searchWindow: {
                title: __('Multiple Searches'),
                x: 100,
                y: undefined,
                width: 360,
                height: 440,
                items: [
                    Heron.examples.searchPanelConfig
                ]
            }
        }
    },
    {type: "-"} ,
    // {type: "upload", options: {
	    // upload: {
		// layerName: 'Dato subido',
		// url: Heron.globals.serviceUrl,
		// formats: [
                // {name: 'ESRI Shapefile (zipped, WGS84/EPSG:4326)', fileExt: '.zip', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON'},
                // {name: 'ESRI Shapefile (zipped, WGS84 17S EPSG:32717)', fileExt: '.zip', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON', fileProjection: new OpenLayers.Projection('EPSG:32717')},
                // {name: 'ESRI Shapefile (zipped, Any Projection)', fileExt: '.zip', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON', targetSrs : 'EPSG:4326'},
                // {name: 'Well-Known-Text (WKT)', fileExt: '.wkt', mimeType: 'text/plain', formatter: 'OpenLayers.Format.WKT'},
                // {name: 'Geographic Markup Language - v2 (GML2)', fileExt: '.gml', mimeType: 'text/xml', formatter: 'OpenLayers.Format.GML'},
                // {name: 'Geographic Markup Language - v3 (GML3)', fileExt: '.gml', mimeType: 'text/xml', formatter: 'OpenLayers.Format.GML.v3'},
                // {name: 'GeoJSON, WGS84/EPSG:4326', fileExt: '.json', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON'},
                // {name: 'GeoJSON, Dutch RD EPSG:28992', fileExt: '.json', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON', sourceSrs : 'EPSG:28992', targetSrs : 'EPSG:4326'},
                // {name: 'GPS Exchange Format (GPX)', fileExt: '.gpx', mimeType: 'text/xml', formatter: 'OpenLayers.Format.GPX'},
                // {name: 'Keyhole Markup Language (KML)', fileExt: '.kml', mimeType: 'text/xml', formatter: 'OpenLayers.Format.KML'},
                // {name: 'CSV (with X,Y)', fileExt: '.csv', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON'},
                // {name: 'OGC GeoPackage (1 layer, Dutch RD EPSG:32717)', fileExt: '.gpkg', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON', fileProjection: new OpenLayers.Projection('EPSG:32717')},
                // {name: 'OGC GeoPackage (1 layer, WGS84/EPSG:4326)', fileExt: '.gpkg', mimeType: 'text/plain', formatter: 'OpenLayers.Format.GeoJSON'}
			  // ],
		// // For custom projections use Proj4.js
		// fileProjection: new OpenLayers.Projection('EPSG:32717')
	    // }
	// }},
        // {type: "-"},
    //{type: "addbookmark"},
    //{type: "mapopen"},
    // {type: "mapsave", options : {
	    // mime: 'text/xml',
	    // fileName: 'mapa_senagua',
	    // fileExt: '.cml'
	// }},
    {
     create: function (mapPanel, options) {

	    // A trivial handler
	    options.handler = function () {
		console.log(this);
		//ExportMap();
		alert(options.msg);
	    };

	    // Provide an ExtJS Action object
	    // If you use an OpenLayers control, you need to provide a GeoExt Action object.
	    return new Ext.Action(options);
	},

     /* Options to be passed to your create function. */
     // options: {
	    // tooltip: 'My Item',
	    // iconCls: "icon-map-save",
	    // enableToggle: false,
	    // pressed: false,
	    // id: "myitem",
	    // toggleGroup: "toolGroup",
	    // //	    control: OpenLayers.Control.ExportMap(),
		// contentUrl: 'help.html',
	    // msg: 'Hello from my toolbar item'
     // }
    },
    {type: "->"} ,
    // {type: "any",
     // options: {
	    // text: 'Mapas Predeterminados',
	    // iconCls: 'bmenu',
	    // menu: {
		// items: [
                       // {
			   // text: 'Balance Hidrico',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoBalanceHidrico();
			   // }
		       // },
                       // {
			   // text: 'Calidad del Agua',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoCalidadAgua();
			   // }
		       // },
                       // {
			   // text: 'Conflictos',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoConflictos();
			   // }
		       // },
                       // {
			   // text: 'Cuerpos Hidricos y Fuentes',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoCuerposHidricos();
			   // }
		       // },
                       // {
			   // text: 'Emergencias Hidricas',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoEmergencias();
			   // }
		       // },
                       // {
			   // text: 'Gestion Ambiental',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoGestionAmbiental();
			   // }
		       // },
                       // {
			   // text: 'Participacion Social',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoParticipacionSocial();
			   // }
		       // },
                       // {
			   // text: 'Planificacion',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoProyectos();
			   // }
		       // },
                       // {
			   // text: 'Registro de la Informacion',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoRegistro();
			   // }
		       // },
                       // {
			   // text: 'Seguimiento y Control',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoSeguimiento();
			   // }
		       // },
                       // {
			   // text: 'Uso y Aprobechamiento',
			   // handler: function () {
			       // EliminaLy();
			       // CargaTipoUsoAprovechamiento();
			   // }
		       // }
			// ]
	    // }
	// }
    // },
    
    {type: "scale", options: {width: 110}},
    {type: "-"} ,
    //{type: "help", options: {tooltip: 'Abre Reporte de predio', contentUrl: 'help.html'}},
	{type: "help", options: {tooltip: 'Abre Reporte de predio', contentUrl: 'help.html'}}
	
];


Heron.options.bookmarks =
        [
	 {
	     id: 'id_demarcaciones',
	     name: 'Demarcaciones Hidrografcas',
	     desc: 'Delimitacion de las Demarcaciones Hidrograficas del Ecuador',
	     layers: ['Demarcaciones'],
	     x: -8756625,
	     y: -168776,
	     zoom: 7
	 },
	 {
	     id: 'id_info_base',
	     name: 'Informacion Base',
	     desc: 'Informacion Base del Ecuador',
	     layers: ['dpa_provincias'],
	     x: -8756625,
	     y: -168776,
	     zoom: 7
	 }
	 ];
/**
 * Defines the entire layout of a Heron webapp using ExtJS-style.
 *
 * The layout specifies a hierarchy of ExtJS (Panel) components.
 * Each component is either a container of components (xtype: 'panel', i.e. an ExtJS Panel)
 * or a specific leaf component like a map panel (xtype: 'hr_mappanel') or simple HTML
 * panel (xtype: 'hr_htmlpanel'). Each component has a 'xtype' string and component-specific options.
 * The 'xtype' defines the component widget class.
 **/

Heron.layout = {
    xtype: 'panel',
    /* Optional ExtJS Panel properties here, like "border", see ExtJS API docs. */
    id: 'hr-container-main',
    layout: 'border',
    border: false,
//    title: '&nbsp;',

    /** Any classes in "items" and nested items are automatically instantiated (via "xtype") and added by ExtJS. */
    items: [

        {
            xtype: 'hr_gxplayerpanel',
            id: 'gxplayerpanel',
            region: "west",
            autoScroll: true,
            border: true,
	    collapsible: true,
    	    header: true,
            width: 320,
            // configuration of all tool plugins for this application
 	    tools: [
                {
                    // ptype: "gxp_layertree",
                    ptype: "gxp_layermanager",

                    outputConfig: {
                        id: "layertree",
                        title: __('Layers'),
                        border: false,
                        collapsible: true,
			tbar: [] // we will add buttons to "tree.bbar" later
                    },
                    outputTarget: "gxplayerpanel"
                },
                {
                    ptype: "gxp_addlayers",
                    actionTarget: "layertree.tbar",
                    //addActionText: __('Add layers'),
                    templatedLayerGrid: true,
                    layerGridWidth: 440,
                    layerGridHeight: 500,
                    layerPreviewWidth: 40,
                    layerPreviewHeight: 40,
                    owsPreviewStrategies: ['attributionlogo', 'getlegendgraphic', 'randomcolor'],
                    defaultSrs: null
                    /*,search: {selectedSource: "opengeosuite"}   */
                },
                {
                    ptype: "gxp_removelayer",
                    actionTarget: "layertree.tbar",
                    //removeActionText: __('Remove layer')
                },
                {
                    ptype: "gxp_removelayer",
                    actionTarget: "layertree.contextMenu"
                },
                {
                    ptype: "gxp_layerproperties",
                    outputConfig: {defaults: {autoScroll: true}, width: 400, autoHeight: true},
                    actionTarget: ["layertree.tbar", "layertree.contextMenu"]
//                    actionTarget: ["layertree.contextMenu"]
//                    outputTarget: "layertree"
                },
                //{
                //    ptype: "gxp_styler",
                //    outputConfig: {autoScroll: true, width: 320},
                //    actionTarget: ["layertree.tbar", "layertree.contextMenu"]
//                    actionTarget: ["layertree.contextMenu"],
//                    outputTarget: "layertree"
                //},

                {
                    ptype: "gxp_zoomtolayerextent",
                    actionTarget: {target: "layertree.contextMenu", index: 0}
                },
                {
                     ptype: "gxp_opacityslider",
                    actionTarget: ["layertree.tbar", "layertree.contextMenu"]
		},
            ],

            // layer sources
            defaultSourceType: "gxp_wmssource",
            sources: {
		local: {
		    url: urlMapas,
		    version: "1.1.1",
		    title: 'Catastro'
                },
		igmbase:{
		    url: "http://www.geoportaligm.gob.ec/geoserver/mapabase/wms",
		    version: "1.1.1",
		    title: 'IGM Mapa Base'
		},
		igmmillon:{
		    url: "http://www.geoportaligm.gob.ec/nacional/wms",
		    version: "1.1.1",
		    title: 'IGM Mapa 1.000.000'
		},
		igm250k:{
		    url: "http://www.geoportaligm.gob.ec/regional/wms",
		    version: "1.1.1",
		    title: 'IGM Mapa 250.000'
		},
		igm50k:{
		    url: "http://www.geoportaligm.gob.ec/50k/wms",
		    version: "1.1.1",
		    title: 'IGM Mapa 50.000'
		},
		igm25k: {
		    url: "http://www.geoportaligm.gob.ec/25k/wms",
		    version: "1.1.1",
		    title: 'IGM Mapa 25.000'
		},
		google: {
		    ptype: "gxp_googlesource"
                },
		osm: {
		    ptype: "gxp_osmsource"
                }
            }
        },

        {
            xtype: 'hr_mappanel',
            id: 'hr-map',
            region: 'center',
            collapsible: false,
            border: true,
            hropts: Heron.options.map
        }/*,
{
            xtype: 'hr_gxplayerpanel',
            id: 'gxplayerpanel2',
            region: "east",
            layout: 'accordion',
            title: __('Informacion General'),
            border: true,
	    collapsible: true,
    	    header: true,
            width: 320,
            // configuration of all tool plugins for this application
            	    items:[
{    xtype: 'hr_bookmarkspanel',
    id: 'hr-bookmarks',
            collapsible: true,
            border: true,
    hropts: Heron.options.bookmarks
}			   ],
}*/
    ]
};
console.log(this.Target);
