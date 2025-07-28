# 📸 Sistema de Reactividad de Fotos - SIGCAL

## Problema Original
Cuando se agregaba una foto en el componente `FormFotoPredio` y se navegaba al componente `FormIdentificacion`, la foto no aparecía hasta que se usara el botón "Refrescar".

## Soluciones Implementadas

### ✅ Solución 1: Event Bus con Composables (Recomendada)

**Archivo:** `composables/useFotoEvents.js`

```javascript
import { ref, watch, readonly } from 'vue'

const fotoUpdated = ref(0)

export default function useFotoEvents() {
  const emitFotoUpdated = () => {
    fotoUpdated.value++
    console.log('📸 Evento foto actualizada emitido:', fotoUpdated.value)
  }

  const onFotoUpdated = (callback) => {
    watch(fotoUpdated, callback, { immediate: false })
  }

  return {
    fotoUpdated: readonly(fotoUpdated),
    emitFotoUpdated,
    onFotoUpdated
  }
}
```

**En FormFotoPredio.vue:**
```javascript
import useFotoEvents from '@/composables/useFotoEvents';

export default {
  setup() {
    const { emitFotoUpdated } = useFotoEvents();
    return { emitFotoUpdated };
  },
  
  methods: {
    async guardar() {
      // ... código de guardado
      this.emitFotoUpdated(); // 📸 Emitir evento
    },
    
    async actualizar() {
      // ... código de actualización  
      this.emitFotoUpdated(); // 📸 Emitir evento
    },
    
    async eliminar() {
      // ... código de eliminación
      this.emitFotoUpdated(); // 📸 Emitir evento
    }
  }
}
```

**En FormIdentificacion.vue:**
```javascript
import useFotoEvents from '@/composables/useFotoEvents';

export default {
  setup() {
    const { onFotoUpdated } = useFotoEvents();
    return { onFotoUpdated };
  },
  
  async mounted() {
    // ... código existente
    
    // 📸 Configurar listener para actualizaciones de foto
    this.onFotoUpdated(() => {
      console.log('🔄 FormIdentificacion: Foto actualizada detectada, recargando...');
      if (this.getIdPredio) {
        this.recuperaFotos(this.getIdPredio);
      }
    });
  }
}
```

### ✅ Solución 2: Estado en Vuex Store

**En store/index.js:**
```javascript
state: {
  // ... otros estados
  fotoUrl: null, // 📸 URL de la foto actual del predio
},

mutations: {
  // ... otras mutaciones
  setFotoUrl(state, url) { state.fotoUrl = url; },
  clearFotoUrl(state) { state.fotoUrl = null; },
},

actions: {
  // ... otras acciones
  updateFotoUrl({ commit }, url) { commit('setFotoUrl', url); },
  resetFotoUrl({ commit }) { commit('clearFotoUrl'); }
},

getters: {
  // ... otros getters
  getFotoUrl: (state) => state.fotoUrl,
}
```

### ✅ Solución 3: Computed Reactivo

**En FormIdentificacion.vue:**
```javascript
computed: {
  // 📸 Computed para obtener la foto reactiva del store
  fotoRecuperadaUrlReactiva() {
    return this.getFotoUrl || this.fotoRecuperadaUrl || '';
  }
}
```

**En el template:**
```html
<!-- 📸 Usar computed reactivo -->
<v-img v-if="fotoRecuperadaUrlReactiva" :src="fotoRecuperadaUrlReactiva" class="custom-img">
  <div class="img-title">Foto Predio</div>
</v-img>
```

## Flujo de Trabajo

1. **Usuario agrega/actualiza/elimina foto** en `FormFotoPredio`
2. **Se ejecuta operación** en backend (guardar/actualizar/eliminar)
3. **Se actualiza lista de fotos** en el componente
4. **Se emite evento** `emitFotoUpdated()` usando el composable
5. **Se actualiza Vuex store** con la nueva URL de foto
6. **FormIdentificacion escucha el evento** y refresca automáticamente
7. **El computed reactivo** `fotoRecuperadaUrlReactiva` actualiza la vista

## Beneficios

- ✅ **Reactividad automática** entre componentes
- ✅ **No requiere refrescar manualmente**
- ✅ **Centralización del estado** en Vuex
- ✅ **Event bus desacoplado** usando composables
- ✅ **Fácil de mantener y extender**

## Uso en Otros Componentes

Para aplicar el mismo patrón a otros componentes:

```javascript
// 1. Importar el composable
import useFotoEvents from '@/composables/useFotoEvents';

// 2. En el setup()
setup() {
  const { emitFotoUpdated, onFotoUpdated } = useFotoEvents();
  return { emitFotoUpdated, onFotoUpdated };
},

// 3. Emitir eventos cuando se actualicen datos
async operacionQueModificaFoto() {
  // ... operación
  this.emitFotoUpdated();
}

// 4. Escuchar eventos en mounted()
async mounted() {
  this.onFotoUpdated(() => {
    // Código para actualizar la vista
  });
}
```

## Logs de Debugging

El sistema incluye logs para facilitar el debugging:
- `📸 Evento foto actualizada emitido: X`
- `🔄 FormIdentificacion: Foto actualizada detectada, recargando...`

Estos logs ayudan a rastrear el flujo de eventos entre componentes.
