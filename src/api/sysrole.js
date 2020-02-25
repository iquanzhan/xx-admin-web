import request from "@/utils/request";



/**条件查询角色列表 */
export function fetchList(query) {
  return request({
    url: `/v1/sys-role`,
    method: "get",
    params: query
  });
}

/**详情 */
export function getDetails(id) {
  return request({
    url: `/v1/sys-role/${id}`,
    method: "get"
  });
}


/**获取所有角色列表 */
export function getRoles() {
  return request({
    url: `/v1/sys-role/all`,
    method: "get"
  });
}

/**根据角色Id获取角色列表 */
export function getRoleByRoleId(id) {
  return request({
    url: `/v1/sys-role/role/${id}`,
    method: "get"
  });
}
/**获取树形角色信息 */
export function getTreeRoles() {
  return request({
    url: `/v1/sys-role/tree/0`,
    method: "get"
  });
}

/**添加角色 */
export function createRole(data) {
  return request({
    url: "/v1/sys-role",
    method: "post",
    data
  });
}

/**修改角色 */
export function updateRole(data) {
  return request({
    url: `/v1/sys-role/${data.id}`,
    method: "put",
    data
  });
}

/**删除角色 */
export function deleteRole(id) {
  return request({
    url: `/v1/sys-role/${id}`,
    method: "delete"
  });
}


/**分配用户 */
export function dispatchUser(id, data) {
  return request({
    url: `/v1/sys-role/user/${id}`,
    method: "post",
    data
  });
}

/**分配资源 */
export function dispatchResource(id, data) {
  return request({
    url: `/v1/sys-role/resource/${id}`,
    method: "post",
    data
  });
}




