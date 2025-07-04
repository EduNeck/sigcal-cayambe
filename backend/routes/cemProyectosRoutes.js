const express = require('express');
const router = express.Router();
const cemProyectos = require('../db/models/cemProyectos');

// GET - Obtener todos los proyectos
router.get('/cem-proyectos', async (req, res) => {
    try {
        const proyectos = await cemProyectos.obtieneProyectos();
        res.json(proyectos);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET - Obtener un proyecto por ID
router.get('/proyectos-cem-ById/:id', async (req, res) => {
    try {
        const proyecto = await cemProyectos.proyectoById(req.params.id);
        if (proyecto) {
            res.json(proyecto);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST - Crear un nuevo proyecto
router.post('/inserta-proyectos-cem', async (req, res) => {
    try {
        const nuevoProyecto = await cemProyectos.insertaProyecto(req.body);
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

// PUT - Actualizar un proyecto
router.put('/actualiza-cem-proyectos/:id', async (req, res) => {
    try {
        const proyectoActualizado = await cemProyectos.actualizaProyecto(req.params.id, req.body);
        if (proyectoActualizado) {
            res.json(proyectoActualizado);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

// DELETE - Eliminar un proyecto
router.delete('/elimina-cem-proyectos/:id', async (req, res) => {
    try {
        const proyectoEliminado = await cemProyectos.eliminaProyecto(req.params.id);
        if (proyectoEliminado) {
            res.json({ message: 'Proyecto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

// GET - Obtener todos los predios por proyecto
router.get('/cem-predios-proyecto', async (req, res) => {
    try {
        const predios = await cemProyectos.obtienePrediosPorProyecto();
        res.json(predios);
    } catch (error) {
        console.error('Error al obtener predios por proyecto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

// GET - Obtener predios por ID de proyecto
router.get('/cem-predios-proyecto/:id', async (req, res) => {
    try {
        const predios = await cemProyectos.obtienePrediosPorProyectoId(req.params.id);
        if (predios && predios.length > 0) {
            res.json(predios);
        } else {
            res.status(404).json({ message: 'No se encontraron predios para este proyecto' });
        }
    } catch (error) {
        console.error('Error al obtener predios del proyecto:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});

module.exports = router;
