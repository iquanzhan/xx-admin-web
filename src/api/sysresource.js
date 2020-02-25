import request from "@/utils/request";


/**根据角色Id获取资源列表 */
export function getResourceByRoleId(id) {
  return request({
    url: `/v1/sys-role/resource/${id}`,
    method: "get"
  });
}

/**获取树形资源信息 */
export function getTreeResource() {
  return request({
    url: `/v1/sys-resource/tree/0`,
    method: "get"
  });
}

