import Cookies from 'js-cookie'

const SettingKey = 'Global-Settings'

export function getSetting(key) {
  debugger;
  let setting = JSON.parse(Cookies.get(SettingKey));
  if (setting) {
    return setting[key];
  }
  return null;
}


export function setSetting(key, value) {
  debugger;
  let setting = JSON.parse(Cookies.get(SettingKey));
  if (!setting) {
    setting = {};
  }
  setting[key] = value;
  return Cookies.set(SettingKey, setting);
}

export function removeSetting() {
  return Cookies.remove(SettingKey);
}
