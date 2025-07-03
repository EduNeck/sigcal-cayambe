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
router.get('/cem-proyectos/:id', async (req, res) => {
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
router.post('/cem-proyectos', async (req, res) => {
    try {
        const camposRequeridos = [
            'cem_nombre',
            'cem_id_tipo_proyecto',
            'cem_usuario_sistema'
        ];

        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ 
                    message: `El campo ${campo} es requerido` 
                });
            }
        }

        const nuevoProyecto = await cemProyectos.create(req.body);
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
router.put('/cem-proyectos/:id', async (req, res) => {
    try {
        const camposRequeridos = [
            'cem_nombre',
            'cem_id_tipo_proyecto',
            'cem_usuario_sistema'
        ];

        for (const campo of camposRequeridos) {
            if (!req.body[campo]) {
                return res.status(400).json({ 
                    message: `El campo ${campo} es requerido` 
                });
            }
        }

        const proyectoActualizado = await cemProyectos.update(req.params.id, req.body);
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
router.delete('/cem-proyectos/:id', async (req, res) => {
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

module.exports = router;
