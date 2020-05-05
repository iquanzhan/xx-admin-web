import request from '@/utils/request'

const api_name = '/permission'

export default {
  getNestedTreeList() {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  saveLevelOne(menu) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: menu
    })
  },
  update(menu) {
    return request({
      url: `${api_name}/${menu.id}`,
      method: 'put',
      data: menu
    })
  },
  toAssign(roleId) {
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },
  doAssign(roleId, permissionId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: { roleId, permissionId }
    })
  }
}
