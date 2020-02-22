import Cookies from 'js-cookie'

const SettingKey = 'Global-Settings'

export function getSetting(key) {
  let setting = Cookies.get(SettingKey);
  if (setting) {
    setting = JSON.parse(setting);
    return setting[key];
  }
  return null;
}


export function setSetting(key, value) {
  let setting = Cookies.get(SettingKey);
  if (!setting) {
    setting = "{}";
  }
  setting = JSON.parse(setting);
  setting[key] = value;
  return Cookies.set(SettingKey, JSON.stringify(setting));
}

export function removeSetting() {
  return Cookies.remove(SettingKey);
}
