import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { getSetting, setSetting, removeSetting } from '@/utils/global-settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings


const state = {
  theme: getSetting("theme") == null ? variables.theme : getSetting("theme"),
  showSettings: showSettings,
  tagsView: getSetting("tagsView") == null ? tagsView : getSetting("tagsView"),
  fixedHeader: getSetting("fixedHeader") == null ? fixedHeader : getSetting("fixedHeader"),
  sidebarLogo: getSetting("sidebarLogo") == null ? sidebarLogo : getSetting("sidebarLogo")
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      setSetting(key, value);
      state[key] = getSetting(key);
    }
  },
  RESET_SETTING: (state) => {
    removeSetting();
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  resetSetting({ commit }) {
    commit('RESET_SETTING');
    state["theme"] = variables.theme;
    state["tagsView"] = tagsView;
    state["fixedHeader"] = fixedHeader;
    state["sidebarLogo"] = sidebarLogo;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

