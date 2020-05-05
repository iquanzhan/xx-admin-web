import request from '@/utils/request'

const api_name = '/user'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  save(user) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: user
    })
  },

  updateById(user) {
    return request({
      url: `${api_name}/${user.id}`,
      method: 'put',
      data: user
    })
  },
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  saveAssign(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: { userId, roleId }
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  removeRows(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  }
}
