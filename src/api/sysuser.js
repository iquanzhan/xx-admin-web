import request from "@/utils/request";

/**获取分页列表 */
export function fetchList(query) {
  return request({
    url: "/v1/sys-user",
    method: "get",
    params: query
  });
}

/**详情 */
export function getDetails(id) {
  return request({
    url: `/v1/sys-user/${id}`,
    method: "get"
  });
}


/**添加用户 */
export function createUser(data) {
  return request({
    url: "/v1/sys-user",
    method: "post",
    data
  });
}

/**修改用户 */
export function updateUser(data) {
  return request({
    url: `/v1/sys-user/${data.id}`,
    method: "put",
    data
  });
}

/**删除用户 */
export function deleteUser(id) {
  return request({
    url: `/v1/sys-user/${id}`,
    method: "delete"
  });
}

/**分配角色 */
export function dispatchRole(id,data) {
  return request({
    url: `/v1/sys-user/role/${id}`,
    method: "post",
    data
  });
}
