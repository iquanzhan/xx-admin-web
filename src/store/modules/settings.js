import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { getSetting, setSetting, removeSetting } from '@/utils/global-settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings


const state = {
  theme: getSetting("theme") || variables.theme,
  showSettings: showSettings,
  tagsView: getSetting("tagsView") || tagsView,
  fixedHeader: getSetting("fixedHeader") || fixedHeader,
  sidebarLogo: getSetting("sidebarLogo") || sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      setSetting(key, value);
      state[key] = getSetting(key);
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

