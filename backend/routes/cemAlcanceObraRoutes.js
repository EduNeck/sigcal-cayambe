const express = require('express');
const router = express.Router();
const CemAlcanceObra = require('../db/models/cemAlcanceObra');

// Obtener todos los alcances de obra
router.get('/cem-obtieneAlcances', async (req, res) => {
    try {
        console.log('📋 Obteniendo lista de alcances de obra...');
        const alcances = await CemAlcanceObra.obtenerAlcances();
        console.log('✅ Alcances obtenidos:', alcances.length);
        res.json(alcances);
    } catch (error) {
        console.error('❌ Error al obtener alcances:', error);
        res.status(500).json({ error: 'Error al obtener alcances de obra' });
    }
});

// Obtener un alcance de obra por ID
router.get('/cem-obtieneAlcance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando alcance de obra con ID: ${id}`);
        const alcance = await CemAlcanceObra.obtenerAlcancePorId(id);
        
        if (alcance) {
            console.log('✅ Alcance encontrado:', alcance);
            res.json(alcance);
        } else {
            console.log('⚠️ Alcance no encontrado');
            res.status(404).json({ error: 'Alcance de obra no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error al obtener alcance:', error);
        res.status(500).json({ error: 'Error al obtener alcance de obra' });
    }
});

// Crear un nuevo alcance de obra
router.post('/cem-creaAlcance', async (req, res) => {
    try {
        const { descripcion } = req.body;
        console.log('📝 Creando nuevo alcance de obra:', { descripcion });
        
        if (!descripcion) {
            return res.status(400).json({ error: 'La descripción es requerida' });
        }

        const nuevoAlcance = await CemAlcanceObra.crearAlcance(descripcion);
        console.log('✅ Alcance creado:', nuevoAlcance);
        res.status(201).json(nuevoAlcance);
    } catch (error) {
        console.error('❌ Error al crear alcance:', error);
        res.status(500).json({ error: 'Error al crear alcance de obra' });
    }
});

// Actualizar un alcance de obra
router.put('/cem-actualizaAlcance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        console.log(`📝 Actualizando alcance ID ${id}:`, { descripcion });

        if (!descripcion) {
            return res.status(400).json({ error: 'La descripción es requerida' });
        }

        const alcanceActualizado = await CemAlcanceObra.actualizarAlcance(id, descripcion);
        
        if (alcanceActualizado) {
            console.log('✅ Alcance actualizado:', alcanceActualizado);
            res.json(alcanceActualizado);
        } else {
            console.log('⚠️ Alcance no encontrado para actualizar');
            res.status(404).json({ error: 'Alcance de obra no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error al actualizar alcance:', error);
        res.status(500).json({ error: 'Error al actualizar alcance de obra' });
    }
});

// Eliminar un alcance de obra
router.delete('/cem-eliminaAlcance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Eliminando alcance ID: ${id}`);
        
        const alcanceEliminado = await CemAlcanceObra.eliminarAlcance(id);
        
        if (alcanceEliminado) {
            console.log('✅ Alcance eliminado:', alcanceEliminado);
            res.json({ mensaje: 'Alcance de obra eliminado exitosamente' });
        } else {
            console.log('⚠️ Alcance no encontrado para eliminar');
            res.status(404).json({ error: 'Alcance de obra no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error al eliminar alcance:', error);
        res.status(500).json({ error: 'Error al eliminar alcance de obra' });
    }
});

module.exports = router;
