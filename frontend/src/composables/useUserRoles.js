import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useUserRoles() {
  const store = useStore();

  const safeGetter = (getterName) => {
    try {
      return store.getters[getterName];
    } catch (error) {
      console.warn(`Getter "${getterName}" no disponible en store`, error);
      return false;
    }
  };

  const canEdit = computed(() =>
    safeGetter('isEditorPrimario') || safeGetter('isEditorSecundario')
  );

  const isConsulta = computed(() =>
    safeGetter('isConsultaPrimario') || safeGetter('isConsultaSecundario')
  );

  const isAdmin = computed(() => safeGetter('isAdmin'));

  const isValoradorUrbano = computed(() => safeGetter('userValoraUrb') === 'Y');
  const isValoradorRural = computed(() => safeGetter('userValoraRur') === 'Y');

  return {
    canEdit,
    isConsulta,
    isAdmin,
    isValoradorUrbano,
    isValoradorRural,
  };
}
