const express = require('express');
const router = express.Router();
const tipoProyectoModel = require('../db/models/cemTipoProyecto');

// GET - Obtener todos los tipos de proyecto
router.get('/cem-obtieneProyectos', async (req, res) => {
    console.log('📨 GET /cem-obtienProyectos - Iniciando petición');
    try {
        console.log('⏳ Consultando base de datos...');
        const tipos = await tipoProyectoModel.obtieneProyectos();
        console.log('✅ Datos obtenidos:', tipos);
        res.json(tipos);
    } catch (error) {
        console.error('❌ Error al obtener tipos de proyecto:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

// GET - Obtener un tipo de proyecto por ID
router.get('/cem-tipoProyectosById/:id', async (req, res) => {
    try {
        const tipo = await tipoProyectoModel.proyectosById(req.params.id);
        if (tipo) {
            res.json(tipo);
        } else {
            res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener tipo de proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST - Crear un nuevo tipo de proyecto
router.post('/cem-creaTipoProyecto', async (req, res) => {
    try {
        const { descripcion } = req.body;
        if (!descripcion) {
            return res.status(400).json({ message: 'La descripción es requerida' });
        }
        const nuevoTipo = await tipoProyectoModel.insertaProyecto(descripcion);
        res.status(201).json(nuevoTipo);
    } catch (error) {
        console.error('Error al crear tipo de proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT - Actualizar un tipo de proyecto
router.put('/cem-actualizaTipoProyecto/:id', async (req, res) => {
    try {
        const { descripcion } = req.body;
        if (!descripcion) {
            return res.status(400).json({ message: 'La descripción es requerida' });
        }
        const tipoActualizado = await tipoProyectoModel.actualizaProyecto(req.params.id, descripcion);
        if (tipoActualizado) {
            res.json(tipoActualizado);
        } else {
            res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar tipo de proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE - Eliminar un tipo de proyecto
router.delete('/cem-eliminaTipoProyecto/:id', async (req, res) => {
    try {
        const tipoEliminado = await tipoProyectoModel.eliminaProyecto(req.params.id);
        if (tipoEliminado) {
            res.json({ message: 'Tipo de proyecto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar tipo de proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
