import request from "@/utils/request";

/**获取所有角色列表 */
export function getRoles() {
  return request({
    url: `/v1/sys-role/all`,
    method: "get"
  });
}

/**根据用户Id获取角色列表 */
export function getRoleByUserId(id) {
  return request({
    url: `/v1/sys-user/user/${id}`,
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
