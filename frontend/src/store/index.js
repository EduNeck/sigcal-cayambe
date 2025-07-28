import { createStore } from 'vuex';

export default createStore({
  state: {
    idPredio: null,
    idTenencia: null,
    idVias: null,
    idBloque: null,
    idMejora: null,
    idFoto: null,
    idCiudadano: null,
    clave_catastral: null,
    tipoPredio: null,
    fotoUrl: null, // 📸 URL de la foto actual del predio
    tenenciasCount: 0, // 🏠 Contador de tenencias para reactividad
    viasCount: 0, // 🛣️ Contador de vías para reactividad
    bloquesCount: 0, // 🏗️ Contador de bloques para reactividad
    mejorasCount: 0, // 🔧 Contador de mejoras para reactividad
    user: JSON.parse(localStorage.getItem('user')) || {
      login: '',
      name: '',
      photo: '',
      priv_rol: '',
      priv_rol_sec: '',
      priv_tipo: '',
      priv_tipo_sec: '',
      valoraUrb: '',
      valoraRur: '',
      priv_admin: 'N',
      active: 'N'
    }
  },
  mutations: {
    setIdPredio(state, id) { state.idPredio = id; },
    clearIdPredio(state) { state.idPredio = null; },
    setIdTenencia(state, id) { state.idTenencia = id; },
    clearIdTenencia(state) { state.idTenencia = null; },
    setIdVia(state, id) { state.idVias = id; },
    clearIdVia(state) { state.idVias = null; },
    setIdBloque(state, id) { state.idBloque = id; },
    clearIdBloque(state) { state.idBloque = null; },
    setIdMejora(state, id) { state.idMejora = id; },
    clearIdMejora(state) { state.idMejora = null; },
    setIdFoto(state, id) { state.idFoto = id; },
    clearIdFoto(state) { state.idFoto = null; },
    setIdCiudadano(state, id) { state.idCiudadano = id; },
    clearIdCiudadano(state) { state.idCiudadano = null; },
    setClaveCatastral(state, clave) { state.clave_catastral = clave; },
    clearClaveCatastral(state) { state.clave_catastral = null; },
    setFotoUrl(state, url) { state.fotoUrl = url; }, // 📸 Mutation para URL de foto
    clearFotoUrl(state) { state.fotoUrl = null; },
    incrementTenenciasCount(state) { state.tenenciasCount++; }, // 🏠 Incrementar contador de tenencias
    resetTenenciasCount(state) { state.tenenciasCount = 0; }, // 🏠 Resetear contador de tenencias
    incrementViasCount(state) { state.viasCount++; }, // 🛣️ Incrementar contador de vías
    resetViasCount(state) { state.viasCount = 0; }, // 🛣️ Resetear contador de vías
    incrementBloquesCount(state) { state.bloquesCount++; }, // 🏗️ Incrementar contador de bloques
    resetBloquesCount(state) { state.bloquesCount = 0; }, // 🏗️ Resetear contador de bloques
    incrementMejorasCount(state) { state.mejorasCount++; }, // 🔧 Incrementar contador de mejoras
    resetMejorasCount(state) { state.mejorasCount = 0; }, // 🔧 Resetear contador de mejoras
    setUser(state, user) {
      state.user = {
        login: user.login,
        name: user.name,
        photo: user.photo,
        priv_rol: user.priv_rol,
        priv_rol_sec: user.priv_rol_sec,
        priv_tipo: user.priv_tipo,
        priv_tipo_sec: user.priv_tipo_sec,
        valoraUrb: user.valoraUrb,
        valoraRur: user.valoraRur,
        priv_admin: user.priv_admin,
        active: user.active
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearUser(state) {
      state.user = {
        login: '',
        name: '',
        photo: '',
        priv_rol: '',
        priv_rol_sec: '',
        priv_tipo: '',
        priv_tipo_sec: '',
        valoraUrb: '',
        valoraRur: '',
        priv_admin: 'N',
        active: 'N'
      };
      localStorage.removeItem('user');
    },
    setTipoPredio(state, tipo) {
      state.tipoPredio = tipo;
    }
  },
  actions: {
    updateIdPredio({ commit }, id) { commit('setIdPredio', id); },
    resetIdPredio({ commit }) { commit('clearIdPredio'); },
    updateIdTenencia({ commit }, id) { commit('setIdTenencia', id); },
    resetIdTenencia({ commit }) { commit('clearIdTenencia'); },
    updateIdVia({ commit }, id) { commit('setIdVia', id); },
    resetIdVia({ commit }) { commit('clearIdVia'); },
    updateIdBloque({ commit }, id) { commit('setIdBloque', id); },
    resetIdBloque({ commit }) { commit('clearIdBloque'); },
    updateIdMejora({ commit }, id) { commit('setIdMejora', id); },
    resetIdMejora({ commit }) { commit('clearIdMejora'); },
    updateIdFoto({ commit }, id) { commit('setIdFoto', id); },
    resetIdFoto({ commit }) { commit('clearIdFoto'); },
    updateIdCiudadano({ commit }, id) { commit('setIdCiudadano', id); },
    resetIdCiudadano({ commit }) { commit('clearIdCiudadano'); },
    updateClaveCatastral({ commit }, clave) { commit('setClaveCatastral', clave); },
    resetClaveCatastral({ commit }) { commit('clearClaveCatastral'); },
    updateUser({ commit }, user) { commit('setUser', user); },
    clearUser({ commit }) { commit('clearUser'); },
    updateTipoPredio({ commit }, tipo) { commit('setTipoPredio', tipo); },
    updateFotoUrl({ commit }, url) { commit('setFotoUrl', url); }, // 📸 Action para URL de foto
    resetFotoUrl({ commit }) { commit('clearFotoUrl'); },
    incrementTenenciasCount({ commit }) { commit('incrementTenenciasCount'); }, // 🏠 Action para incrementar contador
    resetTenenciasCount({ commit }) { commit('resetTenenciasCount'); }, // 🏠 Action para resetear contador
    incrementViasCount({ commit }) { commit('incrementViasCount'); }, // 🛣️ Action para incrementar contador
    resetViasCount({ commit }) { commit('resetViasCount'); }, // 🛣️ Action para resetear contador
    incrementBloquesCount({ commit }) { commit('incrementBloquesCount'); }, // 🏗️ Action para incrementar contador
    resetBloquesCount({ commit }) { commit('resetBloquesCount'); }, // 🏗️ Action para resetear contador
    incrementMejorasCount({ commit }) { commit('incrementMejorasCount'); }, // 🔧 Action para incrementar contador
    resetMejorasCount({ commit }) { commit('resetMejorasCount'); } // 🔧 Action para resetear contador
  },
  getters: {
    getIdPredio: (state) => state.idPredio,
    getIdTenencia: (state) => state.idTenencia,
    getIdVia: (state) => state.idVias,
    getIdBloque: (state) => state.idBloque,
    getIdMejora: (state) => state.idMejora,
    getIdFoto: (state) => state.idFoto,
    getIdCiudadano: (state) => state.idCiudadano,
    getClaveCatastral: (state) => state.clave_catastral,
    getFotoUrl: (state) => state.fotoUrl, // 📸 Getter para URL de foto
    getTenenciasCount: (state) => state.tenenciasCount, // 🏠 Getter para contador de tenencias
    getViasCount: (state) => state.viasCount, // 🛣️ Getter para contador de vías
    getBloquesCount: (state) => state.bloquesCount, // 🏗️ Getter para contador de bloques
    getMejorasCount: (state) => state.mejorasCount, // 🔧 Getter para contador de mejoras
    getTipoPredio: (state) => state.tipoPredio,
    isAuthenticated: (state) => !!state.user.login,
    userLogin: (state) => state.user.login,
    userName: (state) => state.user.name,
    userPhoto: (state) => state.user.photo,
    userValoraUrb: (state) => state.user.valoraUrb,
    userValoraRur: (state) => state.user.valoraRur,
    userAdmin: (state) => state.user.priv_admin,
    userActivo: (state) => state.user.active,
    userRolePrimario: (state) => state.user.priv_rol,
    userRoleSecundario: (state) => state.user.priv_rol_sec,
    userTypePrimario: (state) => state.user.priv_tipo,
    userTypeSecundario: (state) => state.user.priv_tipo_sec,

    isConsultaPrimario: (state) => state.user.priv_rol === 'C',
    isEditorPrimario: (state) => state.user.priv_rol === 'E',
    isConsultaSecundario: (state) => state.user.priv_rol_sec === 'C',
    isEditorSecundario: (state) => state.user.priv_rol_sec === 'E',

    canAccessUrbanoMenu: (state) =>
      (state.user.priv_tipo === 'U' || state.user.priv_tipo_sec === 'U') && state.user.active === 'Y',
    canAccessRuralMenu: (state) =>
      (state.user.priv_tipo === 'R' || state.user.priv_tipo_sec === 'R') && state.user.active === 'Y',

    canAccessValoracionUrb: (state) => state.user.valoraUrb === 'Y' && state.user.active === 'Y',
    canAccessValoracionRur: (state) => state.user.valoraRur === 'Y' && state.user.active === 'Y',

    canEditUrbano: (state) =>
      (state.user.priv_tipo === 'U' && state.user.priv_rol === 'E') ||
      (state.user.priv_tipo_sec === 'U' && state.user.priv_rol_sec === 'E'),
    canEditRural: (state) =>
      (state.user.priv_tipo === 'R' && state.user.priv_rol === 'E') ||
      (state.user.priv_tipo_sec === 'R' && state.user.priv_rol_sec === 'E'),

    canConsultUrbano: (state) =>
      (state.user.priv_tipo === 'U' && ['C', 'E'].includes(state.user.priv_rol)) ||
      (state.user.priv_tipo_sec === 'U' && ['C', 'E'].includes(state.user.priv_rol_sec)),
    canConsultRural: (state) =>
      (state.user.priv_tipo === 'R' && ['C', 'E'].includes(state.user.priv_rol)) ||
      (state.user.priv_tipo_sec === 'R' && ['C', 'E'].includes(state.user.priv_rol_sec)),

    isAdmin: (state) => state.user.priv_admin === 'Y',
  }
});
