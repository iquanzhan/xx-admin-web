import request from "@/utils/request";

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
